import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './src/lib/session'

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = path.startsWith('/dashboard')
  const isLoginRoute = path === '/login'

  const cookie = req.cookies.get('session')?.value
  const session = await decrypt(cookie)

  // Se tentar acessar o dashboard sem estar logado, manda pro login
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Se tentar acessar a página de login já estando logado, manda pro dashboard
  if (isLoginRoute && session?.userId) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}