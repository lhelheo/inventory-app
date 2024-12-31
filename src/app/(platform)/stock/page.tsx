'use client'
import { baseUrl } from '@/helpers/url'
import { IProduct } from '@/interface/interfaces'
import axios from 'axios'
import { StockPage } from './content'
import { LoadingCircle } from '@/component/loadingCircle'

import { useState, useEffect } from 'react'

export default function Stock() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<IProduct[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/products`)
        setProducts(response.data)
      } catch (error) {
        console.error('Error ao carregar os produtos:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div>{loading ? <LoadingCircle /> : <StockPage products={products} />}</div>
  )
}
