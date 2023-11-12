import 'package:flutter/material.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vms_mobile/pages/driver/driver_main.dart';
import 'package:vms_mobile/pages/login_page.dart';

void main() async {
  // ensure that the Flutter framework is fully initialized before application starts
  WidgetsFlutterBinding.ensureInitialized();
  // retrieve an instance of SharedPreferences.
  // This instance will allow to read and write data to device storage.
  SharedPreferences prefs = await SharedPreferences.getInstance();
  runApp(MyApp(token: prefs.getString("auth_token")));
}

class MyApp extends StatelessWidget {
  // JWT token for authorization
  final String? token;

  const MyApp({super.key, this.token});

  // function which conditionally renders screen
  // if not logged in or JWT auth token is expired we render Login screen
  // otherwise we render personal page based on role
  Widget userTypeScreenResolver() {
    // if there is no token render login screen
    if (token == null) {
      return const LoginPage();
    }
    // if token is expired render login screen
    if (JwtDecoder.isExpired(token!)) {
      return const LoginPage();
    }
    // decode JWT token and get user role
    Map<String, dynamic> jwtDecodedToken = JwtDecoder.decode(token!);
    String role = jwtDecodedToken['role'];

    // render different screens depending on user role
    if (role == 'driver') {
      return const DriverMain();
    } else {
      return const LoginPage();
    }
  }

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'VMS',
      theme: ThemeData(
        primaryColor: Colors.black,
        scaffoldBackgroundColor: const Color(0xFFEFEFEF),
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF69DC9E)),
        useMaterial3: true,
      ),
      home: userTypeScreenResolver(),
    );
  }
}
