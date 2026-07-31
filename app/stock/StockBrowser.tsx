"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { VehicleWithMedia } from "@/lib/data";
import { PriceFootnote } from "@/app/components/PriceFootnote";
import { VehicleCard } from "@/app/components/VehicleCard";

type Filters = {
  q: string;
  modelTrim: string;
  make: string;
  year: string;
  body: string;
  fuel: string;
  transmission: string;
  availability: string;
  minPrice: string;
  maxPrice: string;
  includeSold: string;
  sort: string;
};

const emptyFilters: Filters = {
  q: "",
  modelTrim: "",
  make: "",
  year: "",
  body: "",
  fuel: "",
  transmission: "",
  availability: "",
  minPrice: "",
  maxPrice: "",
  includeSold: "",
  sort: "newest",
};

export function StockBrowser({ vehicles }: { vehicles: VehicleWithMedia[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(() => ({
    ...emptyFilters,
    ...Object.fromEntries(Object.keys(emptyFilters).map((key) => [key, params.get(key) || emptyFilters[key as keyof Filters]])),
  }));

  const options = (key: keyof VehicleWithMedia) => [...new Set(vehicles.map((vehicle) => String(vehicle[key] || "")).filter(Boolean))].sort();
  const makeOptions = options("make");
  const bodyOptions = options("bodyType");
  const fuelOptions = options("fuelType");
  const transmissionOptions = options("transmission");
  const yearOptions = options("year").reverse();
  const modelTrimOptions = [...new Map(vehicles.map((vehicle) => {
    const value = `${vehicle.model}\u001f${vehicle.variant}`;
    return [value, `${vehicle.model}${vehicle.variant ? ` — ${vehicle.variant}` : ""}`];
  })).entries()].sort((a, b) => a[1].localeCompare(b[1]));

  const filtered = useMemo(() => {
    const query = filters.q.toLowerCase();
    const minimum = filters.minPrice ? Number(filters.minPrice) * 100 : null;
    const maximum = filters.maxPrice ? Number(filters.maxPrice) * 100 : null;
    return vehicles
      .filter((vehicle) => {
        const modelTrim = `${vehicle.model}\u001f${vehicle.variant}`;
        if (!filters.includeSold && vehicle.availabilityStatus === "sold") return false;
        if (query && !`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant} ${vehicle.stockNumber}`.toLowerCase().includes(query)) return false;
        if (filters.modelTrim && modelTrim !== filters.modelTrim) return false;
        if (filters.make && vehicle.make !== filters.make) return false;
        if (filters.year && String(vehicle.year) !== filters.year) return false;
        if (filters.body && vehicle.bodyType !== filters.body) return false;
        if (filters.fuel && vehicle.fuelType !== filters.fuel) return false;
        if (filters.transmission && vehicle.transmission !== filters.transmission) return false;
        if (filters.availability && vehicle.availabilityStatus !== filters.availability) return false;
        if (minimum !== null && (vehicle.priceCents === null || vehicle.priceCents < minimum)) return false;
        if (maximum !== null && (vehicle.priceCents === null || vehicle.priceCents > maximum)) return false;
        return true;
      })
      .sort((a, b) => filters.sort === "price-asc"
        ? (a.priceCents ?? Number.MAX_SAFE_INTEGER) - (b.priceCents ?? Number.MAX_SAFE_INTEGER)
        : filters.sort === "price-desc"
          ? (b.priceCents ?? -1) - (a.priceCents ?? -1)
          : filters.sort === "year"
            ? b.year - a.year
            : b.createdAt.localeCompare(a.createdAt));
  }, [filters, vehicles]);

  function applyFilters(next: Filters) {
    setFilters(next);
    const search = new URLSearchParams();
    Object.entries(next).forEach(([filterKey, filterValue]) => {
      if (filterValue && !(filterKey === "sort" && filterValue === "newest")) search.set(filterKey, filterValue);
    });
    router.replace(`/stock${search.size ? `?${search}` : ""}`, { scroll: false });
  }

  function update(key: keyof Filters, value: string) {
    applyFilters({ ...filters, [key]: value });
  }

  function reset() {
    setFilters(emptyFilters);
    router.replace("/stock", { scroll: false });
  }

  const activeFilters = [
    filters.q && `Search: ${filters.q}`,
    filters.modelTrim && `Model: ${modelTrimOptions.find(([value]) => value === filters.modelTrim)?.[1]}`,
    filters.make && `Make: ${filters.make}`,
    filters.year && `Year: ${filters.year}`,
    filters.body && `Body: ${filters.body}`,
    filters.fuel && `Fuel: ${filters.fuel}`,
    filters.transmission && `Transmission: ${filters.transmission}`,
    filters.availability && `Availability: ${filters.availability.replaceAll("_", " ")}`,
    filters.minPrice && `From $${Number(filters.minPrice).toLocaleString("en-AU")}`,
    filters.maxPrice && `To $${Number(filters.maxPrice).toLocaleString("en-AU")}`,
    filters.includeSold && "Including sold",
    filters.sort !== "newest" && `Sort: ${filters.sort.replaceAll("-", " ")}`,
  ].filter(Boolean) as string[];

  return (
    <>
      <div className="filter-panel" aria-label="Filter current stock">
        <label>Search<input type="search" value={filters.q} onChange={(event) => update("q", event.target.value)} placeholder="Make, model or stock no." /></label>
        <label>Model / trim<select value={filters.modelTrim} onChange={(event) => update("modelTrim", event.target.value)}><option value="">All models</option>{modelTrimOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        {makeOptions.length > 1 && <label>Make<select value={filters.make} onChange={(event) => update("make", event.target.value)}><option value="">All makes</option>{makeOptions.map((value) => <option key={value}>{value}</option>)}</select></label>}
        <label>Year<select value={filters.year} onChange={(event) => update("year", event.target.value)}><option value="">All years</option>{yearOptions.map((value) => <option key={value}>{value}</option>)}</select></label>
        {bodyOptions.length > 1 && <label>Body<select value={filters.body} onChange={(event) => update("body", event.target.value)}><option value="">All body types</option>{bodyOptions.map((value) => <option key={value}>{value}</option>)}</select></label>}
        {fuelOptions.length > 1 && <label>Fuel<select value={filters.fuel} onChange={(event) => update("fuel", event.target.value)}><option value="">All fuel types</option>{fuelOptions.map((value) => <option key={value}>{value}</option>)}</select></label>}
        {transmissionOptions.length > 1 && <label>Transmission<select value={filters.transmission} onChange={(event) => update("transmission", event.target.value)}><option value="">All transmissions</option>{transmissionOptions.map((value) => <option key={value}>{value}</option>)}</select></label>}
        <label>Availability<select value={filters.availability} onChange={(event) => update("availability", event.target.value)}><option value="">{filters.includeSold ? "All availability" : "Available stock"}</option><option value="in_stock">In stock</option><option value="available_soon">Available soon</option><option value="under_offer">Under offer</option>{filters.includeSold && <option value="sold">Sold</option>}</select></label>
        <label>Minimum price<input type="number" min="0" step="5000" inputMode="numeric" value={filters.minPrice} onChange={(event) => update("minPrice", event.target.value)} placeholder="Any" /></label>
        <label>Maximum price<input type="number" min="0" step="5000" inputMode="numeric" value={filters.maxPrice} onChange={(event) => update("maxPrice", event.target.value)} placeholder="Any" /></label>
        <label>Sort<select value={filters.sort} onChange={(event) => update("sort", event.target.value)}><option value="newest">Newest</option><option value="price-asc">Price low to high</option><option value="price-desc">Price high to low</option><option value="year">Year</option></select></label>
        {vehicles.some((vehicle) => vehicle.availabilityStatus === "sold") && <label className="filter-toggle"><input type="checkbox" checked={Boolean(filters.includeSold)} onChange={(event) => applyFilters({ ...filters, includeSold: event.target.checked ? "1" : "", availability: !event.target.checked && filters.availability === "sold" ? "" : filters.availability })} /> Show recently sold</label>}
      </div>
      <div className="results-meta" role="status" aria-live="polite">
        <div><strong>{filtered.length} {filtered.length === 1 ? "vehicle" : "vehicles"}</strong><span>{activeFilters.length ? activeFilters.join(" · ") : "Showing available stock"}</span></div>
        {activeFilters.length > 0 && <button type="button" className="text-button" onClick={reset}>Reset filters</button>}
      </div>
      <div className="vehicle-grid">
        {filtered.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
        {!filtered.length && <div className="empty-state"><h2>No matching vehicles</h2><p className="muted">Try broadening your filters or contact Betts Works.</p><button type="button" className="button" onClick={reset}>Reset filters</button></div>}
      </div>
      {filtered.length > 0 && <PriceFootnote />}
    </>
  );
}
