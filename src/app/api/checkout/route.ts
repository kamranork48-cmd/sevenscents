import { NextResponse } from "next/server";
import { fragrances } from "@/lib/catalog";

type CheckoutBody = {
  customer?: Record<string, unknown>;
  items?: Array<{ id: string; ml: number; quantity: number }>;
};

export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ message: "The checkout details were not valid." }, { status: 400 });
  }

  const customer = body.customer;
  const items = body.items;
  const requiredFields = ["name", "phone", "city", "address"];
  const hasCustomerDetails = customer && requiredFields.every((field) => typeof customer[field] === "string" && String(customer[field]).trim());
  const hasItems = Array.isArray(items) && items.length > 0 && items.every((item) => {
    if (typeof item.id !== "string" || ![30, 50, 100].includes(item.ml) || !Number.isInteger(item.quantity) || item.quantity < 1) return false;
    const product = fragrances.find((fragrance) => fragrance.id === item.id);
    const variant = product?.sizes.find((size) => size.ml === item.ml);
    return Boolean(variant && variant.inventory >= item.quantity);
  });

  if (!hasCustomerDetails || !hasItems) {
    return NextResponse.json({ message: "Add valid delivery details and at least one fragrance." }, { status: 400 });
  }

  if (process.env.MEDUSA_BACKEND_URL) {
    return NextResponse.json({ message: "The Medusa COD order adapter is not configured for this deployment yet." }, { status: 503 });
  }

  return NextResponse.json({ reference: `PREVIEW-${Date.now().toString(36).toUpperCase()}`, preview: true });
}