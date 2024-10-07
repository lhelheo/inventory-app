"use client"
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import axios from 'axios';
import { ICustomer } from '@/interface/customer';
import { baseUrl } from '@/helpers/url';

export default function CreateProduct() {
    const [clients, setClients] = useState<ICustomer[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const productNameRef = useRef<HTMLInputElement>(null);
    const productPriceRef = useRef<HTMLInputElement>(null);
    const productCodeRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        async function fetchClients() {
            try {
                const response = await axios.get(`${baseUrl}/clients`);
                setClients(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setMessage("Erro ao buscar os clientes.");
                }
                else {
                    setMessage("Erro ao buscar os clientes.");
                }
            }
        }
        fetchClients();
    }, []);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);

        if (!selectedClientId || !productNameRef.current || !productPriceRef.current || !productCodeRef.current) {
            setMessage("Todos os campos são obrigatórios.");
            setLoading(false);
            return;
        }

        const productData = {
            name: productNameRef.current.value,
            price: parseFloat(productPriceRef.current.value),
            productCode: productCodeRef.current.value,
        };

        try {
            const response = await axios.post(`${baseUrl}/client/${selectedClientId}/product`, productData);
            setMessage(`Produto adicionado ao cliente: ${response.data.name}`);
            clearForm();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setMessage("Erro ao adicionar o produto ao cliente.");
            }
            else {
                setMessage("Erro ao adicionar o produto ao cliente.");
            }
        } finally {
            setLoading(false);
        }
    }

    function clearForm() {
        if (productNameRef.current) productNameRef.current.value = '';
        if (productPriceRef.current) productPriceRef.current.value = '';
        if (productCodeRef.current) productCodeRef.current.value = '';
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Adicionar Produto a um Cliente</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <select
                value={selectedClientId || ''}
                onChange={(e) => setSelectedClientId(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="" disabled>Selecione um cliente</option>
                {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                        {client.name}
                    </option>
                ))}
            </select>

            <input 
                ref={productNameRef} 
                type="text" 
                className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Nome do produto" 
                required 
            />
            <input 
                ref={productPriceRef} 
                type="number" 
                className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Preço do produto" 
                step="0.01" 
                required 
            />
            <input 
                ref={productCodeRef} 
                type="text" 
                className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Código do produto" 
                required 
            />

            <button 
                type="submit" 
                className="bg-blue-600 text-white rounded-lg py-3 mt-4 hover:bg-blue-500 transition-all focus:ring-4 focus:ring-blue-300 disabled:bg-blue-300"
                disabled={loading}
            >
                {loading ? "Carregando..." : "Adicionar Produto"}
            </button>
        </form>

        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
</div>
    );
};
