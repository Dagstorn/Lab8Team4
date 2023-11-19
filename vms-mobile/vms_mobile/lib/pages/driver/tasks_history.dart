import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vms_mobile/constants.dart';
import 'package:vms_mobile/models/types.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:vms_mobile/pages/driver/components/completed_task.dart';

class TasksHistory extends StatefulWidget {
  const TasksHistory({super.key});

  @override
  State<TasksHistory> createState() => _TasksHistoryState();
}

class _TasksHistoryState extends State<TasksHistory> {
  SharedPreferences? _prefs;
  Future<List<Task>>? taskListFuture;

  @override
  void initState() {
    super.initState();
    initializeSharedPreferences();
    taskListFuture = fetchData();
  }

  Future<void> initializeSharedPreferences() async {
    _prefs = await SharedPreferences.getInstance();
  }

  Future<List<Task>> fetchData() async {
    _prefs = await SharedPreferences.getInstance();

    try {
      final response = await http
          .get(Uri.parse('$baseApiUrl/api/routes_history/'), headers: {
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
      appBar: AppBar(
        centerTitle: true,
        automaticallyImplyLeading: false,
        title: const Text(
          "Completed tasks history",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 22.0,
          ),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: FutureBuilder<List<Task>>(
              future: taskListFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done) {
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
                      return CompletedTask(task: task);
                    },
                  );
                }
              },
            ),
          )
        ],
      ),
    );
  }
}
