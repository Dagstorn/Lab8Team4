// StaffPage.tsx
import React from 'react';

interface StaffMember {
    name: string;
    position: string;
    email: string;
    phone: string;
}

const StaffPage: React.FC = () => {
    const staffMembers: StaffMember[] = [
        { name: 'John Doe', position: 'CEO', email: 'john.doe@loremvms.com', phone: '+1 (234) 567-8901' },
        { name: 'Jane Smith', position: 'Operations Manager', email: 'jane.smith@loremvms.com', phone: '+1 (345) 678-9012' },
        { name: 'Bob Johnson', position: 'Lead Developer', email: 'bob.johnson@loremvms.com', phone: '+1 (456) 789-0123' },
        { name: 'Alice Williams', position: 'Marketing Coordinator', email: 'alice.williams@loremvms.com', phone: '+1 (567) 890-1234' },
        { name: 'David Brown', position: 'Customer Support Specialist', email: 'david.brown@loremvms.com', phone: '+1 (678) 901-2345' },
        { name: 'Emily Davis', position: 'UX/UI Designer', email: 'emily.davis@loremvms.com', phone: '+1 (789) 012-3456' },
        // Add more staff members as needed
    ];

    return (
        <div className="container mx-auto my-8 p-8 bg-gray-100">
            <h1 className="text-4xl font-bold mb-6">Our Staff</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {staffMembers.map((staff, index) => (
                    <div key={index} className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">{staff.name}</h2>
                        <p className="text-gray-600 mb-2">{staff.position}</p>
                        <p>Email: {staff.email}</p>
                        <p>Phone: {staff.phone}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffPage;
