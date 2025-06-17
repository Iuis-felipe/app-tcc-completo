export interface RawTccData {
  Autor: string;
  Título: string;
  "Ano de publicação": string | number;
  "Local de publicação": string;
  "Orientador(a)": string;
  "Coorientador(a)"?: string;
  Resumo: string;
  "Palavras-chave": string[] | string;
  Conclusão: string;
  Introdução: string;
  [key: string]: any;
}

export interface ProcessedTccItem {
  id: string;
  title: string;
  summary: string;
  keywords: string[];
  themes: string[];
  author: string;
  year: string | number;
}

export interface DisplayTccItem {
  theme: string;
  title: string;
  summary: string;
}

export interface ThemeFrequency {
  theme: string;
  tema: string;
  count: number;
  frequencia: number;
}
