import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTownBySlug } from "../api/townApi";
import Navbar from "../components/Navbar";
import QRCodeCard from "../components/QRCodeCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function QrPage() {
 const { townSlug } = useParams();
 const navigate = useNavigate();

 const [town, setTown] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 const qrUrl = `${window.location.origin}/p/${townSlug}`;

 useEffect(() => {
   async function loadTown() {
     try {
       const data = await getTownBySlug(townSlug);
       setTown(data);
     } catch {
       setError("No se pudo generar el QR porque el pueblo no existe o el backend no responde.");
     } finally {
       setLoading(false);
     }
   }

   loadTown();
 }, [townSlug]);

 if (loading) return <LoadingSpinner />;

 if (error) {
   return (
     <>
       <Navbar />
       <ErrorMessage message={error} />
     </>
   );
 }

 return (
   <>
     <Navbar />

     <main style={styles.page}>
       <QRCodeCard town={town} url={qrUrl} />

       <div style={styles.actions}>
         <button style={styles.primaryButton} onClick={() => navigate(`/p/${townSlug}`)}>
           Probar QR
         </button>

         <button style={styles.secondaryButton} onClick={() => window.print()}>
           Imprimir
         </button>
       </div>
     </main>
   </>
 );
}

const styles = {
 page: {
   minHeight: "calc(100vh - 56px)",
   backgroundColor: "#eef3f8",
   display: "flex",
   flexDirection: "column",
   alignItems: "center",
   justifyContent: "center",
   padding: "40px 20px",
   gap: "22px",
 },
 actions: {
   display: "flex",
   gap: "12px",
   flexWrap: "wrap",
   justifyContent: "center",
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
};
