"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/pipeline", label: "Pipeline", labelCs: "Pipeline" },
  { href: "/catalog", label: "Katalog skillů", labelCs: "Katalog skillů" },
  { href: "/settings", label: "Nastavení", labelCs: "Nastavení" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center gap-8">
          <span className="text-lg font-bold text-white">Zamba Skills</span>
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const isActive = pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  {tab.labelCs}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
