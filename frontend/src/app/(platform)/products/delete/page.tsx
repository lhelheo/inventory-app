"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const DeleteProductForm = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Função para buscar os produtos
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await axios.get("http://localhost:3000/product"); // Supondo que há uma rota para buscar produtos
                setProducts(response.data);
            } catch (error) {
                setMessage("Erro ao carregar produtos.");
            }
        }
        fetchProducts();
    }, []);

    // Função para deletar o produto selecionado
    async function handleDelete() {
        if (!selectedProductId) {
            setMessage("Por favor, selecione um produto.");
            return;
        }

        setLoading(true);

        try {
            await axios.delete(`http://localhost:3000/product/${selectedProductId}`);
            setMessage("Produto deletado com sucesso.");
            setProducts(products.filter((product) => product.id !== selectedProductId));
        } catch (error) {
            setMessage("Erro ao deletar o produto.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="border rounded p-10">
            <div className="my-4">
                <h1 className="text-xl">Deletar Produto</h1>
            </div>
            <div className="flex flex-col w-min gap-4">
                <select 
                    value={selectedProductId || ''} 
                    onChange={(e) => setSelectedProductId(Number(e.target.value))} 
                    className="rounded border p-2 text-black"
                >
                    <option value="" disabled>Selecione um produto</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name} - {product.product_code}
                        </option>
                    ))}
                </select>

                <button 
                    onClick={handleDelete} 
                    className="py-3 bg-red-600 hover:bg-red-500 transition-all"
                    disabled={loading}
                >
                    {loading ? "Carregando..." : "Deletar Produto"}
                </button>
            </div>

            {message && <p className="mt-4 text-center text-red-600">{message}</p>}
        </div>
        </div>
    );
};

export default DeleteProductForm;