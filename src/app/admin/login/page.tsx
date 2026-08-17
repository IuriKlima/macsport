"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      
      if (res.ok) {
        router.push("/admin");
      } else {
        throw new Error("Falha no servidor ao criar sessão segura.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Credenciais inválidas ou erro de sessão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-black border border-gray-800 p-8 rounded-t-3xl rounded-b-none w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-[#F5C400] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-black">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Macsport Admin</h1>
          <p className="text-gray-400 text-sm mt-2">Área Restrita do Sistema</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-t-xl rounded-b-none px-4 py-3 text-white focus:border-[#F5C400] outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-t-xl rounded-b-none px-4 py-3 text-white focus:border-[#F5C400] outline-none transition-colors"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#F5C400] hover:bg-yellow-500 text-black font-bold py-3 rounded-t-2xl rounded-b-none transition-colors mt-4 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "ENTRAR NO PAINEL"}
          </button>
        </form>
      </div>
    </div>
  );
}
