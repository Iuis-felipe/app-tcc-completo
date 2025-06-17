"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isSemanticSearch = pathname === "/busca-semantica";
  const isGraphPage = pathname === "/grafico";
  const isYearAnalysis = pathname === "/analise-anual";
  const isMostOrientadores = pathname === "/orientadores";
  const isTendencias = pathname === "/tendencias";
  const isProporcao = pathname === "/proporcao";

  return (
    <header className="mb-8">
      <div className="mb-6">
        <Image src="/images/logo-ufsc.svg" alt="Logo UFSC" width={120} height={40} className="object-contain" />
      </div>

      <nav className="relative">
        <div className="flex space-x-10">
          <Link
            href="/busca-semantica"
            className={`pb-2 relative transition-colors duration-200 ${
              isSemanticSearch ? "text-[#20E673] font-medium" : "text-white hover:text-[#20E673]"
            }`}
          >
            Busca Semântica
            {isSemanticSearch && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#20E673]"></div>}
          </Link>

          <Link
            href="/grafico"
            className={`pb-2 relative transition-colors duration-200 ${
              isGraphPage ? "text-[#20E673] font-medium" : "text-white hover:text-[#20E673]"
            }`}
          >
            Mapa de Temas TCCs
            {isGraphPage && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#20E673]"></div>}
          </Link>

          <Link
            href="/analise-anual"
            className={`pb-2 relative transition-colors duration-200 ${
              isYearAnalysis ? "text-[#20E673] font-medium" : "text-white hover:text-[#20E673]"
            }`}
          >
            TCCs por ano
            {isYearAnalysis && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#20E673]"></div>}
          </Link>

          <Link
            href="/orientadores"
            className={`pb-2 relative transition-colors duration-200 ${
              isMostOrientadores ? "text-[#20E673] font-medium" : "text-white hover:text-[#20E673]"
            }`}
          >
            Top 10 Orientadores
            {isMostOrientadores && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#20E673]"></div>}
          </Link>

          <Link
            href="/tendencias"
            className={`pb-2 relative transition-colors duration-200 ${
              isTendencias ? "text-[#20E673] font-medium" : "text-white hover:text-[#20E673]"
            }`}
          >
            Evolução dos Temas
            {isTendencias && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#20E673]"></div>}
          </Link>

          <Link
            href="/proporcao"
            className={`pb-2 relative transition-colors duration-200 ${
              isProporcao ? "text-[#20E673] font-medium" : "text-white hover:text-[#20E673]"
            }`}
          >
            Proporção dos Temas
            {isProporcao && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#20E673]"></div>}
          </Link>
        </div>

        <div className="h-[1px] bg-[#20E673] mb-6"></div>
      </nav>
    </header>
  );
}
