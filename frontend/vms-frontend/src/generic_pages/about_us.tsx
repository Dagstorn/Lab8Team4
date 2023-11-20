// AboutUsPage.tsx
import React from 'react';

const AboutUsPage: React.FC = () => {
    return (
        <div className="container mx-auto my-8 p-8 bg-gray-100">
            <h1 className="text-4xl font-bold mb-6">About Us</h1>
            <p className="mb-4">
                Welcome to VMS, your go-to solution for innovative and efficient Vehicle Management Systems.
            </p>
            <p className="mb-4">
                At VMS, we strive to revolutionize the way organizations manage their fleets. Our cutting-edge technology
                empowers administrators to seamlessly assign tasks, monitor vehicle performance, and streamline operations.
            </p>
            <p className="mb-4">
                VMS is committed to delivering excellence in fleet management, providing you with the tools you need to
                enhance productivity and optimize your organization's vehicle utilization.
            </p>
            <p className="mb-4">
                Join us on this journey as we redefine the landscape of vehicle management, making it simpler, smarter, and more
                effective for your business.
            </p>
        </div>
    );
};

export default AboutUsPage;
