// Sua página Home - VERSÃO COMPLETA E AJUSTADA

"use client";

import axios from "axios";
import { useState, FormEvent } from "react";
import Header from "@/components/header";
// Use o nome do seu componente de gráfico
import ResultsChart from "@/components/SemanticResultsChart";

// --- Interfaces de Dados ---
interface DocumentResult {
  title: string;
  content: string;
  score: number;
}

interface VisualizationData {
  type: string;
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
}

// ALTERAÇÃO 1: Adicionados os novos campos opcionais que vêm do backend
interface QueryResponse {
  answer: string;
  relevant_documents: DocumentResult[];
  visualization_data?: VisualizationData;
  recommendation?: string;
}


export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [documents, setDocuments] = useState<DocumentResult[]>([]);
  const [visualizationData, setVisualizationData] = useState<VisualizationData | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Limpa os resultados anteriores para uma nova busca
    setAnswer("");
    setDocuments([]);
    setVisualizationData(null);
    setRecommendation(null);

    try {
      // A chamada ao backend está correta. A tipagem agora corresponde à resposta completa.
      const response = await axios.post<QueryResponse>("http://localhost:8000/query", { question });

      // Atualiza todos os estados com a nova resposta do backend
      setAnswer(response.data.answer);
      setDocuments(response.data.relevant_documents);
      
      // Verifica se os novos dados existem antes de atualizar o estado
      if (response.data.visualization_data) {
        setVisualizationData(response.data.visualization_data);
      }
      if (response.data.recommendation) {
        setRecommendation(response.data.recommendation);
      }
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
    <div className="mx-[40px] py-8">
      <Header />
      <h1 className="text-[24px] font-medium mb-[10px]">Busca Semântica de TCCs utilizando IA</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1BC462] mx-auto"></div>
        </div>
      )}

      {/* --- Seção de Resultados (Renderiza somente quando não está carregando) --- */}
      {!isLoading && (answer || documents.length > 0) && (
        <div className="space-y-10"> {/* Aumentado o espaço entre as seções */}
          
          {/* Resposta Principal da IA */}
          {answer && (
            <div>
              <h2 className="text-[22px] font-medium mb-4">Análise da IA</h2>
              <div className="bg-[#222222] p-6 rounded-lg border border-[#525252] whitespace-pre-wrap text-gray-200 leading-relaxed">{answer}</div>
            </div>
          )}

          {/* ALTERAÇÃO 2: Seção do Gráfico de Visualização */}
          {visualizationData && (
            <div>
              <h2 className="text-[22px] font-medium mb-4">Análise Visual dos Resultados</h2>
              <div className="bg-[#222222] p-4 rounded-lg border border-[#525252]">
                <ResultsChart chartData={visualizationData} />
              </div>
            </div>
          )}

          {/* ALTERAÇÃO 3: Seção da Recomendação da IA sobre o Gráfico */}
          {recommendation && (
            <div>
              <h2 className="text-[22px] font-medium mb-4">Recomendação para Próximos Passos</h2>
              <div className="bg-[#2a2a2a] p-6 rounded-lg border border-dashed border-[#525252] text-gray-300 italic whitespace-pre-wrap">
                <p>"{recommendation}"</p>
              </div>
            </div>
          )}

          {/* Lista de Documentos Relevantes */}
          {documents.length > 0 && (
            <div>
              <h2 className="text-[22px] font-semibold text-gray-100">Documentos Relevantes</h2>
              <p className="text-sm mt-1 mb-4 text-gray-400">
                Score: Quanto maior for o score, mais próximo da busca o artigo está posicionado.
              </p>
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <div key={index} className="p-4 border rounded-[16px] border-[#525252] bg-[#222222]">
                    <h3 className="font-bold text-[#20E673]">
                      {doc.title} <span className="text-sm font-normal text-gray-400">(Score: {doc.score.toFixed(2)})</span>
                    </h3>
                    <p className="text-gray-300 mt-2">{doc.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}