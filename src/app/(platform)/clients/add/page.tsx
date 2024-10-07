"use client"
import { useState, useRef, FormEvent } from 'react';
import axios from 'axios';
import { baseUrl } from '@/helpers/url';

export default function CreateClient() {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);

        if (!nameRef.current || !emailRef.current || !phoneRef.current) {
            setMessage("Nome, email e telefone são obrigatórios.");
            setLoading(false);
            return;
        }

        const clientData = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            phone: phoneRef.current.value,
        };

        try {
            const response = await axios.post(`${baseUrl}/clients`, clientData);
            setMessage(`Cliente criado com sucesso: ${response.data.user.name}`);
            clearForm();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.error || "Erro ao criar cliente ou produto.");
            } else {
                setMessage("Erro desconhecido ao criar cliente ou produto.");
            }
        } finally {
            setLoading(false);
        }
    }

    function clearForm() {
        if (nameRef.current) nameRef.current.value = '';
        if (emailRef.current) emailRef.current.value = '';
        if (phoneRef.current) phoneRef.current.value = '';
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full border border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Adicionar Cliente</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        ref={nameRef} 
                        type="text" 
                        className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="Nome" 
                        required 
                    />
                    <input 
                        ref={emailRef} 
                        type="email" 
                        className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="Email" 
                        required 
                    />
                    <input 
                        ref={phoneRef} 
                        type="text" 
                        className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="Telefone" 
                        required 
                    />
                    <button 
                        type="submit" 
                        className="bg-blue-600 text-white rounded-lg py-3 mt-4 hover:bg-blue-500 transition-all focus:ring-4 focus:ring-blue-300 disabled:bg-blue-300"
                        disabled={loading}
                    >
                        {loading ? "Carregando..." : "Concluir"}
                    </button>
                </form>
    
                {message && <p className="mt-4 text-center text-green-600">{message}</p>}
            </div>
        </div>
    );
}    