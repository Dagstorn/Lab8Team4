// ContactsPage.tsx
import React from 'react';

const ContactsPage: React.FC = () => {
    const contactInfo = [
        { type: 'Email', value: 'info@loremvms.com' },
        { type: 'Phone', value: '+1 (123) 456-7890' },
        { type: 'Address', value: '123 Main Street, Cityville, Country' },
    ];

    return (
        <div className="container mx-auto my-8 p-8 bg-gray-100">
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {contactInfo.map((contact, index) => (
                    <div key={index} className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">{contact.type}</h2>
                        <p>{contact.value}</p>
                    </div>
                ))}
            </div>
            <p className="mt-6">
                Have questions or need assistance? Feel free to reach out to us through any of the channels above.
            </p>
        </div>
    );
};

export default ContactsPage;
