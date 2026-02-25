const INVENTORY_API = "https://dummyjson.com/products/category/vehicle";

export interface ProductType {
  id: number;
  title: string;
  description?: string;
  category?: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  tags?: string[];
  brand?: string;
  availabilityStatus?: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponseType {
  products: ProductType[];
  total: number;
  skip?: number;
  limit?: number;
}

export async function fetchInventory(): Promise<ProductsResponseType> {
  const res = await fetch(INVENTORY_API);
  if (!res.ok) {
    throw new Error(`Failed to load inventory (${res.status})`);
  }
  const data: ProductsResponseType = await res.json();
  return data;
}
