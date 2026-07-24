"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "./BrandMark";
import { navigation } from "@/lib/site-config";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="header-inner">
        <BrandMark />
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen((value) => !value)}>
          <span aria-hidden="true">{open ? "×" : "≡"}</span><span className="sr-only">{open ? "Close" : "Open"} menu</span>
        </button>
        <nav id="main-navigation" aria-label="Primary" className={open ? "main-nav is-open" : "main-nav"}>
          {navigation.map((item) => <Link key={item.href} onClick={() => setOpen(false)} className={pathname === item.href ? "active" : ""} href={item.href}>{item.label}</Link>)}
          <Link href="/stock" onClick={() => setOpen(false)} className="button button-small">View stock <span aria-hidden="true">↗</span></Link>
        </nav>
      </div>
    </header>
  );
}
