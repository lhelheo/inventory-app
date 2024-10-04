"use client"
import { api } from "@/app/services/api";
import { baseUrl } from "@/helpers/url";
import { IProduct } from "@/interface/product";
import React from "react";
import { useEffect, useState } from "react";

export default function Products() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        loadProducts();
    }, []);
    
    async function loadProducts() {
        try {
            const response = await api.get(`${baseUrl}/products`);
            setProducts(response.data);
        }
        catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading ? (
                <div className="flex flex-col justify-center items-center h-screen">
                    <p>Carregando produtos...</p>
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center h-screen">
                    <h1 className="text-xl mb-4">Produtos</h1>
                    <div className="border rounded p-10">
                        {products.map((product) => (
                            <div key={product.id} className="my-6">
                                <p>ID: {product.clientID ?? "Não informado"}</p>
                                <p>Nome: {product.name ?? "Não informado"}</p>
                                <p>Preço: {product.price ?? "Não informado"}</p>
                                <p>Código: {product.product_code ?? "Não informado"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}