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