import 'package:flutter/material.dart';
import 'package:vms_mobile/models/types.dart';

class TaskMap extends StatefulWidget {
  final Task task;
  const TaskMap({super.key, required this.task});

  @override
  State<TaskMap> createState() => _TaskMapState();
}

class _TaskMapState extends State<TaskMap> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          "Task",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 22.0,
          ),
        ),
      ),
      body: const Center(child: Text("dscdss")),
    );
  }
}
