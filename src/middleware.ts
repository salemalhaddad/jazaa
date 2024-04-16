import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseReqResClient } from "./lib/supabase/server-client";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createSupabaseReqResClient(request, response);

  let session;
  try {
    const {
      data: { session: sessionData },
    } = await supabase.auth.getSession();
    session = sessionData;
  } catch (error) {
    console.error("Error getting session:", error);
    // Handle error appropriately
  }

  const user = session?.user;

  // protects the "/account" route and its sub-routes
  if (!user && request.nextUrl.pathname.startsWith("/account")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/", "/account/:path*"],
};
