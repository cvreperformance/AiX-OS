import { NextRequest, NextResponse } from "next/server";
import { ApplicationRegistry } from "@/services/aix-intelligence/connector/application-registry";
import { ConnectorAuth } from "@/services/aix-intelligence/connector/connector-auth";

export const runtime = "nodejs";

function getCorsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-aix-api-key, x-aix-timestamp, x-aix-nonce, x-aix-signature",
  };
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders(request.headers.get("origin")) });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  try {
    const { searchParams } = new URL(request.url);
    const application = searchParams.get("application") || "";
    const apiKey = request.headers.get("x-aix-api-key") || searchParams.get("apiKey") || "";
    const timestamp = request.headers.get("x-aix-timestamp") || "";
    const nonce = request.headers.get("x-aix-nonce") || "";
    const signature = request.headers.get("x-aix-signature") || "";

    if (!application) {
      return NextResponse.json({ success: false, error: "Missing application parameter" }, { status: 400, headers: corsHeaders });
    }

    // Authenticate if headers are present
    if (apiKey && timestamp && nonce && signature) {
      const authResult = ConnectorAuth.validateRequest(application, apiKey, timestamp, nonce, signature);
      if (!authResult.valid) {
        return NextResponse.json({ success: false, error: authResult.error }, { status: 401, headers: corsHeaders });
      }
    }

    const appContract = ApplicationRegistry.getApp(application);
    if (!appContract) {
      return NextResponse.json({ success: false, error: "Application is not registered" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json(
      {
        success: true,
        application_id: appContract.application_id,
        status: appContract.status,
        version: appContract.version,
        config: appContract.feature_flags,
      },
      { headers: corsHeaders }
    );
  } catch (e) {
    return NextResponse.json({ success: false, error: "Internal configuration failure" }, { status: 500, headers: corsHeaders });
  }
}
