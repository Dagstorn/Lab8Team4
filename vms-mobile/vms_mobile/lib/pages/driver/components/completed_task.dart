import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:vms_mobile/models/types.dart';

class CompletedTask extends StatefulWidget {
  final CompletedRoute task;
  const CompletedTask({super.key, required this.task});

  @override
  State<CompletedTask> createState() => _CompletedTaskState();
}

class _CompletedTaskState extends State<CompletedTask> {
  late final String formattedTimeWindow;

  @override
  void initState() {
    super.initState();
    formattedTimeWindow = formatTimeWindow(
        widget.task.timeFrom.toString(), widget.task.timeTo.toString());
  }

  String formatTime(DateTime dateTime) {
    return DateFormat('MMM d, HH:mm').format(dateTime);
  }

  String formatTimeWindow(String timeFrom, String timeTo) {
    final DateTime startDateTime = DateTime.parse(timeFrom);
    final DateTime endDateTime = DateTime.parse(timeTo);
    final String formattedTime;
    final DateFormat monthDayFormat = DateFormat('MMM d,');
    final DateFormat dateFormat = DateFormat('MMM d, HH:mm');

    final String startMinute = startDateTime.minute < 10
        ? '0${startDateTime.minute}'
        : '${startDateTime.minute}';
    final String endMinute = endDateTime.minute < 10
        ? '0${endDateTime.minute}'
        : '${endDateTime.minute}';
    if (startDateTime.month == endDateTime.month &&
        startDateTime.day == endDateTime.day) {
      formattedTime =
          '${monthDayFormat.format(startDateTime)} ${startDateTime.hour}:$startMinute to ${endDateTime.hour}:$endMinute';
    } else {
      formattedTime =
          '${dateFormat.format(startDateTime)} ${startDateTime.hour}:$startMinute to ${dateFormat.format(endDateTime)} ${endDateTime.hour}:$endMinute';
    }
    return formattedTime;
  }

  String formatTimeTonormal(int milliseconds) {
    // Calculate hours, minutes, and seconds from milliseconds
    int seconds = (milliseconds / 1000).floor();
    int hours = (seconds / 3600).floor();
    int minutes = ((seconds % 3600) / 60).floor();
    seconds = seconds % 60;

    // Format the time as a string
    String formattedTime =
        '$hours:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';

    return formattedTime;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      margin: const EdgeInsets.only(
        bottom: 8.0,
        top: 8.0,
        left: 12.0,
        right: 12.0,
      ),
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 255, 255, 255),
        borderRadius: BorderRadius.circular(16.0),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Time spent: ${formatTimeTonormal(widget.task.timeSpent)}',
            style: const TextStyle(
              fontSize: 16.0,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            'Distance covered: ${widget.task.distanceCovered / 1000} km',
            style: const TextStyle(
              fontSize: 16.0,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            formattedTimeWindow,
            style: const TextStyle(
              fontSize: 16.0,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8.0),
          Text('From: ${widget.task.fromPoint}'),
          Text('To: ${widget.task.toPoint}'),
        ],
      ),
    );
  }
}
