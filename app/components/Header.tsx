"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";
import { navigation } from "@/lib/site-config";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const header = headerRef.current;
    if (!header) return;
    const focusable = [...header.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]")].filter((element) => !element.hasAttribute("hidden"));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const firstNavLink = header.querySelector<HTMLElement>("#main-navigation a");
    firstNavLink?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="header-inner">
        <BrandMark />
        <button ref={menuButtonRef} className="menu-button" type="button" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen((value) => !value)}>
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
