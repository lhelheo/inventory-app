import Link from 'next/link'
import { Users, Package, PackagePlus, Boxes } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#181818] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#e3e3e3] mb-8">
          Sistema de Gestão
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard
            title="Gerenciar Clientes"
            icon={<Users className="h-6 w-6 text-[#e3e3e3]" />}
            href="/clients"
          />
          <DashboardCard
            title="Visualizar Produtos"
            icon={<Package className="h-6 w-6 text-[#e3e3e3]" />}
            href="/products"
          />
          <DashboardCard
            title="Criar Produto"
            icon={<PackagePlus className="h-6 w-6 text-[#e3e3e3]" />}
            href="/products/add"
          />
          <DashboardCard
            title="Visualizar Estoque"
            icon={<Boxes className="h-6 w-6 text-[#e3e3e3]" />}
            href="/stock"
          />
        </div>
      </div>
    </main>
  )
}

function DashboardCard({
  title,
  icon,
  href,
}: {
  title: string
  icon: React.ReactNode
  href: string
}) {
  return (
    <Link href={href} className="block">
      <div className="bg-[#242424] rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:scale-[101%] hover:bg-[#333333] ease-linear cursor-pointer">
        <div className="flex items-center space-x-4">
          <div className="bg-[#181818] p-3 rounded-full">{icon}</div>
          <h2 className="text-xl font-semibold text-[#e3e3e3]">{title}</h2>
        </div>
      </div>
    </Link>
  )
}
