import { NextResponse } from "next/server";
import { getMarketIntelligence } from "@/lib/market/dataProvider";

// Revalidate this endpoint every 30 seconds
export const revalidate = 30;

export async function GET() {
  try {
    const data = await getMarketIntelligence();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Market] Error fetching market data:", error);
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}
