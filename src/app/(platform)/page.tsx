'use client'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { baseUrl } from '@/helpers/url'
import { LoadingCircle } from '@/component/loadingCircle'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    localStorage.removeItem('token')
  }, [])

  async function handleLogin(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await axios.post(`${baseUrl}/login`, {
        username,
        password,
      })

      if (response.status === 200 && response.data?.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        router.push('/home')
      } else {
        setError('Invalid login credentials')
        console.log('Login failed:', response.data)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Login error:', error.response.data)
        setError(error.response.data.message || 'Login failed')
      } else {
        console.error('Login error:', error)
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-[#181818]">
      {loading ? (
        <LoadingCircle />
      ) : (
        <form
          onSubmit={handleLogin}
          className="flex flex-col w-[480px] bg-[#242424] rounded shadow md:p-16 p-10"
        >
          <div className="flex flex-col text-[#e3e3e3] justify-center items-center text-xl">
            <p className="text-3xl font-bold text-center">
              Duda Brandão Gestão
            </p>
            <p className="font-semibold mt-4">Acesse sua conta</p>
          </div>
          <div className="my-4 gap-3 flex flex-col">
            <label>
              <p className="text-[#e3e3e3]">Usuário</p>
              <input
                type="text"
                className="flex rounded w-full mb-2 p-2 bg-[#181818] shadow-md text-[#e3e3e3]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label>
              <p className="text-[#e3e3e3]">Senha</p>
              <input
                type="password"
                className="flex bg-[#181818] shadow-md text-[#e3e3e3] rounded w-full mb-2 p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="relative">
            <button
              type="submit"
              className={`px-4 py-2 mt-4 bg-[#181818] text-[#e3e3e3] rounded w-full hover:bg-[#1f1f1f] ease-linear transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Login'}
            </button>
            {error && (
              <p className="flex justify-center text-red-500 my-4">{error}</p>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
