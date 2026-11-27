"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useSession } from "@/app/components/session-provider";

// Sesión simulada: no hay validación de usuario ni de contraseña.
// La contraseña no se guarda en ningún lado.
export function AuthForm() {
  const router = useRouter();
  const { signIn, signOut } = useSession();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn(user);
    router.push("/");
  };

  const onGuest = () => {
    signOut();
    router.push("/");
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="auth-user">Usuario</label>
          <input
            id="auth-user"
            name="user"
            autoComplete="username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="px_kai"
          />
        </div>
        <div className="field">
          <label htmlFor="auth-pass">Contraseña</label>
          <input
            id="auth-pass"
            name="password"
            type="password"
            autoComplete="current-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button className="btn lg" type="submit" style={{ width: "100%", marginTop: 8 }}>
          ENTRAR AL VAULT
        </button>
      </form>

      <button
        type="button"
        className="btn ghost"
        style={{ width: "100%", marginTop: 10 }}
        onClick={onGuest}
      >
        JUGAR COMO INVITADO
      </button>
    </>
  );
}
