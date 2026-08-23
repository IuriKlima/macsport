"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Message = { id: number; sender: "bot" | "user"; text: string };
type Step = "name" | "city" | "phone" | "done";

export function WhatsAppButton({ phoneNumber }: { phoneNumber?: string }) {
  const { t } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const [step, setStep] = useState<Step>("name");
  const [userData, setUserData] = useState({ name: "", city: "", phone: "" });
  const [inputValue, setInputValue] = useState("");
  
  const defaultGreeting = "Seja bem vindo(a) à Macsport, sou Maia assistente virtual, como podemos ajudá-lo?";
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "bot", text: `${t('whatsapp_greeting') || defaultGreeting} Para iniciarmos, qual é o seu nome?` }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show the tooltip after 3 seconds if not dismissed and not open
    const timer = setTimeout(() => {
      if (!isDismissed && !isOpen) {
        setShowTooltip(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isDismissed, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const defaultNumber = "5511975297371"; // Fallback if settings.whatsapp is missing
  const cleanNumber = (phoneNumber || defaultNumber).replace(/\D/g, "");

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;

    // Add user message
    const newUserMsg: Message = { id: Date.now(), sender: "user", text };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");

    // Process step
    setTimeout(() => {
      if (step === "name") {
        setUserData(prev => ({ ...prev, name: text }));
        setMessages(prev => [...prev, { id: Date.now(), sender: "bot", text: `Prazer em te conhecer, ${text}! De qual cidade e estado você está falando?` }]);
        setStep("city");
      } else if (step === "city") {
        setUserData(prev => ({ ...prev, city: text }));
        setMessages(prev => [...prev, { id: Date.now(), sender: "bot", text: `Ótimo! Por último, qual o seu telefone/WhatsApp?` }]);
        setStep("phone");
      } else if (step === "phone") {
        setUserData(prev => ({ ...prev, phone: text }));
        setMessages(prev => [...prev, { id: Date.now(), sender: "bot", text: `Perfeito! Vou te transferir para um de nossos especialistas agora...` }]);
        setStep("done");
        
        // Redirect to WhatsApp
        setTimeout(() => {
          const waText = encodeURIComponent(`Olá, gostaria de atendimento. Meu nome é ${userData.name || text} de ${userData.city}.`);
          window.open(`https://wa.me/${cleanNumber}?text=${waText}`, '_blank');
          // Reset chat after a while
          setTimeout(() => {
            setIsOpen(false);
            setStep("name");
            setUserData({ name: "", city: "", phone: "" });
            setMessages([{ id: Date.now(), sender: "bot", text: `${t('whatsapp_greeting') || defaultGreeting} Para iniciarmos, qual é o seu nome?` }]);
          }, 1000);
        }, 1500);
      }
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-[320px] max-h-[500px] flex flex-col border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-[#25D366] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#25D366] font-bold text-xl overflow-hidden">
                <span className="text-xl">👩🏼‍💻</span>
              </div>
              <div>
                <h3 className="font-bold leading-tight">Maia</h3>
                <p className="text-xs text-green-100">Assistente Macsport</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto flex flex-col gap-3 min-h-[300px] max-h-[350px]">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#E7FFDB] text-gray-800 rounded-tr-none border border-green-200' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {step === 'done' && (
              <div className="flex justify-center mt-2">
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150"></span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={step === 'phone' ? 'Seu telefone...' : 'Digite sua mensagem...'}
                className="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#25D366]/50"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={step === 'done'}
                autoFocus
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || step === 'done'}
                className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-[#1ebd59] transition-colors flex-shrink-0"
              >
                <Send size={18} className="ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}

      {!isOpen && showTooltip && (
        <div className="bg-white p-4 rounded-[2rem] shadow-2xl max-w-[280px] border border-gray-100 relative mb-2 animate-in fade-in zoom-in duration-300">
          <button 
            onClick={(e) => { e.preventDefault(); setShowTooltip(false); setIsDismissed(true); }}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="text-sm font-medium text-gray-800 leading-relaxed pr-4 pl-2 pt-2">
            {t('whatsapp_greeting') || defaultGreeting}
          </div>
          {/* Triângulo (rabinho do balão) */}
          <div className="absolute -bottom-2 right-6 w-5 h-5 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:bg-[#1ebd59] hover:scale-110 transition-transform duration-300 flex items-center justify-center"
          aria-label="Fale conosco no WhatsApp"
          onMouseEnter={() => setShowTooltip(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
      )}
    </div>
  );
}
