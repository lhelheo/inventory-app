"use client"
import { useRef, useState, FormEvent } from "react";
import axios from "axios";

export default function CreateClient() {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        setMessage(null);  // Resetar a mensagem

        try {
            const { name, email, phone } = getFormData();
            const { token, userID } = getAuthData();

            await addClient({ name, email, phone, userID, token });
            clearFormFields();
            setMessage("Cliente adicionado com sucesso!");
        } catch (error: any) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    }

    function getFormData() {
        const name = nameRef.current?.value;
        const email = emailRef.current?.value;
        const phone = phoneRef.current?.value;

        if (!name || !email || !phone) {
            throw new Error("Todos os campos são obrigatórios.");
        }

        return { name, email, phone };
    }

    function getAuthData() {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            throw new Error("Usuário não autenticado.");
        }

        let userAuth;
        try {
            userAuth = JSON.parse(storedUser);
        } catch {
            throw new Error("Erro ao processar dados de autenticação.");
        }

        const userID = userAuth?.id;
        if (!userID) {
            throw new Error("ID de usuário inválido.");
        }

        return { token, userID };
    }

    async function addClient({ name, email, phone, userID, token }: any) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
            name,
            email,
            phone,
            userID,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,  // Adiciona o token ao cabeçalho
            }
        });

        if (response.status !== 201) {
            throw new Error("Falha ao adicionar cliente.");
        }
    }

    function clearFormFields() {
        if (nameRef.current) nameRef.current.value = "";
        if (emailRef.current) emailRef.current.value = "";
        if (phoneRef.current) phoneRef.current.value = "";
    }

    function handleError(error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Failed to create client", error.response.data);
            setMessage(error.response.data.message || "Erro ao adicionar o cliente.");
        } else {
            console.error("Failed to create client", error);
            setMessage(error.message || "Erro inesperado ao adicionar o cliente.");
        }
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
