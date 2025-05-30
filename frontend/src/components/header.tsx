"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isSemanticSearch = pathname === "/busca-semantica";
  const isGraphPage = pathname === "/grafico";

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
            Gráfico
            {isGraphPage && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#20E673]"></div>}
          </Link>
        </div>

        <div className="h-[1px] bg-[#20E673] mb-6"></div>
      </nav>
    </header>
  );
}
