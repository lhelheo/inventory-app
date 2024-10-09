"use client"
import { api } from '@/app/services/api';
import { ICustomer } from '@/interface/customer';
import { useParams } from 'next/navigation';
import React from 'react';
import { useEffect, useState } from 'react';

export default function Client(){
    const { id } = useParams<{ id: string }>();
    const [client, setClient] = useState<ICustomer>();
    const [loading, setLoading] = useState(true);   

    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {
        try {
            const response = await api.get(`https://userlist-testing.vercel.app/client/${id}`);
            setClient(response.data);
        }
        catch (error) {
            console.error("Failed to load customers", error);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
        {
            loading ? (
                <p className="flex justify-center items-center h-screen">Carregando cliente...</p>
            ) : (
                <div className="flex flex-col h-screen justify-center items-center bg-gray-100">
            <div className="my-6 p-6 bg-white shadow-md rounded-lg">
                <h1 className="font-semibold text-xl text-gray-800">Informações do cliente</h1>
                <p className="text-gray-600">{client?.id} - {client?.name}</p>
                <p className="text-gray-600">Contato - {client?.email} / {client?.phone}</p>
            </div>
            <div className="w-full max-w-2xl mt-4">
                <p className="font-semibold text-lg mb-2 text-gray-800">Produtos</p>
                <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="px-4 py-2 text-left">Nome</th>
                            <th className="px-4 py-2 text-left">Preço</th>
                            <th className="px-4 py-2 text-left">Código</th>
                            <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {client?.product?.map((product) => (
                            <tr key={product.id} className="border-t border-gray-200">
                                <td className="px-4 py-2">{product.name}</td>
                                <td className="px-4 py-2">{product.price}</td>
                                <td className="px-4 py-2">{product.product_code}</td>
                                <td className="px-4 py-2">{product.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
            )
        }
        </>
    );
}