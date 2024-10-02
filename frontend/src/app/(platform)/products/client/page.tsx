"use client"
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import axios from 'axios';

export const AddProductToClientForm = () => {
    const [clients, setClients] = useState<any[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const productNameRef = useRef<HTMLInputElement>(null);
    const productPriceRef = useRef<HTMLInputElement>(null);
    const productCodeRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        async function fetchClients() {
            try {
                const response = await axios.get("http://localhost:3000/client"); // Supondo que há uma rota para buscar clientes
                setClients(response.data);
            } catch (error) {
                setMessage("Erro ao carregar clientes.");
            }
        }
        fetchClients();
    }, []);

    // Função para enviar o produto associado ao cliente
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
            const response = await axios.post(`http://localhost:3000/client/${selectedClientId}/product`, productData);
            setMessage(`Produto adicionado ao cliente: ${response.data.name}`);
            clearForm();
        } catch (error) {
            setMessage("Erro ao adicionar produto ao cliente.");
        } finally {
            setLoading(false);
        }
    }

    // Função para limpar o formulário
    function clearForm() {
        if (productNameRef.current) productNameRef.current.value = '';
        if (productPriceRef.current) productPriceRef.current.value = '';
        if (productCodeRef.current) productCodeRef.current.value = '';
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="my-4">
                <h1 className="text-xl">Adicionar Produto a Cliente</h1>
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
                            {client.name}
                        </option>
                    ))}
                </select>

                <input ref={productNameRef} type="text" className="rounded-sm p-2 placeholder-black text-black" placeholder="Nome do produto" required />
                <input ref={productPriceRef} type="number" className="rounded-sm p-2 placeholder-black text-black" placeholder="Preço do produto" step="0.01" required />
                <input ref={productCodeRef} type="text" className="rounded-sm p-2 placeholder-black text-black" placeholder="Código do produto" required />

                <button type="submit" className="py-3 bg-blue-600 hover:bg-blue-500 transition-all" disabled={loading}>
                    {loading ? "Carregando..." : "Adicionar Produto"}
                </button>
            </form>

            {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        </div>
    );
};

export default AddProductToClientForm;