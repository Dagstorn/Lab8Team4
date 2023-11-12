import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:vms_mobile/pages/driver/driver_main.dart';
import '../constants.dart';
import 'package:http/http.dart' as http;
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  // input fields controllers
  late final TextEditingController usernameController;
  late final TextEditingController passwordController;

  // error message holder
  String error = '';

  // variable for platform-specific persistent storage for simple data
  late SharedPreferences prefs;

  // function to initialize persistent storage
  void initSharedPereferences() async {
    prefs = await SharedPreferences.getInstance();
  }

  @override
  void initState() {
    // initialize controllers
    usernameController = TextEditingController();
    passwordController = TextEditingController();
    super.initState();
    // initialize persistent storage
    initSharedPereferences();
  }

  @override
  void dispose() {
    // remove controllers
    usernameController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Future<void> login() async {
    // clear previous errors
    setState(() {
      error = '';
    });
    // get values from input controllers
    final username = usernameController.text;
    final password = passwordController.text;
    // make sure inputs are not empty
    if (username.isNotEmpty && password.isNotEmpty) {
      // make an api call
      try {
        // send data and get jwt token
        final response = await http.post(
          Uri.parse('$baseApiUrl/api/users/token/'),
          body: {
            'username': username,
            'password': password,
          },
        );
        // decoded response result
        var jsonResponse = jsonDecode(response.body);

        // check if call was successfull
        if (response.statusCode == 200) {
          // store jwt token and user data in persistent storage
          var authToken = jsonResponse['access'];
          print(authToken);

          var refreshToken = jsonResponse['refresh'];
          prefs.setString('auth_token', authToken);

          prefs.setString('refresh_token', refreshToken);
          Map<String, dynamic> jwtDecodedToken = JwtDecoder.decode(authToken);

          String username = jwtDecodedToken['username'];
          String role = jwtDecodedToken['role'];
          prefs.setString('username', username);
          prefs.setString('role', role);
          //  naviagte user to corresponding view
          if (role == 'driver') {
            // ignore: use_build_context_synchronously
            Navigator.push(context,
                MaterialPageRoute(builder: (context) => const DriverMain()));
          }
        } else {
          // Handle error, e.g., incorrect credentials
          setState(() {
            error = 'Invlaid credentials!';
          });
        }
      } catch (e) {
        // Handle network or API errors
        setState(() {
          error = 'Something went wrong! $e';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                "Login to VMS",
                style: TextStyle(
                  fontSize: 36, // Set the font size
                  fontWeight: FontWeight.bold, // Set the font weight to bold
                ),
              ),
              const SizedBox(height: 16.0),
              const Divider(),
              Text(
                error,
                style: const TextStyle(
                  color: Colors.red,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextField(
                controller: usernameController,
                decoration: const InputDecoration(
                  labelText: 'Username',
                ),
              ),
              TextField(
                controller: passwordController,
                decoration: const InputDecoration(
                  labelText: 'Password',
                ),
                obscureText: true,
              ),
              const SizedBox(height: 32.0),
              ElevatedButton(
                onPressed: login,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black, // Background color (black)
                  foregroundColor: Colors.white, // Text color (white)
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(
                        5.0), // Adjust the border radius as needed
                  ),
                  minimumSize: const Size(
                      200, 50), // Adjust the width and height as needed
                ),
                child: const Text('Login'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
