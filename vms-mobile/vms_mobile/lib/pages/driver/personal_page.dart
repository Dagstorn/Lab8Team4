import 'package:flutter/material.dart';
import 'package:vms_mobile/constants.dart';
import 'package:vms_mobile/models/types.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vms_mobile/pages/driver/edit_personal_data.dart';

class PersonalPage extends StatefulWidget {
  const PersonalPage({super.key});

  @override
  State<PersonalPage> createState() => _PersonalPageState();
}

class _PersonalPageState extends State<PersonalPage> {
  SharedPreferences? _prefs;

  Driver driver = Driver(
    id: 1,
    governmentId: '',
    department: '',
    name: '',
    surname: '',
    middleName: '',
    address: '',
    phone: '',
    email: '',
    licenseCode: 0,
    password: '',
  );

  @override
  void initState() {
    super.initState();
    print("=-=-=-=-====-= in init");
    initializeSharedPreferences();
    fetchData();
  }

  void updateDataCallback() {
    fetchData();
  }

  Future<void> initializeSharedPreferences() async {
    _prefs = await SharedPreferences.getInstance();
  }

  Future<void> fetchData() async {
    _prefs = await SharedPreferences.getInstance();

    final response =
        await http.get(Uri.parse('$baseApiUrl/api/driver/'), headers: {
      'Authorization': 'Bearer ${_prefs!.getString("auth_token")}',
    });
    if (response.statusCode == 200) {
      print("got data -==-=-=-=-=-=-=-=-=-=-=-=-");
      final Map<String, dynamic> data = jsonDecode(response.body);
      print(data);

      setState(() {
        driver = Driver.fromJson(data);
      });
    }
  }

  Widget _buildRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 16.0,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 16.0),
          Expanded(
            flex: 3,
            child: Text(
              value,
              style: const TextStyle(fontSize: 16.0),
            ),
          ),
        ],
      ),
    );
  }

  // Clear SharedPreferences
  void clearSharedPreferences() async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    preferences.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          centerTitle: true,
          automaticallyImplyLeading: false,
          title: const Text(
            "Personal information",
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 22.0,
            ),
          ),
        ),
        body: Column(
          children: [
            Expanded(
              child: Column(
                children: [
                  Container(
                    width: MediaQuery.of(context).size.width,
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(255, 255, 255, 255),
                      borderRadius: BorderRadius.circular(10.0),
                    ),
                    padding: const EdgeInsets.all(16.0),
                    margin: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildRow(
                            'Full name:', '${driver.name} ${driver.surname}'),
                        _buildRow('Address:', driver.address),
                        _buildRow('Phone:', driver.phone),
                        _buildRow('Email:', driver.email),
                        _buildRow(
                            'License code:', driver.licenseCode.toString()),
                        _buildRow('Government ID:', driver.governmentId),
                      ],
                    ),
                  ),
                  Container(
                    width: MediaQuery.of(context).size.width,
                    margin: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => EditPersonalData(
                                  driver: driver,
                                  updateDataCallback: updateDataCallback)),
                        );
                      },
                      style: ButtonStyle(
                        shape: MaterialStateProperty.all(
                          RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(5.0),
                          ),
                        ),
                        backgroundColor:
                            MaterialStateProperty.all(const Color(0xFF18181a)),
                      ),
                      child: const Text(
                        'Edit',
                        style: TextStyle(
                          fontSize: 16.0,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Align(
                alignment: Alignment.bottomCenter,
                child: Container(
                  width: MediaQuery.of(context).size.width,
                  child: ElevatedButton(
                    onPressed: () {
                      // Implement logout logic here
                      // For now, let's just print a message
                      print('Logout pressed');
                      clearSharedPreferences();
                      Navigator.pop(context);
                      // Navigator.popUntil(context, (route) => route.isFirst);
                    },
                    style: ButtonStyle(
                      shape: MaterialStateProperty.all(
                        RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(5.0),
                        ),
                      ),
                      backgroundColor: MaterialStateProperty.all(
                        const Color.fromARGB(
                            255, 187, 12, 0), // You can use your desired color
                      ),
                    ),
                    child: const Text(
                      'Logout',
                      style: TextStyle(
                        fontSize: 16.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ));
  }
}
