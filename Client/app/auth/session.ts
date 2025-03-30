'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const cookie = {
    name: 'session',
    options: {httpOnly: true, secure: true, sameSite: 'lax' as const, path:'/'},
    duration: 1 * 60 * 60 * 1000, // 1hr 
}

export async function createSession(token : string){
    const expires = new Date(Date.now() + cookie.duration);
    //used after user login or signup 
    (await cookies()).set(cookie.name,token,{...cookie.options, expires})
    
    redirect('/dashboard')
}

export async function verifySession() {
    const token = (await cookies()).get("session")?.value;
  
    try {
      const response = await fetch(`${BACKEND_URL}/auth/verify-token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
  
      if (!response.ok) {
        return null; // ✅ Don't redirect — let middleware handle it
      }
  
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("❌ verifySession error:", error);
      return null; // ✅ Just return null on failure
    }
  }

export async function deleteSession() {
    (await cookies()).delete(cookie.name)
    redirect('/login')
}