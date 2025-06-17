import { ProcessedTccItem, ThemeFrequency  } from "../types"; // Importe seu tipo

//TCCS POR ANO
export interface TccCountByYear {
  ano: string;
  quantidade: number;
}

export function countTccsByYear(tccs: ProcessedTccItem[]): TccCountByYear[] {
  if (!tccs || tccs.length === 0) {
    return [];
  }

  const yearCounts = tccs.reduce((acc, tcc) => {
    const year = tcc.year.toString();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(yearCounts)
    .map(([ano, quantidade]) => ({
      ano,
      quantidade,
    }))
    .sort((a, b) => parseInt(a.ano) - parseInt(b.ano));
}

// NORMALIZA O NOME DOS ORIENTADORES
export function normalizeAuthorName(name: string): string {
  if (!name || typeof name !== "string") {
    return "";
  }

  let normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  normalized = normalized.replace(/[^a-z0-9\s]/g, "");

  const titleWords = [
    "professor",
    "professora",
    "prof",
    "profa",
    "doutor",
    "doutora",
    "dr",
    "dra",
    "mestre",
    "mestra",
    "ms",
    "msc",
    "phd",
    "esp",
  ];

  const titleWordsRegex = new RegExp(`\\b(${titleWords.join("|")})\\b`, "g");

  normalized = normalized.replace(titleWordsRegex, "");
  return normalized.replace(/\s+/g, " ").trim();
}

// FUNÇÃO DE CONTAGEM POR AUTOR (Usa a normalização acima)
export interface CountByAuthor {
  name: string;
  total: number;
}

export function countTccsByAuthor(tccs: ProcessedTccItem[]): CountByAuthor[] {
  const authorCounts = tccs.reduce((acc, tcc) => {
    if (tcc.author) {
      const normalizedName = normalizeAuthorName(tcc.author);

      if (normalizedName) {
        if (!acc[normalizedName]) {
          // Guarda o primeiro nome original encontrado para exibição no gráfico
          acc[normalizedName] = { originalName: tcc.author, count: 0 };
        }
        acc[normalizedName].count++;
      }
    }
    return acc;
  }, {} as Record<string, { originalName: string; count: number }>);

  // Mapeia o resultado para o formato que o gráfico espera
  return Object.values(authorCounts)
    .map((data) => ({ name: getInitials(data.originalName), total: data.count })) // MUDANÇA AQUI
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
}

function getInitials(fullName: string): string {
  if (!fullName) {
    return "N/I"; // Retorna 'Não Identificado' se o nome for vazio
  }

  const wordsToIgnore = ["da", "de", "do", "dos", "das"];

  const initials = fullName
    .split(" ") // 1. Divide o nome em palavras: ["Juarez", "Bento", "da", "Silva"]
    .filter((word) => !wordsToIgnore.includes(word.toLowerCase())) // 2. Remove as palavras de ligação
    .map((word) => word.charAt(0)) // 3. Pega a primeira letra de cada palavra restante: ["J", "B", "S"]
    .join(""); // 4. Junta as letras: "JBS"

  return initials.toUpperCase();
}

// NORMALIZA OS TEMAS DE TCC
export function normalizeTheme(theme: string): string {
  if (!theme || typeof theme !== "string") {
    return "";
  }

  // 1. Limpeza inicial: minúsculas, remove acentos e espaços nas pontas.
  let normalized = theme
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // 2. Remove toda a pontuação.
  normalized = normalized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

  // 3. Heurística simples para agrupar plurais: se a palavra terminar com 's', remove o 's'.
  // Isso agrupa 'tecnologias' com 'tecnologia', e 'redes' com 'rede'.
  // Não é perfeito para todos os casos da língua portuguesa, mas resolve a maioria dos problemas comuns.
  if (normalized.endsWith("s")) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

// ================== FUNÇÕES NOVAS PARA A PÁGINA DE TENDÊNCIAS ==================
export function getThemesSortedByFrequency(tccs: ProcessedTccItem[]): ThemeFrequency[] {
  const themeCounts: Record<string, number> = {};

  tccs.forEach((tcc) => {
    tcc.themes.forEach((theme) => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });
  });

  const themesArray: ThemeFrequency[] = Object.entries(themeCounts).map(([key, value]) => ({
    theme: key,
    tema: key,
    count: value,
    frequencia: value,
  }));

  themesArray.sort((a, b) => b.count - a.count);

  return themesArray;
}

export function trackThemeTrends(tccs: ProcessedTccItem[], themesToTrack: string[]): any[] {
  const yearlyData: Record<string, any> = {};

  tccs.forEach((tcc) => {
    const year = tcc.year.toString();
    if (!isNaN(parseInt(year))) {
      if (!yearlyData[year]) {
        yearlyData[year] = { year };
        themesToTrack.forEach((theme) => {
          yearlyData[year][theme] = 0;
        });
      }

      themesToTrack.forEach((theme) => {
        if (tcc.themes.includes(theme)) {
          yearlyData[year][theme]++;
        }
      });
    }
  });

  return Object.values(yearlyData).sort((a, b) => parseInt(a.year) - parseInt(b.year));
}






export function getTopThemesProportion(themeFrequencies: ThemeFrequency[], topN: number = 7): { name: string; value: number }[] {
  if (themeFrequencies.length === 0) {
    return [];
  }

  // 1. Separa os 'Top N' temas.
  const topThemes = themeFrequencies.slice(0, topN);

  // 2. Pega o restante dos temas.
  const otherThemes = themeFrequencies.slice(topN);

  // 3. Soma a frequência de todos os outros temas.
  const otherThemesCount = otherThemes.reduce((acc, theme) => acc + theme.count, 0);

  // 4. Formata os dados para o gráfico (Recharts espera 'name' e 'value').
  const chartData = topThemes.map(tf => ({
    name: tf.theme,
    value: tf.count,
  }));

  // 5. Se houver outros temas, adiciona a categoria "Outros" ao final.
  if (otherThemesCount > 0) {
    chartData.push({ name: 'Outros', value: otherThemesCount });
  }

  return chartData;
}
