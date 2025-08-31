import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/transactions"];

export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtected = PROTECTED_PREFIXES.some(p => path.startsWith(p));
    if (!isProtected) return NextResponse.next();

    const hasSession = req.cookies.get("session");
    if (!hasSession) {
        const url = new URL("/login", req.url);
        url.searchParams.set("next", path);
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

export const config = {
    matcher: PROTECTED_PREFIXES.map(p => `${p}/:path*`),
};
