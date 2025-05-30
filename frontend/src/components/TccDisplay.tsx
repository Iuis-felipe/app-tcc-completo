import React, { useState } from "react";
import { DisplayTccItem } from "../types";

interface ExpanderProps {
  title: React.ReactNode;
  children: React.ReactNode;
  themeColor?: string;
}

const Expander: React.FC<ExpanderProps> = ({ title, children, themeColor = "#20E673" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#525252] rounded-lg overflow-hidden bg-[#2c2c2c]">
      <button
        className="w-full flex justify-between items-center p-4 text-left text-gray-200 hover:bg-[#3a3a3a] focus:outline-none cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-medium ">{title}</span>
        <svg
          className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && <div className="p-4 border-t border-[#525252] bg-[#222222] text-gray-300">{children}</div>}
    </div>
  );
};

interface TccDisplayProps {
  allTccs: DisplayTccItem[];
  selectedTheme: string;
}

const TccDisplay: React.FC<TccDisplayProps> = ({ allTccs, selectedTheme }) => {
  if (!selectedTheme) {
    return null;
  }

  const filteredTccs = allTccs.filter((tcc) => tcc.theme === selectedTheme);

  return (
    <div className="p-6 bg-[#222222] border border-[#525252] rounded-lg h-fit">
      <h3 className="text-xl font-semibold mb-4 text-gray-100">
        TCCs sobre: <span className="text-[#20E673]">{selectedTheme}</span>
      </h3>
      {filteredTccs.length === 0 ? (
        <p className="text-gray-400">Nenhum TCC encontrado para este tema.</p>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
          {" "}
          {filteredTccs.map((tcc, index) => (
            <Expander key={`${tcc.title}-${index}`} title={<span className="text-gray-100">{tcc.title}</span>}>
              <p className="text-sm leading-relaxed mb-2">{tcc.summary}</p>
              <p className="text-xs text-gray-400">
                <span className="font-semibold">Tema:</span> {tcc.theme}
              </p>
            </Expander>
          ))}
        </div>
      )}
    </div>
  );
};

export default TccDisplay;
