"use client";
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import axios from 'axios';
import { baseUrl } from '@/helpers/url';
import { ICustomer } from '@/interface/customer';

export const EditClientForm = () => {
    const [clients, setClients] = useState<ICustomer[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function fetchClients() {
            try {
                const response = await axios.get(`${baseUrl}/client`);
                setClients(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setMessage("Erro ao buscar os clientes.");
                }
            }
        }
        fetchClients();
    }, []);

    useEffect(() => {
        if (selectedClientId) {
            const client = clients.find((c) => c.id === selectedClientId);
            if (client && nameRef.current && emailRef.current && phoneRef.current) {
                nameRef.current.value = client.name;
                emailRef.current.value = client.email;
                phoneRef.current.value = client.phone;
            }
        }
    }, [selectedClientId, clients]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);

        if (!selectedClientId || !nameRef.current || !emailRef.current || !phoneRef.current) {
            setMessage("Todos os campos são obrigatórios.");
            setLoading(false);
            return;
        }

        const updatedClient = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            phone: phoneRef.current.value,
        };

        try {
            await axios.put(`${baseUrl}/product/${selectedClientId}/client`, updatedClient);
            setMessage("Cliente atualizado com sucesso.");
            clearForm();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.error || "Erro ao atualizar o cliente.");
            } else {
                setMessage("Erro desconhecido ao atualizar o cliente.");
            }
        } finally {
            setLoading(false);
        }
    }

    function clearForm() {
        if (nameRef.current) nameRef.current.value = '';
        if (emailRef.current) emailRef.current.value = '';
        if (phoneRef.current) phoneRef.current.value = '';
        setSelectedClientId(null);
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="my-4">
                <h1 className="text-xl">Editar Cliente</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col w-min gap-4">
                <select 
                    value={selectedClientId || ''} 
                    onChange={(e) => setSelectedClientId(Number(e.target.value))} 
                    className="rounded-sm p-2 text-black"
                >
                    <option value="" disabled>Selecione um cliente</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.name} - {client.email}
                        </option>
                    ))}
                </select>

                <input 
                    ref={nameRef} 
                    type="text" 
                    className="rounded-sm p-2 placeholder-black text-black" 
                    placeholder="Nome do cliente" 
                    required 
                />
                <input 
                    ref={emailRef} 
                    type="email" 
                    className="rounded-sm p-2 placeholder-black text-black" 
                    placeholder="Email do cliente" 
                    required 
                />
                <input 
                    ref={phoneRef} 
                    type="tel" 
                    className="rounded-sm p-2 placeholder-black text-black" 
                    placeholder="Telefone do cliente" 
                    required 
                />

                <button 
                    type="submit" 
                    className="py-3 bg-blue-600 hover:bg-blue-500 transition-all" 
                    disabled={loading}
                >
                    {loading ? "Carregando..." : "Salvar Alterações"}
                </button>
            </form>

            {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        </div>
    );
};

export default EditClientForm;
