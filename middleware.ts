import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const isPublicPage = request.nextUrl.pathname === '/'
  
  // Проверяем только главную страницу
  if (isPublicPage) {
    try {
      // Проверяем авторизацию через API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });
      
      // Если пользователь авторизован (статус 200)
      if (response.ok) {
        // Редиректим на /clients (так как все пользователи - тренера)
        return NextResponse.redirect(new URL('/clients', request.url))
      }
    } catch (error) {
      // Если ошибка сети или API недоступен - показываем главную страницу
      console.log('Backend недоступен, показываем главную страницу:', error);
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/']
} 