"use client";
import { useState, useEffect, useRef, FormEvent } from 'react';
import axios from 'axios';
import { baseUrl } from '@/helpers/url';
import { IProduct } from '@/interface/product';

interface Product{
    params: {
        id: string;
    };
}

export default function EditProduct(props: Product) {
    const [product, setProduct] = useState<IProduct | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const nameRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function fetchProduct() {
            if (!props.params.id) return;
            try {
                const response = await axios.get(`http://localhost:3000/product/3`);
                console.log(response.data);
                setProduct(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setMessage("Erro ao buscar o produto.");
                }
            }
        }
        fetchProduct();
    }, [props.params.id]);

    useEffect(() => {
        if (product && nameRef.current && priceRef.current && descriptionRef.current) {
            nameRef.current.value = product.name;
            priceRef.current.value = product.price.toString();
            descriptionRef.current.value = product.description;
        }
    }, [product]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);

        if (!product || !nameRef.current || !priceRef.current || !descriptionRef.current) {
            setMessage("Todos os campos são obrigatórios.");
            setLoading(false);
            return;
        }

        const updatedProduct = {
            name: nameRef.current.value,
            price: parseFloat(priceRef.current.value),
            description: descriptionRef.current.value,
        };

        try {
            await axios.put(`${baseUrl}/products/${props.params.id}`, updatedProduct);
            setMessage("Produto atualizado com sucesso.");
            clearForm();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.error || "Erro ao atualizar o produto.");
            } else {
                setMessage("Erro desconhecido ao atualizar o produto.");
            }
        } finally {
            setLoading(false);
        }
    }

    function clearForm() {
        if (nameRef.current) nameRef.current.value = '';
        if (priceRef.current) priceRef.current.value = '';
        if (descriptionRef.current) descriptionRef.current.value = '';
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="my-4">
                <h1 className="text-xl">Editar Produto</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col w-min gap-4">
                <input 
                    ref={nameRef} 
                    type="text" 
                    className="rounded-sm p-2 placeholder-black text-black" 
                    placeholder="Nome do produto" 
                    required 
                />
                <input 
                    ref={priceRef} 
                    type="number" 
                    step="0.01"
                    className="rounded-sm p-2 placeholder-black text-black" 
                    placeholder="Preço do produto" 
                    required 
                />
                <input 
                    ref={descriptionRef} 
                    type="text" 
                    className="rounded-sm p-2 placeholder-black text-black" 
                    placeholder="Descrição do produto" 
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
