"use client"
import { api } from '@/app/services/api';
import { baseUrl } from '@/helpers/url';
import { ICustomer } from '@/interface/customer';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ClientPage(){
    const { id } = useParams<{ id: string }>();
    const [client, setClient] = useState<ICustomer | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadClient();
    }, []);
    
    async function loadClient() {
        try {
            const response = await api.get(`${baseUrl}/client/${id}/`);
            setClient(response.data);
            console.log(response.data);
        } catch (err) {
            setError('Failed to load client data');
        } finally {
            setLoading(false);
        }
    }


    if (error) {
        return <div>Error: {error}</div>;
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
        </div>
    );
};