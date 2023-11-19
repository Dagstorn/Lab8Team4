import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vms_mobile/constants.dart';
import 'package:vms_mobile/models/types.dart';
import 'package:geocoding/geocoding.dart';
import 'package:location/location.dart' as my_location;
import 'package:flutter_polyline_points/flutter_polyline_points.dart';
import 'package:http/http.dart' as http;

class TaskMap extends StatefulWidget {
  final Task task;
  final VoidCallback updateDataCallback;

  const TaskMap(
      {super.key, required this.task, required this.updateDataCallback});

  @override
  State<TaskMap> createState() => _TaskMapState();
}

class _TaskMapState extends State<TaskMap> {
  final Completer<GoogleMapController> _controller =
      Completer<GoogleMapController>();
  Set<Marker> markers = {};
  my_location.Location _locationController = new my_location.Location();
  LatLng? _currentP;
  Map<PolylineId, Polyline> polylines = {};
  bool inTask = false;
  SharedPreferences? _prefs;
  String? distance;

  static const CameraPosition initialPosition = CameraPosition(
    target: LatLng(51.089863, 71.402145),
    zoom: 14.4746,
  );

  static const CameraPosition _kLake = CameraPosition(
      bearing: 192.8334901395799,
      target: LatLng(37.43296265331129, -122.08832357078792),
      tilt: 59.440717697143555,
      zoom: 19.151926040649414);

  Future<void> _goToTheLake() async {
    final GoogleMapController controller = await _controller.future;
    await controller.animateCamera(CameraUpdate.newCameraPosition(_kLake));
  }

  @override
  void initState() {
    super.initState();
    initRoute();
  }

  Future<void> getLocationUpdates() async {
    bool _serviceEnabled;
    my_location.PermissionStatus _permissionGranted;
    _serviceEnabled = await _locationController.serviceEnabled();
    if (_serviceEnabled) {
      _serviceEnabled = await _locationController.requestService();
    } else {
      return;
    }
    _permissionGranted = await _locationController.hasPermission();
    if (_permissionGranted == my_location.PermissionStatus.denied) {
      _permissionGranted = await _locationController.requestPermission();
      if (_permissionGranted != my_location.PermissionStatus.granted) {
        return;
      }
    }
    _locationController.onLocationChanged
        .listen((my_location.LocationData currentLocation) {
      if (currentLocation.latitude != null &&
          currentLocation.longitude != null) {
        Set<Marker> newSet = Set.from(markers);
        newSet.add(
          Marker(
            markerId: const MarkerId('currentLocation'),
            position:
                LatLng(currentLocation.latitude!, currentLocation.longitude!),
            infoWindow: const InfoWindow(title: 'Current location'),
          ),
        );
        setState(() {
          markers = newSet;
          _currentP =
              LatLng(currentLocation.latitude!, currentLocation.longitude!);
          cameraToPosition(_currentP!);
        });
        print(_currentP);
      }
    });
  }

  void initRoute() async {
    List<Location> startPointData =
        await locationFromAddress(widget.task.fromPoint);
    List<Location> endPointData =
        await locationFromAddress(widget.task.toPoint);
    if (startPointData.isNotEmpty && endPointData.isNotEmpty) {
      Location startPoint = startPointData.first;
      Location endPoint = endPointData.first;

      final GoogleMapController controller = await _controller.future;
      Set<Marker> routeMarkers = {};
      routeMarkers.add(
        Marker(
          markerId: const MarkerId('startPoint'),
          position: LatLng(startPoint.latitude, startPoint.longitude),
          infoWindow: const InfoWindow(title: 'Start point'),
        ),
      );
      routeMarkers.add(
        Marker(
          markerId: const MarkerId('endPoint'),
          position: LatLng(endPoint.latitude, endPoint.longitude),
          infoWindow: const InfoWindow(title: 'End point'),
        ),
      );
      setState(() {
        markers = routeMarkers;
      });
      List<LatLng> polylineCoordinates = await getPolylinePoints(
          LatLng(startPoint.latitude, startPoint.longitude),
          LatLng(endPoint.latitude, endPoint.longitude));
      generatePolylineFromPoints(polylineCoordinates);
      LatLng routeCenter = _calculateCenter(polylineCoordinates);
      controller.animateCamera(
        CameraUpdate.newCameraPosition(
          CameraPosition(
            target: routeCenter,
            zoom: 13,
          ),
        ),
      );
    }
  }

  Future<void> cameraToPosition(LatLng pos) async {
    final GoogleMapController controller = await _controller.future;
    controller.animateCamera(
      CameraUpdate.newCameraPosition(
        CameraPosition(
          target: LatLng(pos.latitude, pos.longitude),
          zoom: 15,
        ),
      ),
    );
  }

