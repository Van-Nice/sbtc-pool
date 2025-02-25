/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: any) {
  try {
    const path = context.params?.path?.join("/") || "";
    const response = await fetch(`http://localhost:20443/v2/${path}`);

    if (!response.ok) {
      throw new Error(`Stacks API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Stacks API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, context: any) {
  try {
    const path = context.params?.path?.join("/") || "";
    const body = await request.json();

    const response = await fetch(`http://localhost:3999/v2/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Stacks API error response:", errorText);
      throw new Error(`Stacks API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Stacks API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Make sure Stacks API is running on port 3999",
      },
      { status: 500 }
    );
  }
}
