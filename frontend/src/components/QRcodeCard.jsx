import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeCard({ town, url }) {
 return (
   <section style={styles.card}>
     <div style={styles.header}>
       <h1 style={styles.title}>Código QR</h1>
       <p style={styles.subtitle}>Escaneá para ingresar al sitio turístico</p>
     </div>

     <div style={styles.qrBox}>
       <QRCodeCanvas value={url} size={220} includeMargin />
     </div>

     <div style={styles.info}>
       <h2 style={styles.townName}>{town?.name || "Pueblo turístico"}</h2>
       <p style={styles.description}>
         Este código QR dirige al visitante a la pantalla de autenticación del pueblo seleccionado.
       </p>
       <span style={styles.url}>{url}</span>
     </div>
   </section>
 );
}

const styles = {
 card: {
   width: "100%",
   maxWidth: "460px",
   backgroundColor: "#fff",
   borderRadius: "18px",
   boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
   padding: "28px",
   textAlign: "center",
 },
 header: {
   marginBottom: "22px",
 },
 title: {
   margin: 0,
   color: "#12345b",
   fontSize: "2rem",
   fontWeight: "800",
 },
 subtitle: {
   margin: "8px 0 0",
   color: "#667085",
   fontSize: "0.95rem",
 },
 qrBox: {
   display: "flex",
   justifyContent: "center",
   padding: "18px",
   borderRadius: "16px",
   backgroundColor: "#f4f7fb",
   marginBottom: "22px",
 },
 info: {
   display: "flex",
   flexDirection: "column",
   gap: "10px",
 },
 townName: {
   margin: 0,
   color: "#1a4a8a",
   fontSize: "1.35rem",
   fontWeight: "700",
 },
 description: {
   margin: 0,
   color: "#555",
   lineHeight: 1.5,
   fontSize: "0.95rem",
 },
 url: {
   display: "block",
   wordBreak: "break-all",
   color: "#1a4a8a",
   fontSize: "0.8rem",
   backgroundColor: "#eef4ff",
   padding: "10px",
   borderRadius: "10px",
 },
};
