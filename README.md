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