  Future<List<LatLng>> getPolylinePoints(LatLng start, LatLng end) async {
    List<LatLng> polylineCoordinates = [];
    PolylinePoints polylinePoints = PolylinePoints();
    PolylineResult result = await polylinePoints.getRouteBetweenCoordinates(
        GOOGLE_MAPS_API_KEY,
        PointLatLng(start.latitude, start.longitude),
        PointLatLng(end.latitude, end.longitude),
        travelMode: TravelMode.driving);

    print("=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=4141414141414141414141");
    print(result.distance);
    setState(() {
      distance = result.distance;
    });
    if (result.points.isNotEmpty) {
      result.points.forEach((PointLatLng point) {
        polylineCoordinates.add(LatLng(point.latitude, point.longitude));
      });
    } else {
      print(result.errorMessage);
    }
    return polylineCoordinates;
  }

  void generatePolylineFromPoints(List<LatLng> polylineCoordinates) async {
    PolylineId id = const PolylineId("my_polylines");
    Polyline polyline = Polyline(
      polylineId: id,
      color: Colors.blue,
      points: polylineCoordinates,
      width: 8,
    );
    setState(() {
      polylines[id] = polyline;
    });
  }

  LatLng _calculateCenter(List<LatLng> polylineCoordinates) {
    double sumLat = 0.0;
    double sumLng = 0.0;

    for (LatLng point in polylineCoordinates) {
      sumLat += point.latitude;
      sumLng += point.longitude;
    }

    double avgLat = sumLat / polylineCoordinates.length;
    double avgLng = sumLng / polylineCoordinates.length;

    return LatLng(avgLat, avgLng);
  }

  int calculateTimeDifference(String targetTimeString) {
    DateTime targetTime = DateTime.parse(targetTimeString);
    DateTime currentTime = DateTime.now();

    // Calculate the difference in milliseconds
    int differenceInMilliseconds =
        targetTime.millisecondsSinceEpoch - currentTime.millisecondsSinceEpoch;

    return differenceInMilliseconds;
  }

  void btnProecess() async {
    if (inTask) {
      final GoogleMapController controller = await _controller.future;
      controller.dispose();
      // /api/tasks/<id>/complete/
      _prefs = await SharedPreferences.getInstance();

      DateTime targetTime = DateTime.parse(widget.task.timeFrom);
      DateTime currentTime = DateTime.now();

      // Calculate the difference in milliseconds
      int differenceInMilliseconds = currentTime.millisecondsSinceEpoch -
          targetTime.millisecondsSinceEpoch;

      String iso8601String = currentTime.toIso8601String();
      if (distance == null) {
        return;
      }

      double distanceInKilometers = double.parse(distance!.split(' ')[0]);
      double distanceInMeters = distanceInKilometers * 1000;

      int distanceInMetersAsInt = distanceInMeters.round();
      Map<String, String> data = {
        'time_spent': differenceInMilliseconds.toString(),
        'time_ended': iso8601String,
        'distance_covered': distanceInMetersAsInt.toString()
      };
      try {
        final response = await http.post(
          Uri.parse('$baseApiUrl/api/tasks/${widget.task.id}/complete/'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ${_prefs!.getString("auth_token")}',
          },
          body: json.encode(data),
        );

        if (response.statusCode == 200) {
          final jsonResponse = json.decode(response.body);
          print("-=-=-=-=-=-=-=--=-=-=-=-=-=-=");
          print(jsonResponse);
          widget.updateDataCallback();
          Navigator.pop(context);
        }
      } catch (e) {
        print(e);
      }
    } else {
      startTask();
    }
  }

  void startTask() {
    setState(() {
      inTask = true;
    });
    getLocationUpdates();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          "Task",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 22.0,
          ),
        ),
      ),
      body: GoogleMap(
        mapType: MapType.hybrid,
        initialCameraPosition: initialPosition,
        onMapCreated: (GoogleMapController controller) {
          _controller.complete(controller);
        },
        markers: markers,
        polylines: Set<Polyline>.of(polylines.values),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: inTask
            ? const Color.fromARGB(255, 141, 23, 23)
            : const Color.fromARGB(255, 255, 255, 255),
        onPressed: btnProecess,
        label: inTask
            ? const Text(
                'End the task',
                style: TextStyle(color: Colors.white),
              )
            : const Text('Start the task'),
        icon: inTask
            ? const Icon(
                Icons.stop_circle_outlined,
                color: Colors.white,
              )
            : const Icon(Icons.not_started_rounded),
      ),
    );
  }
}
