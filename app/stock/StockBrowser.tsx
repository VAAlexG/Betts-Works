"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Vehicle } from "@/db/schema";
import { VehicleCard } from "@/app/components/VehicleCard";

const PAGE_SIZE = 6;

export function StockBrowser({ vehicles }: { vehicles: Vehicle[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [filters, setFilters] = useState({ q: params.get("q") || "", make: params.get("make") || "", year: params.get("year") || "", body: params.get("body") || "", fuel: params.get("fuel") || "", transmission: params.get("transmission") || "", availability: params.get("availability") || "", sort: params.get("sort") || "newest" });
  const options = (key: keyof Vehicle) => [...new Set(vehicles.map((v) => String(v[key] || "")).filter(Boolean))].sort();
  const filtered = useMemo(() => {
    const query = filters.q.toLowerCase();
    return vehicles.filter((v) => (!query || `${v.year} ${v.make} ${v.model} ${v.variant} ${v.stockNumber}`.toLowerCase().includes(query)) && (!filters.make || v.make === filters.make) && (!filters.year || String(v.year) === filters.year) && (!filters.body || v.bodyType === filters.body) && (!filters.fuel || v.fuelType === filters.fuel) && (!filters.transmission || v.transmission === filters.transmission) && (!filters.availability || v.availabilityStatus === filters.availability)).sort((a,b) => filters.sort === "price-asc" ? (a.priceCents ?? Number.MAX_SAFE_INTEGER) - (b.priceCents ?? Number.MAX_SAFE_INTEGER) : filters.sort === "price-desc" ? (b.priceCents ?? -1) - (a.priceCents ?? -1) : filters.sort === "year" ? b.year - a.year : b.createdAt.localeCompare(a.createdAt));
  }, [filters, vehicles]);
  function update(key: string, value: string) {
    const next = { ...filters, [key]: value }; setFilters(next); setLimit(PAGE_SIZE);
    const search = new URLSearchParams(); Object.entries(next).forEach(([k,v]) => { if (v && !(k === "sort" && v === "newest")) search.set(k,v); });
    router.replace(`/stock${search.size ? `?${search}` : ""}`, { scroll: false });
  }
  function reset() { const next = { q:"",make:"",year:"",body:"",fuel:"",transmission:"",availability:"",sort:"newest" }; setFilters(next); setLimit(PAGE_SIZE); router.replace("/stock", { scroll:false }); }
  return <>
    <div className="filter-panel" aria-label="Filter current stock">
      <label>Search<input type="search" value={filters.q} onChange={(e)=>update("q",e.target.value)} placeholder="Make, model or stock no." /></label>
      <label>Make<select value={filters.make} onChange={(e)=>update("make",e.target.value)}><option value="">All makes</option>{options("make").map(v=><option key={v}>{v}</option>)}</select></label>
      <label>Year<select value={filters.year} onChange={(e)=>update("year",e.target.value)}><option value="">All years</option>{options("year").reverse().map(v=><option key={v}>{v}</option>)}</select></label>
      <label>Body<select value={filters.body} onChange={(e)=>update("body",e.target.value)}><option value="">All body types</option>{options("bodyType").map(v=><option key={v}>{v}</option>)}</select></label>
      <label>Fuel<select value={filters.fuel} onChange={(e)=>update("fuel",e.target.value)}><option value="">All fuel types</option>{options("fuelType").map(v=><option key={v}>{v}</option>)}</select></label>
      <label>Transmission<select value={filters.transmission} onChange={(e)=>update("transmission",e.target.value)}><option value="">All transmissions</option>{options("transmission").map(v=><option key={v}>{v}</option>)}</select></label>
      <label>Availability<select value={filters.availability} onChange={(e)=>update("availability",e.target.value)}><option value="">Available stock</option><option value="in_stock">In stock</option><option value="available_soon">Available soon</option><option value="under_offer">Under offer</option></select></label>
      <label>Sort<select value={filters.sort} onChange={(e)=>update("sort",e.target.value)}><option value="newest">Newest</option><option value="price-asc">Price low to high</option><option value="price-desc">Price high to low</option><option value="year">Year</option></select></label>
      <button type="button" className="button button-secondary" onClick={reset}>Reset</button>
    </div>
    <div className="results-meta" role="status" aria-live="polite"><span>{filtered.length} {filtered.length === 1 ? "vehicle" : "vehicles"}</span><span>Sold vehicles excluded</span></div>
    <div className="vehicle-grid">{filtered.slice(0,limit).map(vehicle=><VehicleCard key={vehicle.id} vehicle={vehicle} />)}{!filtered.length && <div className="empty-state"><h2>No matching vehicles</h2><p className="muted">Try broadening your filters or contact Betts Works.</p><button type="button" className="button" onClick={reset}>Reset filters</button></div>}</div>
    {limit < filtered.length && <div style={{textAlign:"center",marginTop:30}}><button className="button button-secondary" type="button" onClick={()=>setLimit(limit+PAGE_SIZE)}>Load more vehicles</button></div>}
  </>;
}
