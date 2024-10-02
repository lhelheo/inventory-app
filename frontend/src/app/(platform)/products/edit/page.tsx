"use client"
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import axios from 'axios';

export const EditProductForm = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const productNameRef = useRef<HTMLInputElement>(null);
    const productPriceRef = useRef<HTMLInputElement>(null);
    const productCodeRef = useRef<HTMLInputElement>(null);

    // Função para buscar os produtos existentes
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

    // Função para carregar os dados do produto selecionado para edição
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

    // Função para atualizar o produto selecionado
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
            await axios.put(`http://localhost:3000/product/${selectedProductId}`, updatedProduct);
            setMessage("Produto atualizado com sucesso.");
            clearForm();
        } catch (error) {
            setMessage("Erro ao atualizar o produto.");
        } finally {
            setLoading(false);
        }
    }

    // Função para limpar o formulário após a atualização
    function clearForm() {
        if (productNameRef.current) productNameRef.current.value = '';
        if (productPriceRef.current) productPriceRef.current.value = '';
        if (productCodeRef.current) productCodeRef.current.value = '';
        setSelectedProductId(null);
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="border rounded p-10">
            <div className="my-4">
                <h1 className="text-xl">Editar Produto</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col w-min gap-4">
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

                <button type="submit" className="py-3 bg-blue-600 text-white rounded hover:bg-blue-500 transition-all" disabled={loading}>
                    {loading ? "Carregando..." : "Salvar Alterações"}
                </button>
            </form>

            {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        </div>
        </div>
    );
};

export default EditProductForm;
