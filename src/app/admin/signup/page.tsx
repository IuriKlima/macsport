"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const auth = getFirebaseAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao criar conta: " + err.message);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-black border border-green-500 p-8 rounded-t-3xl rounded-b-none text-center">
          <h2 className="text-2xl font-bold text-green-500 mb-2">Conta Criada!</h2>
          <p className="text-white">Redirecionando para o painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-black border border-gray-800 p-8 rounded-t-3xl rounded-b-none w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-[#F5C400] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-black">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Criar Administrador Inicial</h1>
          <p className="text-gray-400 text-sm mt-2 text-yellow-500">Crie seu login agora. Após criado, exclua este arquivo por segurança.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-t-xl rounded-b-none px-4 py-3 text-white focus:border-[#F5C400] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Senha (Mínimo 6 caracteres)</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-t-xl rounded-b-none px-4 py-3 text-white focus:border-[#F5C400] outline-none"
              required
              minLength={6}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#F5C400] text-black font-bold py-3 rounded-t-2xl rounded-b-none hover:bg-yellow-500 transition-colors mt-4"
          >
            CRIAR CONTA ADMIN
          </button>
        </form>
      </div>
    </div>
  );
}
