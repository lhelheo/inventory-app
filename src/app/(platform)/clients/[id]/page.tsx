"use client"
import { api } from '@/app/services/api';
import { ICustomer } from '@/interface/customer';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Client(){
    const { id } = useParams<{ id: string }>();
    const [client, setClient] = useState<ICustomer>();

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
        <div className="flex h-screen justify-center items-center">
            <h1>Informações do cliente</h1>
            <p><strong>ID:</strong> {client.id}</p>
            <p><strong>Name:</strong> {client.name}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Phone:</strong> {client.phone}</p>
            {
                client.product?.map((product) => (
                    <div key={product.id} className="p-10 bg-black text-white">
                        <p><strong>Name:</strong> {product.name}</p>
                        <p><strong>Price:</strong> {product.price}</p>
                        <p><strong>Código:</strong> {product.product_code}</p>
                    </div>
                ))
            }
        </div>
    );
};