import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const ADMIN_USER = "e7d9f30c08ff75b134bd6f6d54a22d25e6ceb5ddaa2f1a42721f279665d4c34a";

/* password: 123456 */
const ADMIN_HASH =
  "6a13f0c7a3ba956bab2bcd38138002f12cd0e5b94a19e3467c1e41b884425765"; // example hash (we generate below)

async function sha256(text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const hashed1 = await sha256(username);
    const hashed2 = await sha256(password);
    console.log(hashed1);
    console.log(hashed2);

    if (hashed1 === ADMIN_USER && hashed2 === ADMIN_HASH) {
      localStorage.setItem("username",username);
      localStorage.setItem("password",password);
      navigate("/admin");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-wrapper">

      <form className="login-card" onSubmit={handleLogin}>
        <h2>🔐 Admin Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>

      {error && <div className="error">{error}</div>}
    </div>
  );
}




