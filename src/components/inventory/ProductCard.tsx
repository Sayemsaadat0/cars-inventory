"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductType } from "@/lib/api";

// Small gray blur placeholder for Next/Image while loading (1x1 base64)
const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEA/ALej6tqEdhBGt5MFVAB8j0AB0KKKk2NtY7A2z//Z";

export interface ProductCardPropsType {
  product: ProductType;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardPropsType) => {
  const imageSrc = product.thumbnail || product.images?.[0];
  const brandLabel = product.brand ?? "—";
  const categoryLabel = product.category ?? "Vehicle";
  const ratingLabel =
    typeof product.rating === "number" ? product.rating.toFixed(1) : "N/A";
  const availability = product.availabilityStatus ?? "Available";

  return (
    <article
      className={cn(
        "bg-t-black/70 rounded-xl overflow-hidden border border-white/10",
        "hover:border-white/20 transition-colors duration-200 group",
        className
      )}
    >
      <div className="aspect-4/3 relative bg-white/5 overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${product.title} – ${brandLabel}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-white/30 text-sm"
            aria-hidden
          >
            No image
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-t-orange-light text-xs font-medium uppercase tracking-wide">
            {brandLabel}
          </p>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/20 text-white/70 uppercase tracking-wide">
            {categoryLabel}
          </span>
        </div>
        <h3 className="text-white font-semibold line-clamp-2">
          {product.title}
        </h3>
        {product.description && (
          <p className="text-white/60 text-xs line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between gap-2 pt-1">
          <p className="text-t-green text-xl font-bold tabular-nums">
            ${product.price.toLocaleString()}
          </p>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <span className="inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-t-orange-light fill-t-orange-light" />
              <span>{ratingLabel}</span>
            </span>
            {typeof product.stock === "number" && (
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/15">
                {product.stock} in stock
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 text-[11px] text-white/60">
          <span>{availability}</span>
          {product.tags && product.tags.length > 0 && (
            <span className="truncate">
              {product.tags.slice(0, 2).join(" • ")}
              {product.tags.length > 2 ? " • …" : ""}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export interface ProductCardSkeletonPropsType {
  className?: string;
}

export const ProductCardSkeleton = ({
  className,
}: ProductCardSkeletonPropsType) => (
  <div
    className={cn(
      "bg-t-black/70 rounded-xl overflow-hidden border border-white/10 animate-pulse",
      className
    )}
    aria-hidden
  >
    <div className="aspect-4/3 bg-white/10" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-white/10 rounded w-1/4" />
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-6 bg-white/10 rounded w-1/3" />
    </div>
  </div>
);

