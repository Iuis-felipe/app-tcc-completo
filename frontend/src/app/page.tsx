"use client";

import axios from "axios";
import { AxiosError } from "axios";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Header from "@/components/header";

interface DocumentResult {
  title: string;
  content: string;
  score: number;
}

interface QueryResponse {
  answer: string;
  relevant_documents: DocumentResult[];
}

export default function Home() {
  const pathname = usePathname();
  const isSemanticSearch = pathname === "/" || pathname === "/busca-semantica";
  const isGraphPage = pathname === "/grafico";
  const isYearAnalysis = pathname === "/analise-anual";
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [documents, setDocuments] = useState<DocumentResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post<QueryResponse>("/api/query", { question });
      setAnswer(response.data.answer);
      setDocuments(response.data.relevant_documents);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.detail;
        const axiosMessage = error.message;
        setAnswer(`Erro na requisição: ${serverMessage || axiosMessage}`);
      } else if (error instanceof Error) {
        setAnswer(`Erro: ${error.message}`);
      } else {
        setAnswer("Ocorreu um erro desconhecido");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-[40px] py-8 ">
      <header className="mb-8">
        

        {/* Navegação com tabs */}
        <nav className="relative">
            <Header/>

        </nav>
      </header>
      <h1 className="text-[24px] font-medium mb-2">Busca Semântica de TCCs utilizando IA</h1>

      <form onSubmit={handleSubmit} className="mb-8 ">
        <div className="flex gap-2 ">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Digite o que deseja para a sua pesquisa"
            className="flex-1 px-6 border rounded-[16px] border-[#525252] bg-[#222222]"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-[#20E673] text-white font-bold px-[80px] py-3 rounded-[16px] hover:bg-[#1BC462] disabled:bg-gray-400 cursor-pointer"
            disabled={isLoading || !question.trim()}
          >
            {isLoading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {answer && !isLoading && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Resposta:</h2>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-[#000]">{answer}</div>
        </div>
      )}

      {documents.length > 0 && !isLoading && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Documentos Relevantes:</h2>
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <h3 className="font-medium">
                  {doc.title} (Score: {doc.score.toFixed(2)})
                </h3>
                <p className="text-gray-600 mt-2">{doc.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
