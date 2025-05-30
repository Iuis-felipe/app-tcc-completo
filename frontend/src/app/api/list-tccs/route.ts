// src/app/api/list-tccs/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // O caminho para a pasta 'public/data' no servidor.
    // process.cwd() retorna o diretório raiz do seu projeto Next.js.
    const dataDirectory = path.join(process.cwd(), 'public', 'data');

    // Lê os nomes de todos os arquivos e pastas dentro de 'public/data'
    const allEntries = fs.readdirSync(dataDirectory);

    // Filtra para manter apenas os arquivos que terminam com .json
    const jsonFiles = allEntries.filter(entry =>
      entry.endsWith('.json') && fs.statSync(path.join(dataDirectory, entry)).isFile()
    );

    // Retorna a lista de nomes de arquivos JSON
    return NextResponse.json({ tccFiles: jsonFiles });

  } catch (error: any) { // Especificar 'any' ou um tipo mais específico para o erro
    console.error('Erro ao listar arquivos TCC na API Route:', error);
    // Retorna uma resposta de erro com status 500 (Internal Server Error)
    return NextResponse.json(
      { error: 'Falha ao listar arquivos TCC no servidor.', details: error.message },
      { status: 500 }
    );
  }
}