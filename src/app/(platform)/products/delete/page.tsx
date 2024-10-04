"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/helpers/url';
import { IProduct } from '@/interface/product';

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
                    className="rounded py-3 text-white bg-red-600 hover:bg-red-500 transition-all"
                    disabled={loading}
                >
                    {loading ? "Carregando..." : "Deletar"}
                </button>
            </div>

            {message && <p className="mt-4 text-center text-red-600">{message}</p>}
        </div>
        </div>
    );
};
