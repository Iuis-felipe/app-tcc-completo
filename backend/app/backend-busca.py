from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from openai import OpenAI
import os
from dotenv import load_dotenv
import logging

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


openai_api_key = os.getenv("OPENAI_API_KEY")
qdrant_api_key = os.getenv("QDRANT_API_KEY")
qdrant_url = os.getenv("QDRANT_URL")

qdrant_client = QdrantClient(
    url=qdrant_url,
    api_key=qdrant_api_key,
)

client = OpenAI(api_key=openai_api_key)


model = SentenceTransformer("all-MiniLM-L6-v2")
pergunta = "{question}"
vetor_consulta = model.encode(pergunta).tolist()

qdrant_client.get_collections()
logger.info("Conexão com Qdrant estabelecida com sucesso")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, é pra por o dominio aqui
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str


class DocumentResult(BaseModel):
    title: str
    content: str
    score: float


class QueryResponse(BaseModel):
    answer: str
    relevant_documents: List[DocumentResult]


@app.get("/healthcheck")
async def healthcheck():
    return {"status": "ok", "message": "Backend operacional"}


@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    try:
        print(f"Processando pergunta: {request.question}")

        # 1. Geração de embedding
        try:
            vetor_consulta = model.encode(request.question).tolist()
            print("Embedding gerado com sucesso")
        except Exception as e:
            print(f"Erro ao gerar embedding: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Erro ao processar a pergunta: {str(e)}"
            )

        # 2. Busca no Qdrant
        try:
            resultados = qdrant_client.search(
                collection_name="tccs",
                query_vector=vetor_consulta,
                limit=5,
                score_threshold=0.3,
            )
            print(f"Encontrados {len(resultados)} resultados")
        except Exception as e:
            print(f"Erro ao buscar no Qdrant: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Erro ao buscar documentos: {str(e)}"
            )

        if not resultados:
            print("Nenhum resultado encontrado")
            return QueryResponse(
                answer="Nenhum documento relevante encontrado.", relevant_documents=[]
            )

        # 3. Processamento dos resultados
        documentos_relevantes = []
        documents_for_response = []

        for i, hit in enumerate(resultados):
            try:
                texto = (
                    (hit.payload.get("titulo") or "")
                    + "\n\n"
                    + (hit.payload.get("resumo") or "")
                    + "\n\n"
                    + (hit.payload.get("content") or "")
                ).strip()

                if texto:
                    documentos_relevantes.append(texto)
                    documents_for_response.append(
                        DocumentResult(
                            title=hit.payload.get("titulo", "Sem título"),
                            content=texto[:500] + "..." if len(texto) > 500 else texto,
                            score=hit.score,
                        )
                    )
                    print(f"Documento {i+1} processado")
            except Exception as e:
                print(f"Erro ao processar documento {i}: {str(e)}")
                continue

        if not documentos_relevantes:
            print("Nenhum documento com conteúdo válido")
            return QueryResponse(
                answer="Nenhum conteúdo relevante encontrado nos documentos.",
                relevant_documents=[],
            )

        # 4. Chamada à OpenAI
        try:
            contexto = "\n\n---\n\n".join(documentos_relevantes)
            prompt = f"""
                Com base NOS DOCUMENTOS ABAIXO (não use conhecimento externo), responda:
                - Quais TCCs da base abordam diretamente a pergunta?
                - Resuma suas contribuições principais

                Documentos:
                {contexto}

                Pergunta:
                {request.question}
                """

            print("Enviando para a OpenAI...")
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "Você é um assistente acadêmico especializado em análise de TCCs. Sua função é ajudar na busca e interpretação de trabalhos de conclusão de curso com base em solicitações do usuário, que podem ser tanto perguntas específicas quanto buscas por termos aleatórios. Quando receber uma pergunta direta, você deve identificar os TCCs mais relevantes para respondê-la, explicando como cada um aborda o tema, destacando objetivos, metodologia e conclusões. Se a solicitação for uma **busca por palavras-chave**, selecione os trabalhos mais pertinentes com base na recorrência e profundidade do conteúdo relacionado aos termos. Sempre organize sua resposta de forma clara, listando os trabalhos por ordem de relevância e descrevendo sua conexão com o tema. Inclua trechos diretos dos TCCs quando forem particularmente esclarecedores, citando a página ou parágrafo de referência. Se nenhum trabalho for encontrado, informe isso de maneira objetiva e sugira ajustes na busca. Mantenha uma estrutura lógica na resposta, separando tópicos como 'Relevância', 'Abordagem' e 'Trechos Destacados' para facilitar a compreensão. Caso necessário, exemplifique com respostas-modelo para ilustrar o formato esperado. O objetivo é fornecer uma análise acadêmica precisa, organizada e útil, adaptando-se ao tipo de solicitação recebida.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.3,
            )

            resposta = response.choices[0].message.content
            print("Resposta da OpenAI recebida")

            return QueryResponse(
                answer=resposta, relevant_documents=documents_for_response
            )

        except Exception as e:
            print(f"Erro na OpenAI: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Erro ao gerar resposta: {str(e)}"
            )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro inesperado: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Erro interno no servidor: {str(e)}"
        )


if __name__ == "__main__":
    # Teste Qdrant
    print("Testando Qdrant...")
    print(qdrant_client.get_collections())

    # Teste SentenceTransformer
    print("Testando modelo...")
    print(model.encode("teste").shape)

    # Teste OpenAI
    print("Testando OpenAI...")
    print(client.models.list())

    # Iniciando Servidor
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
