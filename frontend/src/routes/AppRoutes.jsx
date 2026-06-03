import { Navigate, Route, Routes } from "react-router-dom";
import TownLoginPage from "../pages/TownLoginPage";
import PlacesPage from "../pages/PlacesPage";
import ErrorPage from "../pages/ErrorPage";
import QrPage from "../pages/QrPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
 return (
   <Routes>
     <Route path="/" element={<Navigate to="/p/playas-del-coco" replace />} />
     <Route path="/p/:townSlug" element={<TownLoginPage />} />
     <Route path="/qr/:townSlug" element={<QrPage />} />
     <Route
       path="/places/:townSlug"
       element={
         <ProtectedRoute>
           <PlacesPage />
         </ProtectedRoute>
       }
     />
     <Route path="/error" element={<ErrorPage />} />
     <Route path="*" element={<ErrorPage />} />
   </Routes>
 );
}
