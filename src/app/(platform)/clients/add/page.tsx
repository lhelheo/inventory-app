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
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col justify-center items-center border border-opacity-30 border-blue-500 rounded p-10">
            <div className="my-4">
                <h1 className="text-xl">Adicionar Cliente</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col w-min gap-4">
                <input ref={nameRef} type="text" className="border rounded p-2 placeholder-black text-black" placeholder="Nome" required />
                <input ref={emailRef} type="email" className="border rounded p-2 placeholder-black text-black" placeholder="Email" required />
                <input ref={phoneRef} type="text" className="border rounded p-2 placeholder-black text-black" placeholder="Telefone" required />
                <button type="submit" className="py-3 bg-blue-600 hover:bg-blue-500 transition-all" disabled={loading}>
                    {loading ? "Carregando..." : "Concluir"}
                </button>
            </form>

            {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        </div>
        </div>
    );
};