# Lab8Team4

Frontend - React\
Backedn - Django, Postrgresql

## Installation & Running:

install git

open terminal/cmd in some folder

`git clone https://github.com/Dagstorn/Lab8Team4.git`

`python -m venv venv`

On mac:

`source venv/bin/activate`

On windows CMD

`venv\Scripts\activate`

On windows Powershell

`.\venv\Scripts\Activate.ps1`

After venv is activated

`cd Lab8Team4/backend`

`pip install -r requirements.txt`

`python manage.py runserver`

Now python local server is running on localhost port 8000

However API from flutter should connect not to 127.0.0.1:8000 but rather to http://10.0.2.2:8000 which is a routing alias to your host machine's localhost when running inside Android emulator

Example flutter api call:

```
const baseApiUrl = 'http://10.0.2.2:8000/api';
final response = await http.post(
    Uri.parse('$baseApiUrl/users/token/'),
    body: {
        'username': username,
        'password': password,
    },
);
```

## API description for mobile app part

============= FOR DRIVER ======================

---

`/api/driver/`

- accepts GET and PATCH methods
  - for GET method
    - get currently logged in driver's data
  - for PACTH method
    - update fields that are recieved
    - send object with field name as key and value
    - options are: goverment_id, department, name, surname, middle_name, address, phone, license_code, password
    - you can update all fields or one, or few

`/api/driver/tasks/`

- accepts GET method
- get currently logged in driver's tasks which are not Canceled and not Completed

`/api/driver/tasks/<id>/`

- accepts GET and PATCH methods
  - <id> is substituted with actual task id
  - for GET method
    - will return specific task
  - for PACTH method
    - will update task status
    - should pass status object with request, for example {status: "Completed"}
    - allowed status types: ["Assigned","In progress","Completed","Delayed","Canceled"]

`/api/routes_history/`

- accepts GET method
- get currently logged in driver's completed routes(or tasks) list

`/api/tasks/<id>/complete/`

- accepts only POST method
- should be called when driver finishes a task
  - <id> is substituted with actual task id
  - you should provide additional data
    - time_spent: in milliseconds
    - time_ended: datetime in ISO format
    - distance_covered: in meters
  - return newly created CompletedRoute object

---

============= FOR FUELING ======================

---

`/api/fueling/personal_data/`

- accepts GET and PATCH methods
  - for GET method
    - get currently logged in fueling person's data
  - for PACTH method
    - update fields that are recieved
    - send object with field name as key and corresponding value
    - options are: name, surname, middle_name, phone, password
    - you can update all fields or one, or few

`/api/fueling/vehicles/`

- accepts GET method
- returns list of vehicles which are active

`/api/fueling/records/`

- accepts GET and POST methods
  - for GET method
    - returns list of fueling proofs
  - POST method is to create new Fueling proof
    - required data:
    - vehicle: vehicle id
    - upload_time: datetime in ISO format
    - fuelType: string
    - amount: float in liters
    - cost: positive integer in KZT
    - image_before: File
    - image_after: File
    - driver_photo: File

`/api/fueling/records/<id>/`

- <id> is substituted with actual fueling proof id
- accepts GET and PATCH methods
  - for GET method
    - returns specific fueling proof based on id provided
  - for PACTH method
    - update fields like amount, cost and fuel type
    - fuelType: string
    - amount: float in liters
    - cost: positive integer in KZT

---

============= FOR Maintenance ======================

---

`/api/fueling/personal_data/`

- accepts GET and PATCH methods
  - for GET method
    - get currently logged in maintenance person's data
  - for PACTH method
    - update fields that are recieved
    - send object with field name as key and corresponding value
    - options are: name, surname, middle_name, phone, password
    - you can update all fields or one, or few

`/api/maintenance/jobs/`

- accepts GET and POST methods
  - for GET method
    - returns list of maintenance jobs
  - POST method is to create new maintenance job
    - required data:
    - vehicle: vehicle id
    - description: string
    - type: string, one of ["monthly", "yearly", "accidental"]
    - repair_parts: List of objects of format: {part_name: string, condition: string}
      For example: [{part_name: "Brake pads", condition: "old"}, {part_name: "Oil filter", condition: "new"}]

`/api/maintenance/jobs/<id>/`

- <id> is substituted with actual maintenance job id
- accepts GET and PATCH methods
  - for GET method
    - get specific job by id
  - for PACTH method
    - update fields that are recieved
    - fields are
    - description: string
    - repair_parts: List of objects of format: {part_name: string, condition: string}
      For example: [{part_name: "Brake pads", condition: "old"}, {part_name: "Oil filter", condition: "new"}]

`/api/maintenance/jobs/<id>/parts/`

- <id> is substituted with actual maintenance job id
  returns list of repair parts for this job

`/api/maintenance/jobs/<id>/complete/`

- <id> is substituted with actual maintenance job id
- accepts only POST method
- called to complete the maintenance job
- required fields:
  - cost: postive integer
  - part_number: list of part_numbers
  - part_photo: list of part_photos

`/api/maintenance/vehicles/`
returns list of vehicles

`/api/maintenance/vehicles/<id>/`

- <id> is substituted with actual vehicle id
- accepts GET and PATCH methods
  - for GET method
    - get specific vehicle by id
  - for PACTH method
    - update fields that are recieved
