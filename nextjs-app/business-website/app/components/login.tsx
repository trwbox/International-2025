"use client"
import { signIn } from "next-auth/react";
export default function Login() {
  return(<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
    <button 
      onClick={() => signIn("keycloak")} 
      style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
    >
      Signin with keycloak
    </button>
  </div>)
}