"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/helpers/url';
import { IProduct } from '@/interface/interfaces';

export default function DeleteProduct() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await axios.get(`${baseUrl}/products`);
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

    async function handleDelete() {
        if (!selectedProductId) {
            setMessage("Por favor, selecione um produto.");
            return;
        }

        setLoading(true);

        try {
            await axios.delete(`${baseUrl}/product/${selectedProductId}`);
            setMessage("Produto deletado com sucesso.");
            setProducts(products.filter((product) => product.id !== selectedProductId));
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setMessage("Erro ao deletar o produto.");
            }
            else {
                setMessage("Erro ao deletar o produto.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full border border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Deletar Produto</h1>
                <div className="flex flex-col gap-4">
                    <select
                        value={selectedProductId || ''}
                        onChange={(e) => setSelectedProductId(Number(e.target.value))}
                        className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                        className="bg-red-600 text-white rounded-lg py-3 mt-4 hover:bg-red-500 transition-all focus:ring-4 focus:ring-red-300 disabled:bg-red-300"
                        disabled={loading}
                    >
                        {loading ? "Carregando..." : "Deletar"}
                    </button>
                </div>
    
                {message && <p className="mt-4 text-center text-red-600">{message}</p>}
            </div>
        </div>
    );
}    