'use server'
 
import { cookies } from 'next/headers'
 
async function SetCookies(value: string, expires: number) {
  cookies().set({
    name: 'authToken',
    value,
    path: '/',
    secure: true,
    expires
  })
}

export default SetCookies