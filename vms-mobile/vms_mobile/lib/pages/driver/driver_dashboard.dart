import 'package:flutter/material.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DriverDashboard extends StatefulWidget {
  const DriverDashboard({super.key});
  @override
  State<DriverDashboard> createState() => _DriverDashboardState();
}

class _DriverDashboardState extends State<DriverDashboard> {
  late String username;
  late String role;

  @override
  void initState() async {
    super.initState();
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('auth_token');
    if (token != null) {
      Map<String, dynamic> jwtDecodedToken = JwtDecoder.decode(token);
      username = jwtDecodedToken['username'];
      role = jwtDecodedToken['role'];
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text("Hello $username"),
          Text("you are  $role"),
        ],
      ),
    );
  }
}
