import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DriverPersonal extends StatefulWidget {
  const DriverPersonal({super.key});

  @override
  State<DriverPersonal> createState() => _DriverPersonalState();
}

class _DriverPersonalState extends State<DriverPersonal> {
  //
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
          child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('Hello, $username, you are $role'),
        ],
      )),
    );
  }
}
