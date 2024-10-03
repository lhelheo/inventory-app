"use client"
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import axios from 'axios';
import { IProduct } from '@/interface/product';
import { baseUrl } from '@/helpers/url';

export default function EditProductForm() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const productNameRef = useRef<HTMLInputElement>(null);
    const productPriceRef = useRef<HTMLInputElement>(null);
    const productCodeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await axios.get(`${baseUrl}/product`);
                setProducts(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setMessage("Erro ao buscar os produtos.");
                }
                else {
                    setMessage("Erro ao buscar os produtos.");
                }
            }
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedProductId) {
            const product = products.find((p) => p.id === selectedProductId);
            if (productNameRef.current && productPriceRef.current && productCodeRef.current && product) {
                productNameRef.current.value = product.name;
                productPriceRef.current.value = product.price;
                productCodeRef.current.value = product.product_code;
            }
        }
    }, [selectedProductId, products]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);

        if (!selectedProductId || !productNameRef.current || !productPriceRef.current || !productCodeRef.current) {
            setMessage("Todos os campos são obrigatórios.");
            setLoading(false);
            return;
        }

        const updatedProduct = {
            name: productNameRef.current.value,
            price: parseFloat(productPriceRef.current.value),
            productCode: productCodeRef.current.value,
        };

        try {
            await axios.put(`${baseUrl}/product/${selectedProductId}`, updatedProduct);
            setMessage("Produto atualizado com sucesso.");
            clearForm();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.error || "Erro ao atualizar o produto.");
            }
            else {
                setMessage("Erro desconhecido ao atualizar o produto.");
            }
        } finally {
            setLoading(false);
        }
    }

    function clearForm() {
        if (productNameRef.current) productNameRef.current.value = '';
        if (productPriceRef.current) productPriceRef.current.value = '';
        if (productCodeRef.current) productCodeRef.current.value = '';
        setSelectedProductId(null);
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="border rounded p-10">
            <div className="flex items-center justify-center my-4">
                <h1 className="text-xl">Editar Produto</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full gap-4">
                <select 
                    value={selectedProductId || ''} 
                    onChange={(e) => setSelectedProductId(Number(e.target.value))} 
                    className="rounded border p-2 text-black"
                >
                    <option value="" disabled>Selecione um produto</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name} - R$ {product.price}
                        </option>
                    ))}
                </select>

                <input ref={productNameRef} type="text" className="rounded border p-2 placeholder-black text-black" placeholder="Nome do produto" required />
                <input ref={productPriceRef} type="number" className="rounded border p-2 placeholder-black text-black" placeholder="Preço do produto" step="0.01" required />
                <input ref={productCodeRef} type="text" className="rounded border p-2 placeholder-black text-black" placeholder="Código do produto" required />

                <button type="submit" className="py-3 bg-blue-600 text-white rounded hover:bg-blue-500 transition-all w-full" disabled={loading}>
                    {loading ? "Carregando..." : "Salvar Alterações"}
                </button>
            </form>

            {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        </div>
        </div>
    );
};