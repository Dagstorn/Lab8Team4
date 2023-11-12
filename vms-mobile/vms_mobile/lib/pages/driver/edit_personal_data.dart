import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:vms_mobile/constants.dart';
import 'package:vms_mobile/models/types.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

class EditPersonalData extends StatefulWidget {
  final Driver driver;
  final VoidCallback updateDataCallback;
  const EditPersonalData(
      {super.key, required this.driver, required this.updateDataCallback});

  @override
  State<EditPersonalData> createState() => _EditPersonalDataState();
}

class _EditPersonalDataState extends State<EditPersonalData> {
  late SharedPreferences _prefs;
  String error = '';
  TextEditingController nameController = TextEditingController();
  TextEditingController surnameController = TextEditingController();
  TextEditingController addressController = TextEditingController();
  TextEditingController phoneController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController licenseCodeController = TextEditingController();
  TextEditingController governmentIdController = TextEditingController();

  @override
  void initState() {
    super.initState();

    // Set initial values from the provided Driver object
    nameController.text = widget.driver.name;
    surnameController.text = widget.driver.surname;
    addressController.text = widget.driver.address;
    phoneController.text = widget.driver.phone;
    emailController.text = widget.driver.email;
    licenseCodeController.text = widget.driver.licenseCode.toString();
    governmentIdController.text = widget.driver.governmentId;
    initializeSharedPreferences();
  }

  Future<void> initializeSharedPreferences() async {
    _prefs = await SharedPreferences.getInstance();
  }

  void getBack(BuildContext context) {
    widget.updateDataCallback();
    Navigator.pop(context);
  }

  Future<void> _submitForm(BuildContext context) async {
    // Gather the updated data from the TextEditingController
    String updatedName = nameController.text;
    String updatedSurname = surnameController.text;
    String updatedAddress = addressController.text;
    String updatedPhone = phoneController.text;
    String updatedEmail = emailController.text;
    String updatedLicenseCode = licenseCodeController.text;
    String updatedGovernmentId = governmentIdController.text;

    setState(() {
      error = '';
    });

    // Create a map to represent the updated data
    Map<String, String> updatedData = {
      'name': updatedName,
      'surname': updatedSurname,
      'address': updatedAddress,
      'phone': updatedPhone,
      'email': updatedEmail,
      'license_code': updatedLicenseCode,
      'goverment_id': updatedGovernmentId,
    };

    try {
      _prefs = await SharedPreferences.getInstance();

      final response = await http.patch(Uri.parse('$baseApiUrl/api/driver/'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ${_prefs.getString("auth_token")}',
          },
          body: jsonEncode(updatedData));

      if (response.statusCode == 200) {
        getBack(context);
      } else {
        setState(() {
          error = 'Try again1';
        });
      }
    } catch (e) {
      print(e);
      setState(() {
        error = 'Something went wrong! $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Personal data'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: nameController,
                decoration: const InputDecoration(labelText: 'Name'),
              ),
              TextFormField(
                controller: surnameController,
                decoration: const InputDecoration(labelText: 'Surname'),
              ),
              TextFormField(
                controller: addressController,
                decoration: const InputDecoration(labelText: 'Address'),
              ),
              TextFormField(
                controller: phoneController,
                decoration: const InputDecoration(labelText: 'Phone'),
              ),
              TextFormField(
                controller: emailController,
                decoration: const InputDecoration(labelText: 'Email'),
              ),
              TextFormField(
                controller: licenseCodeController,
                decoration: const InputDecoration(labelText: 'License Code'),
              ),
              TextFormField(
                controller: governmentIdController,
                decoration: const InputDecoration(labelText: 'Government ID'),
              ),
              const SizedBox(
                height: 16.0,
              ),
              Text(
                error,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.red,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              // Add similar TextFormField widgets for other fields
              const SizedBox(height: 16.0),
              ElevatedButton(
                onPressed: () {
                  _submitForm(context);
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
                  'Save changes',
                  style: TextStyle(
                    fontSize: 16.0,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
