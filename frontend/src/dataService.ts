// src/dataService.ts
import { RawTccData, DisplayTccItem, ThemeFrequency } from './types'; // Verifique se o caminho para types.ts está correto

const DATA_PATH_PREFIX = '/data/'; // Caminho base dentro da 'public' para os arquivos individuais

/**
 * Normaliza as palavras-chave, transformando-as em uma lista de strings.
 * Trata tanto listas de strings quanto strings separadas por vírgula.
 */
function normalizeKeywords(keywords: string[] | string | undefined): string[] {
  if (!keywords) {
    return [];
  }
  if (Array.isArray(keywords)) {
    return keywords.map(kw => kw.trim()).filter(kw => kw.length > 0);
  }
  return keywords.split(',').map(kw => kw.trim()).filter(kw => kw.length > 0);
}

/**
 * Carrega todos os dados dos TCCs.
 * Primeiro, busca a lista de arquivos da API /api/list-tccs,
 * depois carrega e processa cada arquivo TCC.
 */
export async function loadAllTccData(): Promise<{
  allDisplayTccs: DisplayTccItem[];
  themeFrequencies: ThemeFrequency[];
}> {
  const allDisplayTccs: DisplayTccItem[] = [];

  try {
    // 1. Buscar a lista de nomes de arquivos da nossa API Route
    const listApiResponse = await fetch('/api/list-tccs'); // Caminho para a API Route
    if (!listApiResponse.ok) {
      const errorData = await listApiResponse.json().catch(() => ({})); // Tenta pegar detalhes do erro da API
      throw new Error(
        `Falha ao buscar lista de arquivos TCC da API: ${listApiResponse.statusText} - ${errorData.details || ''}`
      );
    }

    const { tccFiles, error: apiError } = await listApiResponse.json();

    if (apiError) {
      throw new Error(`Erro retornado pela API ao listar TCCs: ${apiError}`);
    }

    if (!tccFiles || !Array.isArray(tccFiles) || tccFiles.length === 0) {
      console.warn("Nenhum arquivo TCC retornado pela API ou a lista está vazia/inválida.");
      return { allDisplayTccs: [], themeFrequencies: [] };
    }

    // 2. Carregar cada arquivo TCC listado pela API
    for (const fileName of tccFiles) {
      if (typeof fileName !== 'string') { // Verificação extra de tipo
        console.warn(`Nome de arquivo inválido recebido da API: ${fileName}`);
        continue;
      }
      const response = await fetch(`${DATA_PATH_PREFIX}${fileName}`); // Ex: /data/tcc1.json
      if (!response.ok) {
        console.warn(`Falha ao carregar o arquivo ${fileName}: ${response.statusText}`);
        continue; // Pula para o próximo arquivo em caso de falha ao carregar um TCC específico
      }
      const data: RawTccData = await response.json();

      const title = data['Título'] || "Sem título";
      const summary = data['Resumo'] || "Sem resumo";
      const keywordsRaw = data['Palavras-chave'];

      const themes = normalizeKeywords(keywordsRaw);

      for (const theme of themes) {
        allDisplayTccs.push({
          theme: theme,
          title: title,
          summary: summary,
        });
      }
    }

    // 3. Calcular frequência dos temas
    const themeCounts: Record<string, number> = {};
    allDisplayTccs.forEach(tcc => {
      themeCounts[tcc.theme] = (themeCounts[tcc.theme] || 0) + 1;
    });

    const themeFrequencies: ThemeFrequency[] = Object.entries(themeCounts)
      .map(([tema, frequencia]) => ({ tema, frequencia }))
      .sort((a, b) => b.frequencia - a.frequencia);

    return { allDisplayTccs, themeFrequencies };

  } catch (error) {
    console.error("Erro geral ao carregar dados dos TCCs no dataService:", error);
    // Em um cenário de produção, você poderia logar este erro para um serviço de monitoramento
    return { allDisplayTccs: [], themeFrequencies: [] }; // Retorna vazio em caso de erro grave
  }
}