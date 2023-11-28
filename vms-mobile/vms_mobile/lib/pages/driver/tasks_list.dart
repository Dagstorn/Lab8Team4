import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vms_mobile/models/types.dart';
import 'package:http/http.dart' as http;
import 'package:vms_mobile/pages/driver/components/task_item.dart';
import '../../constants.dart';

class TasksList extends StatefulWidget {
  const TasksList({super.key});

  @override
  State<TasksList> createState() => _TasksListState();
}

class _TasksListState extends State<TasksList> {
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

  void updateDataCallback() {
    setState(() {
      taskListFuture = fetchData();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        automaticallyImplyLeading: false,
        // backgroundColor: Color.fromARGB(255, 11, 11, 11),
        title: const Text(
          "Currently assigned tasks",
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
                  return const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.info_outline,
                          size: 64.0,
                          color: Colors.grey,
                        ),
                        SizedBox(height: 16.0),
                        Text(
                          "No tasks yet...",
                          style: TextStyle(color: Colors.grey, fontSize: 16.0),
                        ),
                      ],
                    ),
                  );
                } else {
                  return ListView.builder(
                    itemCount: snapshot.data?.length,
                    itemBuilder: (context, index) {
                      Task task = snapshot.data![index];
                      return TaskItem(
                          task: task, updateDataCallback: updateDataCallback);
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
