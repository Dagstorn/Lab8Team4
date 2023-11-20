// ServicesPage.tsx
import React from 'react';

const ServicesPage: React.FC = () => {
    const services = [
        { title: 'Task Assignment', description: 'Efficiently assign tasks to drivers with our intuitive task assignment system.' },
        { title: 'Fleet Monitoring', description: 'Monitor your entire fleet in real-time and gain insights into vehicle performance.' },
        { title: 'Driver Management', description: 'Manage drivers seamlessly, track their activities, and ensure compliance.' },
        { title: 'Vehicle Maintenance', description: 'Streamline vehicle maintenance schedules to enhance reliability and reduce downtime.' },
        { title: 'Vehicle Fueling', description: 'Optimize fuel usage with our fueling management system, ensuring cost-effectiveness and sustainability.' },
        { title: 'Comprehensive Reports', description: 'Generate detailed reports on vehicle fuel consumption, repair history, and driver route history for informed decision-making.' },
        { title: 'Vehicle Repairs Log', description: 'Keep a comprehensive log of all vehicle repairs, including maintenance schedules and tasks performed.' },
        { title: 'Maintenance Workers', description: 'Efficiently manage maintenance workers, assigning tasks, and keeping track of repair jobs.' },
        { title: 'Fueling Workers', description: 'Efficiently manage fueling workers, assigning tasks, and keeping track of fueling jobs.' },
    ];

    return (
        <div className="container mx-auto my-8 p-8 bg-gray-100">
            <h1 className="text-4xl font-bold mb-6">Our Services</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <div key={index} className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesPage;
