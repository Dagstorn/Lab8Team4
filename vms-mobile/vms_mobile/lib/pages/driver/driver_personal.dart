import 'dart:convert';
import 'package:intl/intl.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vms_mobile/models/types.dart';
import 'package:http/http.dart' as http;
import '../../constants.dart';

class DriverPersonal extends StatefulWidget {
  const DriverPersonal({super.key});

  @override
  State<DriverPersonal> createState() => _DriverPersonalState();
}

class _DriverPersonalState extends State<DriverPersonal> {
  SharedPreferences? _prefs;
  String username = '';
  String role = '';

  @override
  void initState() {
    super.initState();
    initializeSharedPreferences();
  }

  Future<void> initializeSharedPreferences() async {
    _prefs = await SharedPreferences.getInstance();
    if (_prefs != null) {
      setState(() {
        username = _prefs!.getString("username")!;
        role = _prefs!.getString("role")!;
      });
    }
  }

  String formatTime(DateTime dateTime) {
    return DateFormat('MMM d, HH:mm').format(dateTime);
  }

  String formatTimeWindow(String timeFrom, String timeTo) {
    final dateTimeFrom = DateTime.parse(timeFrom);
    final dateTimeTo = DateTime.parse(timeTo);

    final formattedFrom = formatTime(dateTimeFrom);
    final formattedTo = formatTime(dateTimeTo);

    return '$formattedFrom to $formattedTo';
  }

  Widget taskItem(Task task) {
    final formattedTimeWindow = formatTimeWindow(task.timeFrom, task.timeTo);

    return Container(
      padding: const EdgeInsets.all(16.0), // Adjust the padding as needed
      margin:
          const EdgeInsets.only(bottom: 16.0), // Adjust the margin as needed
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            task.description,
            style: const TextStyle(
              fontSize: 16.0,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            formattedTimeWindow,
            style: const TextStyle(
              fontSize: 16.0,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8.0),
          Text('From: ${task.fromPoint}'),
          Text('To: ${task.toPoint}'),
          Container(
            margin: const EdgeInsets.only(
                top: 8.0), // Add margin to the top of the divider
            child: const Divider(
              thickness: 1.0,
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  Future<List<Task>> fetchData() async {
    try {
      final response =
          await http.get(Uri.parse('$baseApiUrl/api/driver/tasks/'), headers: {
        'Authorization': 'Bearer ${_prefs!.getString("auth_token")}',
      });

      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);

        List<Task> taskList = [];
        for (var item in jsonResponse) {
          Task newTask = Task.fromJson(item);
          taskList.add(newTask);
        }

        return taskList;
      }
    } catch (e) {
      print(e);
      return [];
    }
    return [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Container(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    Text(
                      'Hello, $username, you are $role',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 22.0,
                      ),
                    ),
                    const SizedBox(
                      height: 16.0,
                    ),
                    const Text(
                      'Currently assigned tasks',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 22.0,
                      ),
                    ),
                  ],
                )),
            Expanded(
                child: FutureBuilder<List<Task>>(
              future: fetchData(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Text('Error: ${snapshot.error}');
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Text('No data available.');
                } else {
                  return ListView.builder(
                    itemCount: snapshot.data?.length,
                    itemBuilder: (context, index) {
                      Task task = snapshot.data![index];
                      return taskItem(task);
                    },
                  );
                }
              },
            ))
          ],
        ),
      ),
    );
  }
}
