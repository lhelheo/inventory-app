"use client"
import { baseUrl } from '@/helpers/url';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export default function ClientPage(){
    const { id } = useParams<{ id: string }>();
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await fetch(`${baseUrl}/clients/${id}`);
                console.log(response);
                if (!response.ok) {
                    throw new Error('Failed to fetch client');
                }
                const data: Client = await response.json();
                setClient(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error has occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
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