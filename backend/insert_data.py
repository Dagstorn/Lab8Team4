import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('db.sqlite3')

# Create a cursor object to interact with the database
cursor = conn.cursor()

# Define your data as a list of tuples
data_to_insert = [
    ("Audi", "A4", "Sedan", 2019, "17ABE244", 4, 0, "active"),
    ("BMW", "X5", "Crossover", 2010, "439SOH01", 4, 0, "active"),
    ("Toyota", "Camry", "Sedan", 2022, "464OPO01", 5, 0, "active"),
    ("Ford", "F-150", "Pickup Truck", 2023, "595ABE01", 6, 0, "active"),
    ("Chevrolet", "Suburban", "SUV", 2023, "302EZA01", 8, 0, "active"),
    ("Ford", "Transit", "Van", 2023, "385APM01", 12, 85203, "active"),
    ("Chrysler", "Pacifica", "Minivan", 2022, "980RKA01", 7, 0, "active"),
    ("Hyundai", "Sonata", "Sedan", 2022, "540OJD01", 5, 0, "active"),
    ("Toyota", "Camry", "Sedan", 2019, "XYZ456", 5, 35000, "active"),
    ("Honda", "Civic", "Sedan", 2018, "DEF789", 5, 40000, "active"),
    ("Chevrolet", "Silverado", "Pickup Truck", 2021, "GHI101", 6, 20000, "active"),
    ("BMW", "X5", "SUV", 2017, "JKL202", 5, 45000, "active"),
    ("Hyundai", "Tucson", "SUV", 2019, "PQR404", 5, 30000, "active"),
    ("Volkswagen", "Golf", "Hatchback", 2016, "STU505", 5, 55000, "active"),
    ("Mercedes-Benz", "E-Class", "Sedan", 2020, "VWX606", 5, 25000, "active"),
    ("Subaru", "Outback", "Wagon", 2019, "YZA707", 5, 35000, "active")
]

# Insert data into the table
for record in data_to_insert:
    cursor.execute(
        "INSERT INTO vehicles_vehicle (make, model, type, year, license_plate, capacity, mileage, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        record
    )

# Commit the changes to the database
conn.commit()

# Close the cursor and the database connection
cursor.close()
conn.close()
