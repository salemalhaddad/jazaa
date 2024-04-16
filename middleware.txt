import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	// Get the pathname of the request
	const { pathname } = request.nextUrl;

	// Check if the request is for login or register pages
	// if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
	//   // If it's a request to login or register, continue without redirecting
	//   return NextResponse.next();
	// }

	// Get the session cookie
	const session = request.cookies.get("session");

	// If there is no session, redirect to login page
	if (!session) {
	  return NextResponse.redirect(new URL("/signup", request.url));
	}

	// If there is a session, call the authentication endpoint
	const responseAPI = await fetch(`${request.nextUrl.origin}/api/signup`, {
	  headers: {
		Cookie: `session=${session}`,
	  },
	});

	// If the token is not authorized, redirect to login page
	if (responseAPI.status !== 200) {
	  return NextResponse.redirect(new URL("/signin", request.url));
	}

	// If the token is authorized, continue to the requested page
	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/signin/:path*', '/signup/:path*'],
}
