"use client"
import { api } from '@/app/services/api';
import { ICustomer } from '@/interface/customer';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ClientPage(){
    const { id } = useParams<{ id: string }>();
    const [client, setClient] = useState<ICustomer>();

    console.log(id);

    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {
        const response = await api.get(`https://userlist-testing.vercel.app/client/${id}`);
        setClient(response.data);
    }

    if (!client) {
        return <div>No client found</div>;
    }

    return (
        <div>
            <h1>Client Details</h1>
            <p><strong>ID:</strong> {client.id}</p>
            <p><strong>Name:</strong> {client.name}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Phone:</strong> {client.phone}</p>
            {
                client.product?.map((product) => (
                    <div key={product.id}>
                        <p><strong>Name:</strong> {product.name}</p>
                        <p><strong>Price:</strong> {product.price}</p>
                        <p><strong>Código:</strong> {product.product_code}</p>
                    </div>
                ))
            }
        </div>
    );
};