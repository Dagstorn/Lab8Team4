import { Vehicle } from "../types/types";

export const formatTimeRange = (startISO: string, endISO: string) => {
    const startDate = new Date(startISO);
    const endDate = new Date(endISO);

    // Function to format a date as "YYYY-MM-DD HH:mm:ss"
    const year1 = startDate.getFullYear();
    const month1 = startDate.toLocaleString('en-US', { month: 'short' });
    const day1 = String(startDate.getDate()).padStart(2, '0');
    const hour1 = String(startDate.getHours()).padStart(2, '0');
    const minute1 = String(startDate.getMinutes()).padStart(2, '0');
    // return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    const year2 = endDate.getFullYear();
    const month2 = endDate.toLocaleString('en-US', { month: 'short' });
    const day2 = String(endDate.getDate()).padStart(2, '0');
    const hour2 = String(endDate.getHours()).padStart(2, '0');
    const minute2 = String(endDate.getMinutes()).padStart(2, '0');
    // return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    [2023, 2024]
    let commonDate = [];
    let diffrence1 = [];
    let diffrence2 = [];
    // Compare date components (year, month, day)
    const now = new Date();
    if (now.getFullYear() !== year1) {
        if (year1 === year2) {
            commonDate.push(year1);
        } else {
            diffrence1.push(year1);
            diffrence2.push(year2);
        }
    }
    if (month1 === month2) {
        commonDate.push(month1);
    } else {
        diffrence1.push(month1);
        diffrence2.push(month2);
    }
    if (day1 === day2) {
        commonDate.push(day1);
    } else {
        diffrence1.push(day1);
        diffrence2.push(day2);
    }


    diffrence1.push(`${hour1}:${minute1}`);
    diffrence2.push(`${hour2}:${minute2}`);

    let commonDateAndTime = `${commonDate.join(' ')}`;

    if (diffrence1.length != 0 && diffrence2.length != 0) {
        commonDateAndTime += `, ${diffrence1.join(' ')} to ${diffrence2.join(' ')}`

    }
    return commonDateAndTime;
}

export const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const getHoursAndMinutes = (dateTimeString: string) => {
    if (dateTimeString === "") return "";
    const date = new Date(dateTimeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}

export const formatDistance = (distance: string) => {
    const meters = parseInt(distance);
    if (meters >= 1000) {
        return `${meters / 1000} km`;
    } else {
        return `${meters} m`;
    }
}
export const formatSingleDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const now = new Date();
    const year = date.getFullYear() !== now.getFullYear() ? `${date.getFullYear()}, ` : '';
    const month = date.toLocaleString('en-US', { month: 'short' });

    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}${month} ${day}, ${hours}:${minutes}`;
}


export const getVehicleInfo = (vehicle: Vehicle) => {
    return <div className="flex flex-col text-base">
        <div className="flex">
            <span className="w-2/6 font-bold mr-2">Year:</span>
            <span>{vehicle.year}</span>
        </div>
        <div className="flex">
            <span className="w-2/6 font-bold mr-2">Body type:</span>
            <span>{vehicle.type}</span>
        </div>
        <div className="flex">
            <span className="w-2/6 font-bold mr-2">Sitting Capacity:</span>
            <span>{vehicle.capacity}</span>
        </div>
        <div className="flex">
            <span className="w-2/6 font-bold mr-2">Mileage:</span>
            <span>{formatDistance(vehicle.mileage.toString())}</span>
        </div>
        <div className="flex">
            <span className="w-2/6 font-bold mr-2">License plate:</span>
            <span>{vehicle.license_plate}</span>
        </div>
    </div>
}