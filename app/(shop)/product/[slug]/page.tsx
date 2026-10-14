import ProductDetailsClient from "./ProductDetailsClient";
import { products } from "@/data/product";

export const dynamicParams = false;

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export async function generateStaticParams() {
  const slugSet = new Set<string>();

  // Add default catalog items
  products.forEach((p) => {
    if (p.name) slugSet.add(generateSlug(p.name));
  });

  // Attempt to add backend products if live
  try {
    const res = await fetch("http://194.164.72.181:5000/api/products", {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        data.forEach((p: any) => {
          if (p.name) slugSet.add(generateSlug(p.name));
        });
      }
    }
  } catch {
    // Fall back safely to catalog items if offline
  }

  return Array.from(slugSet).map((slug) => ({ slug }));
}

export default function ProductPage() {
  return <ProductDetailsClient />;
}