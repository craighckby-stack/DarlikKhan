import { NextResponse } from "next/server";

/**
 * A simple API route that returns a JSON response.
 * This route demonstrates basic Next.js API functionality.
 */
export async function GET() {
  try {
    const response = {
      message: "Hello, world!",
      timestamp: new Date().toISOString(),
      status: "success"
    };
    
    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error("Error in API route:", error);
    
    return NextResponse.json(
      { 
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        status: "error"
      },
      { status: 500 }
    );
  }
}