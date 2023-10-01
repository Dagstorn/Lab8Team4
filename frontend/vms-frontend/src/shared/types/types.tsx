export interface Driver {
    id: number;
    goverment_id: String;
    department: String;
    name: String;
    surname: String;
    middle_name: String;
    address: String;
    phone: String;
    email: String;
    license_code: String;
    password: String;
}

export interface Vehicle {
    id: number;
    make: string,
    model: string,
    type: string,
    year: number,
    license_plat: string,
    capacity: number,
    mileage: number
    driver: Driver
}
export interface Appointment {
    id: number;
    currentPosition: string;
    destination: string;
    description: string;
    number_of_people: number;
    car_type: string;
    time_from: string;
    time_to: string;
    additionalInfo: string;
    driver: Driver
}

export interface Task {
    id: number;
    driver: Driver;
    car: Vehicle;
    description: string;
    from_point: string;
    to_point: string;
    time_from: string;
    time_to: string;
    status: string;
}

export interface CompletedRoute {
    id: number;
    driver: Driver;
    from_point: string;
    to_point: string;
    time_from: string;
    time_to: string;
    distance_covered: string;
    time_spent: string;
}