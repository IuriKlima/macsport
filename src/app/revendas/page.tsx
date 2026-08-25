export const dynamic = 'force-dynamic';
import { Map, MapPin } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Revendas Autorizadas',
  description: 'Encontre um revendedor autorizado Macsport próximo a você.',
  openGraph: {
    title: 'Revendas Autorizadas',
    description: 'Encontre um revendedor autorizado Macsport próximo a você.',
  },
}

import Link from 'next/link'
import RevendasClient from './RevendasClient'

import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export const dynamic = 'force-dynamic';
export default async function RevendasPage() {
  let revendas: any[] = []

  try {
    const querySnapshot = await getDocs(collection(db, "revendas"))
    revendas = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Erro ao buscar revendas:", error)
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-16">
      {/* Header Section (Yellow) */}
      <section className="bg-[#F5C400] pt-32 pb-48 px-4 md:px-8 lg:px-16 relative">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm font-medium mb-8 text-black/70">
            <Link href="/" className="hover:text-black flex items-center gap-1">
              &lt; Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black font-bold">Revendas</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-black">
            Revendas
          </h1>
          <p className="text-xl text-black/80 font-medium max-w-3xl">
            Encontre o representante Macsport mais próximo de você. Nossa rede de distribuidores autorizados 
            está pronta para atender sua academia em todo o território nacional.
          </p>
        </div>
      </section>

      {/* Main Content overlapping */}
      <section className="px-4 md:px-8 lg:px-16 -mt-32 relative z-10 mb-20">
        <div className="max-w-7xl mx-auto">
          <RevendasClient revendas={revendas} />
        </div>
      </section>
    </main>
  )
}
