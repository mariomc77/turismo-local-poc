import { useNavigate, useSearchParams } from "react-router-dom";

const ERROR_MESSAGES = {
 "not-found": {
   code: "404",
   title: "Pueblo no encontrado",
   message: "El código QR escaneado no corresponde a un pueblo registrado en el sistema.",
   hint: "Verificá que el QR sea correcto o intentá volver al inicio.",
 },
 "session-expired": {
   code: "401",
   title: "Sesión expirada",
   message: "Tu sesión venció o no se pudo validar correctamente.",
   hint: "Iniciá sesión nuevamente con tu cuenta de Google.",
 },
 "backend-offline": {
   code: "503",
   title: "Servidor no disponible",
   message: "No se pudo conectar con el backend en este momento.",
   hint: "Revisá que el backend esté corriendo en el puerto 8080.",
 },
 unauthorized: {
   code: "403",
   title: "Acceso no autorizado",
   message: "No tenés permisos para acceder a esta sección.",
   hint: "Volvé a iniciar sesión o usá una cuenta válida.",
 },
 default: {
   code: "404",
   title: "Algo salió mal",
   message: "No pudimos completar la solicitud.",
   hint: "Podés volver al inicio o intentar nuevamente.",
 },
};

export default function ErrorPage() {
 const navigate = useNavigate();
 const [searchParams] = useSearchParams();

 const reason = searchParams.get("reason") || "default";
 const error = ERROR_MESSAGES[reason] || ERROR_MESSAGES.default;

 return (
   <div style={styles.page}>
     <header style={styles.topbar}>
       <span>Turismo Local UNA</span>
     </header>

     <main style={styles.content}>
       <section style={styles.card}>
         <div style={styles.icon}>🧭</div>

         <h1 style={styles.code}>{error.code}</h1>

         <h2 style={styles.title}>{error.title}</h2>

         <p style={styles.message}>{error.message}</p>

         <div style={styles.warning}>
           <span>⚠️</span>
           <span>{error.hint}</span>
         </div>

         <div style={styles.actions}>
           <button style={styles.primaryButton} onClick={() => navigate("/p/playas-del-coco")}>
             Volver al inicio
           </button>

           <button style={styles.secondaryButton} onClick={() => window.location.reload()}>
             Reintentar
           </button>
         </div>
       </section>
     </main>

     <footer style={styles.footer}>Universidad Nacional · Programación 4</footer>
   </div>
 );
}

const styles = {
 page: {
   minHeight: "100vh",
   backgroundColor: "#eef3f8",
   display: "flex",
   flexDirection: "column",
 },
 topbar: {
   height: "56px",
   backgroundColor: "#1a4a8a",
   color: "#fff",
   display: "flex",
   alignItems: "center",
   padding: "0 28px",
   fontWeight: "700",
   fontSize: "1.1rem",
   boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
 },
 content: {
   flex: 1,
   display: "flex",
   alignItems: "center",
   justifyContent: "center",
   padding: "40px 20px",
 },
 card: {
   width: "100%",
   maxWidth: "520px",
   backgroundColor: "#fff",
   borderRadius: "18px",
   boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
   padding: "34px",
   textAlign: "center",
 },
 icon: {
   fontSize: "3.2rem",
   marginBottom: "8px",
 },
 code: {
   margin: 0,
   color: "#1a4a8a",
   fontSize: "4.5rem",
   fontWeight: "800",
   lineHeight: 1,
 },
 title: {
   margin: "12px 0 8px",
   color: "#12345b",
   fontSize: "1.7rem",
   fontWeight: "800",
 },
 message: {
   margin: 0,
   color: "#555",
   fontSize: "1rem",
   lineHeight: 1.5,
 },
 warning: {
   margin: "22px 0",
   backgroundColor: "#fff7df",
   color: "#7a5300",
   borderRadius: "10px",
   padding: "12px",
   display: "flex",
   justifyContent: "center",
   gap: "8px",
   fontSize: "0.9rem",
 },
 actions: {
   display: "flex",
   justifyContent: "center",
   gap: "12px",
   flexWrap: "wrap",
 },
 primaryButton: {
   backgroundColor: "#1a4a8a",
   color: "#fff",
   border: "none",
   borderRadius: "10px",
   padding: "10px 18px",
   cursor: "pointer",
   fontWeight: "700",
 },
 secondaryButton: {
   backgroundColor: "#fff",
   color: "#1a4a8a",
   border: "1px solid #1a4a8a",
   borderRadius: "10px",
   padding: "10px 18px",
   cursor: "pointer",
   fontWeight: "700",
 },
 footer: {
   textAlign: "center",
   padding: "18px",
   color: "#667085",
   backgroundColor: "#fff",
 },
};
