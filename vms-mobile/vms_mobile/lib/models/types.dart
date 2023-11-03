class Driver {
  final int id;
  final String governmentId;
  final String department;
  final String name;
  final String surname;
  final String middleName;
  final String address;
  final String phone;
  final String email;
  final int licenseCode;
  final String password;

  Driver({
    required this.id,
    required this.governmentId,
    required this.department,
    required this.name,
    required this.surname,
    required this.middleName,
    required this.address,
    required this.phone,
    required this.email,
    required this.licenseCode,
    required this.password,
  });

  factory Driver.fromJson(Map<String, dynamic> json) {
    return Driver(
      id: json['id'],
      governmentId: json['goverment_id'],
      department: json['department'],
      name: json['name'],
      surname: json['surname'],
      middleName: json['middle_name'],
      address: json['address'],
      phone: json['phone'],
      email: json['email'],
      licenseCode: json['license_code'],
      password: json['password'],
    );
  }
}

class Vehicle {
  final int id;
  final String make;
  final String model;
  final String type;
  final int year;
  final String licensePlate;
  final int capacity;
  final double mileage;
  final String status;

  Vehicle({
    required this.id,
    required this.make,
    required this.model,
    required this.type,
    required this.year,
    required this.licensePlate,
    required this.capacity,
    required this.mileage,
    required this.status,
  });

  factory Vehicle.fromJson(Map<String, dynamic> json) {
    return Vehicle(
      id: json['id'],
      make: json['make'],
      model: json['model'],
      type: json['type'],
      year: json['year'],
      licensePlate: json['license_plate'],
      capacity: json['capacity'],
      mileage: json['mileage'].toDouble(),
      status: json['status'],
    );
  }
}

class Task {
  final int id;
  final Driver driver;
  final Vehicle car;
  final String description;
  final String fromPoint;
  final String toPoint;
  final String timeFrom;
  final String timeTo;
  final String status;

  Task({
    required this.id,
    required this.driver,
    required this.car,
    required this.description,
    required this.fromPoint,
    required this.toPoint,
    required this.timeFrom,
    required this.timeTo,
    required this.status,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['id'],
      driver: Driver.fromJson(json['driver']),
      car: Vehicle.fromJson(json['car']),
      description: json['description'],
      fromPoint: json['from_point'],
      toPoint: json['to_point'],
      timeFrom: json['time_from'],
      timeTo: json['time_to'],
      status: json['status'],
    );
  }
}
