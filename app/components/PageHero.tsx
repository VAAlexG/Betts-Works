import Link from "next/link";

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <section className="page-hero"><div className="shell"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>{title}</span></nav><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div></section>;
}
