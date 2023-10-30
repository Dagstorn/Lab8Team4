import 'package:flutter/material.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vms_mobile/pages/driver/driver_dashboard.dart';
import 'package:vms_mobile/pages/login_page.dart';

Future<void> main() async {
  //ensure that the Flutter framework is properly initialized
  WidgetsFlutterBinding.ensureInitialized();
  // obtain an instance of SharedPreferences to read and write data  from storage.
  SharedPreferences prefs = await SharedPreferences.getInstance();
  runApp(MyApp(token: prefs.getString('auth_token')));
}

class MyApp extends StatelessWidget {
  final String? token;
  const MyApp({super.key, required this.token});

  // function to decide what screen to show depending on login state
  Widget userTypeScreenResolver() {
    // if there is no token render login screen
    if (token == null) {
      return const LoginPage();
    }
    // if token is expired render login screen
    if (JwtDecoder.isExpired(token!)) {
      return const LoginPage();
    }
    // decode token and get user role
    Map<String, dynamic> jwtDecodedToken = JwtDecoder.decode(token!);
    String role = jwtDecodedToken['role'];
    // render different screens depending on user role
    if (role == 'driver') {
      return const DriverDashboard();
    } else {
      return const LoginPage();
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'VMS',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: userTypeScreenResolver(),
    );
  }
}
