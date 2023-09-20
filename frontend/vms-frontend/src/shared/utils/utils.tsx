export const formatTimeRange = (startISO: string, endISO: string) => {
    const startDate = new Date(startISO);
    const endDate = new Date(endISO);

    // Function to format a date as "YYYY-MM-DD HH:mm:ss"
    const year1 = startDate.getFullYear();
    const month1 = String(startDate.getMonth() + 1).padStart(2, '0');
    const day1 = String(startDate.getDate()).padStart(2, '0');
    const hour1 = String(startDate.getHours()).padStart(2, '0');
    const minute1 = String(startDate.getMinutes()).padStart(2, '0');
    // return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    const year2 = endDate.getFullYear();
    const month2 = String(endDate.getMonth() + 1).padStart(2, '0');
    const day2 = String(endDate.getDate()).padStart(2, '0');
    const hour2 = String(endDate.getHours()).padStart(2, '0');
    const minute2 = String(endDate.getMinutes()).padStart(2, '0');
    // return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    [2023, 2024]
    let commonDate = [];
    let commonTime = [];
    let diffrence1 = [];
    let diffrence2 = [];
    // Compare date components (year, month, day)
    if (year1 === year2) {
        commonDate.push(year1);
    } else {
        diffrence1.push(year1);
        diffrence2.push(year2);
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

    if (hour1 === hour2) {
        commonTime.push(hour1);
        if (minute1 === minute2) {
            commonTime.push(minute1);
        } else {
            diffrence1.push(minute1);
            diffrence2.push(minute2);
        }
    } else {
        diffrence1.push(`${hour1}:${minute1}`);
        diffrence2.push(`${hour2}:${minute2}`);
    }

    let commonDateAndTime = `${commonDate.join('-')} ${commonTime.join('-')}`
    if (diffrence1.length != 0 && diffrence2.length != 0) {
        commonDateAndTime += `${diffrence1.join(' ')} to ${diffrence2.join(' ')}`

    }
    return commonDateAndTime;
}