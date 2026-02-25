"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchInventory, type ProductType } from "@/lib/api";
import { ProductCard, ProductCardSkeleton } from "@/components/inventory";
import { useDebounce } from "@/lib/useDebounce";
import {
  Search,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

type SortOptionType = "default" | "price-asc" | "price-desc";

const SKELETON_COUNT = 8;

const Dashboard = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortOptionType>("default");
  // const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    let cancelled = false;
    fetchInventory()
      .then((data) => {
        if (!cancelled) {
          setProducts(data.products ?? []);
          setTotalCount(data.total ?? null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load inventory"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredAndSorted = useMemo(() => {
    let list = products;
    const q = debouncedSearchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    if (sort === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, debouncedSearchQuery, sort]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchInventory()
      .then((data) => {
        setProducts(data.products ?? []);
        setTotalCount(data.total ?? null);
      })
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Failed to load inventory"
        )
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6">
      <header className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Carlux Inventory
          </h1>
          <p className="text-xs sm:text-sm text-white/70 mt-1 sm:mt-2">
            View and filter the current vehicle inventory
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70 mt-1 sm:mt-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 sm:px-3 sm:py-1">
            <span className="text-white font-semibold text-sm">
              {filteredAndSorted.length}
            </span>
            <span>shown</span>
          </span>
          {typeof totalCount === "number" && (
            <span className="text-[11px] sm:text-sm text-white/50">
              of {totalCount} vehicles
            </span>
          )}
        </div>
      </header>

      <div className="flex flex-row items-stretch gap-2 mb-5">
        <div className="relative flex-1 min-w-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-t-black/70 border border-white/10 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-t-green/50 focus:border-t-green"
            aria-label="Search vehicles by title"
          />
        </div>
        {/* Filter control: icon-only on small screens, full select on sm+ */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-t-black/70 border border-white/10 text-white hover:border-t-green hover:text-t-green transition-colors sm:hidden"
            aria-label="Filter vehicles"
          >
            <SlidersHorizontal className="w-5 h-5" aria-hidden />
          </button>
          <div className="relative hidden sm:block w-52">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOptionType)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg bg-t-black/70 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-t-green/50 focus:border-t-green"
              aria-label="Sort by price"
            >
              <option value="default">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none"
              aria-hidden
            />
          </div>
        </div>
      </div>

      {loading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          aria-busy="true"
          aria-label="Loading inventory"
        >
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && !loading && (
        <div
          className="rounded-xl bg-red-500/10 border border-red-500/30 p-6 flex flex-col items-center justify-center gap-4 text-center"
          role="alert"
        >
          <AlertCircle
            className="w-12 h-12 text-red-400 shrink-0"
            aria-hidden
          />
          <div>
            <p className="text-white font-medium">
              Could not load inventory
            </p>
            <p className="text-white/70 text-sm mt-1">{error}</p>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-t-green text-t-black font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-t-green/50 focus:ring-offset-2 focus:ring-offset-background"
          >
            <RefreshCw className="w-4 h-4" aria-hidden />
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {filteredAndSorted.length === 0 ? (
            <p className="text-white/70 py-8 text-center" role="status">
              {searchQuery.trim()
                ? "No vehicles match your search."
                : "No vehicles in inventory."}
            </p>
          ) : (
            <ul
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 list-none p-0 m-0"
              aria-label="Vehicle inventory"
            >
              {filteredAndSorted.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
