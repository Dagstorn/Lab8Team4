export interface User {
    first_name: String;
    last_name: String;
    username: String;
    email: String;
}
export interface Admin {
    id: number;
    phone: String;
    user: User;
}


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
    license_plate: string,
    capacity: number,
    mileage: number,
    status: string
}
export interface AuctionVehicle {
    id: number;
    make: string,
    model: string,
    type: string,
    year: number,
    license_plate: string,
    capacity: number,
    mileage: number,
    image: string,
    condition: string,
    additional_indormation: string,
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

export interface point {
    lat: number,
    lng: number
}
export interface RoutePoints {
    start: point,
    end: point,
}

export interface FuelingPerson {
    id: number;
    name: String;
    surname: String;
    middle_name: String;
    phone: String;
    email: String;
    password: String;
}

export interface MaintenancePerson {
    id: number;
    name: String;
    surname: String;
    middle_name: String;
    phone: String;
    email: String;
    password: String;
}

export interface FuelingReport {
    id: number;
    vehicle: Vehicle;
    image_before: string;
    image_after: string;
    date: string;
    type: string;
    amount: string;
    cost: string;
}

export interface MaintenanceJob {
    id: number;
    vehicle: Vehicle;
    maintenance_person: MaintenancePerson;
    description: string;
    status: string;
    type: string;
    date: string;
    created_on: string;
}

export interface RepairPart {
    part_name: string;
    condition: string;
}


export interface ReplacedPart {
    index: number;
}

export interface PaginatorObj {
    count: number;
    page_size: number;
    next: string | null;
    previous: string | null;
}

export interface FuelingTask {
    id: number;
    vehicle: Vehicle;
    task: string;
    status: string;
    created_on: string;

}