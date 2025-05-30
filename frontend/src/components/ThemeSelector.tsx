import React from "react";
import { ThemeFrequency } from "../types";

interface ThemeSelectorProps {
  themes: ThemeFrequency[];
  onSelectTheme: (theme: string) => void;
  selectedTheme: string | null;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ themes, onSelectTheme, selectedTheme }) => {
  if (!themes || themes.length === 0) {
    return null;
  }

  return (
    <div className="p-6 bg-[#222222] border border-[#525252] rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-100">Temas Mais Frequentes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {themes.map((themeItem) => (
          <button
            key={themeItem.tema}
            className={`
              p-4 rounded-lg border transition-all duration-150 ease-in-out 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#222222] cursor-pointer
              ${
                themeItem.tema === selectedTheme
                  ? "bg-[#20E673] border-[#20E673] text-[#222222] shadow-lg transform scale-105"
                  : "bg-[#2c2c2c] border-[#525252] text-gray-300 hover:bg-[#3a3a3a] hover:border-[#6a6a6a]"
              }
            `}
            onClick={() => onSelectTheme(themeItem.tema)}
            title={`Clique para ver ${themeItem.frequencia} TCCs sobre ${themeItem.tema}`}
          >
            <strong className="block font-medium text-sm sm:text-base">{themeItem.tema}</strong>
            <span
              className={`block text-xs sm:text-sm mt-1 ${
                themeItem.tema === selectedTheme ? "text-[#1E293B]" : "text-gray-400"
              }`}
            >
              ({themeItem.frequencia} TCCs)
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
