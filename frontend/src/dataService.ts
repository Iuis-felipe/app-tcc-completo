// src/dataService.ts - VERSÃO COMPLETA E ATUALIZADA

import { RawTccData, ProcessedTccItem, DisplayTccItem, ThemeFrequency } from "./types";
// MUDANÇA 1: Garantir que a função de normalização de temas seja importada do seu arquivo de utilitários.
import { normalizeTheme } from "./utils/tccUtils";

const DATA_PATH_PREFIX = "/data/";

/**
 * Carrega todos os dados dos TCCs, aplicando a normalização de temas durante o processo.
 */
export async function loadAllTccData(): Promise<{
  allProcessedTccs: ProcessedTccItem[];
  allDisplayTccs: DisplayTccItem[];
  themeFrequencies: ThemeFrequency[];
}> {
  const allProcessedTccs: ProcessedTccItem[] = [];

  try {
    const listApiResponse = await fetch("/api/list-tccs");
    if (!listApiResponse.ok) {
      const errorData = await listApiResponse.json().catch(() => ({}));
      throw new Error(
        `Falha ao buscar lista de arquivos TCC da API: ${listApiResponse.statusText} - ${errorData.details || ""}`
      );
    }

    const { tccFiles, error: apiError } = await listApiResponse.json();

    if (apiError) {
      throw new Error(`Erro retornado pela API ao listar TCCs: ${apiError}`);
    }

    if (!tccFiles || !Array.isArray(tccFiles) || tccFiles.length === 0) {
      console.warn("Nenhum arquivo TCC retornado pela API.");
      return { allProcessedTccs: [], allDisplayTccs: [], themeFrequencies: [] };
    }

    for (const fileName of tccFiles) {
      if (typeof fileName !== "string") {
        console.warn(`Nome de arquivo inválido recebido da API: ${fileName}`);
        continue;
      }
      const response = await fetch(`${DATA_PATH_PREFIX}${fileName}`);
      if (!response.ok) {
        console.warn(`Falha ao carregar o arquivo ${fileName}: ${response.statusText}`);
        continue;
      }
      const data: RawTccData = await response.json();

      // --- INÍCIO DA LÓGICA DE NORMALIZAÇÃO DE TEMAS ---
      // MUDANÇA 2: Processamos as palavras-chave usando a nova função `normalizeTheme`.
      const keywordsRaw = data["Palavras-chave"];

      // Garante que temos um array para trabalhar, mesmo que a entrada seja uma string ou nula.
      const keywordsAsArray = Array.isArray(keywordsRaw) ? keywordsRaw : (keywordsRaw || "").split(",");

      // Aplica a normalização para cada tema, remove os que ficaram vazios e remove duplicatas no mesmo TCC.
      const normalizedThemes = keywordsAsArray
        .map((kw) => normalizeTheme(kw))
        .filter(Boolean) // Remove strings vazias, caso a normalização resulte nisso.
        .filter((theme, index, self) => self.indexOf(theme) === index); // Garante temas únicos por TCC.

      // --- FIM DA LÓGICA DE NORMALIZAÇÃO ---

      const processedItem: ProcessedTccItem = {
        id: fileName,
        title: data["Título"] || "Sem título",
        author: data["Orientador(a)"] || "Não informado", // Futuramente, podemos aplicar normalizeAuthorName aqui também!
        year: data["Ano de publicação"] || "N/A",
        summary: data["Resumo"] || "Sem resumo",
        // MUDANÇA 3: Usamos os temas já limpos e normalizados.
        keywords: normalizedThemes,
        themes: normalizedThemes,
      };

      allProcessedTccs.push(processedItem);
    }

    // A partir daqui, o resto do código já funciona com os dados limpos, sem precisar de alterações.
    // A contagem de frequência será naturalmente agrupada pelos temas normalizados.

    const allDisplayTccs: DisplayTccItem[] = allProcessedTccs.flatMap((tcc) =>
      tcc.themes.map((theme) => ({
        theme: theme,
        title: tcc.title,
        summary: tcc.summary,
      }))
    );

    const themeCounts: Record<string, number> = {};
    allDisplayTccs.forEach((tcc) => {
      themeCounts[tcc.theme] = (themeCounts[tcc.theme] || 0) + 1;
    });

    const themeFrequencies: ThemeFrequency[] = Object.entries(themeCounts)
      .map(([tema, frequencia]) => ({ tema, frequencia }))
      .sort((a, b) => b.frequencia - a.frequencia);

    return { allProcessedTccs, allDisplayTccs, themeFrequencies };
  } catch (error) {
    console.error("Erro geral ao carregar dados dos TCCs no dataService:", error);
    return { allProcessedTccs: [], allDisplayTccs: [], themeFrequencies: [] };
  }
}
