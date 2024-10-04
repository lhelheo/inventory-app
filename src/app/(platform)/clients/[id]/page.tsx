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
        <div className="flex flex-col h-screen justify-center items-center">
            <div className="my-6">
                <h1 className="font-semibold">Informações do cliente</h1>
                <p>{client.id} - {client.name}</p>
                <p>Contato - {client.email} / {client.phone}</p>
            </div>
            <p className="font-semibold">Produtos</p>
            {
                client.product?.map((product) => (
                    <div key={product.id} className="w-full max-w-[300px] p-10 border">
                        <p><strong>ID:</strong> {product.id}</p>
                        <p><strong>Name:</strong> {product.name}</p>
                        <p><strong>Price:</strong> {product.price}</p>
                        <p><strong>Código:</strong> {product.product_code}</p>
                    </div>
                ))
            }
        </div>
    );
};