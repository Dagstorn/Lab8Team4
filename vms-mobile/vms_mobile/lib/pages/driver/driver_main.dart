import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vms_mobile/pages/driver/appointments.dart';
import 'package:vms_mobile/pages/driver/tasks_history.dart';
import 'package:vms_mobile/pages/driver/personal_page.dart';
import 'package:vms_mobile/pages/driver/tasks_list.dart';

final driverPages = [
  const TasksList(),
  const TasksHistory(),
  const AppointmentsPage(),
  const PersonalPage()
];

class DriverMain extends StatefulWidget {
  const DriverMain({super.key});

  @override
  State<DriverMain> createState() => _DriverMainState();
}

class _DriverMainState extends State<DriverMain> {
  SharedPreferences? _prefs;
  String username = '';
  String role = '';
  int currentIndex = 0;

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
      body: driverPages[currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: const Color.fromARGB(255, 255, 255, 255),
        selectedItemColor: const Color.fromARGB(255, 0, 0, 0),
        unselectedItemColor: const Color.fromARGB(255, 161, 161, 161),
        showSelectedLabels: true,
        showUnselectedLabels: false,
        type: BottomNavigationBarType.fixed,
        currentIndex: currentIndex,
        onTap: (index) {
          setState(() {
            currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
              icon: Icon(Icons.checklist_rtl), label: 'Tasks'),
          BottomNavigationBarItem(icon: Icon(Icons.history), label: 'History'),
          BottomNavigationBarItem(
              icon: Icon(Icons.calendar_today), label: 'Appointments'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Personal')
        ],
      ),
    );
  }
}
