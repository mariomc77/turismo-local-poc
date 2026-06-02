import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function GoogleLoginButton({ onSuccess }) {
  const { login } = useAuth();
  const [error, setError] = useState("");

  async function handleSuccess(credentialResponse) {
    try {
      setError("");

      if (!credentialResponse.credential) {
        setError("No se recibió el token de Google.");
        return;
      }

      await login(credentialResponse.credential);

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setError("No se pudo iniciar sesión con Google.");
    }
  }

  return (
    <div style={styles.container}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => setError("Error al conectar con Google.")}
        useOneTap={false}
      />

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  error: {
    color: "#c0392b",
    fontSize: "0.85rem",
    margin: 0,
  },
};