"use client"
import { api } from "@/app/services/api";
import { IProduct } from "@/interface/product";
import React from "react";
import { useEffect, useState } from "react";

export default function Products() {
    const [products, setProducts] = useState<IProduct[]>([]);
    
    useEffect(() => {
        loadProducts();
    }, []);
    
    async function loadProducts() {
        const response = await api.get("/product");
        setProducts(response.data);
    }

    return (
        <>
            {products.map((product) => (
                <div key={product.id} className="my-6">
                    <p>ID: {product.clientID ?? "Não informado"}</p>
                    <p>Nome: {product.name ?? "Não informado"}</p>
                    <p>Preço: {product.price ?? "Não informado"}</p>
                    <p>Código: {product.product_code ?? "Não informado"}</p>
                </div>
            ))}
        </>
    );
}