import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import ListingsPage from "@/pages/ListingsPage";
import ListingDetailPage from "@/pages/ListingDetailPage";
import FavoritesPage from "@/pages/FavoritesPage";
import HowItWorksPage from "@/pages/HowItWorksPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import RoleSelectionPage from "@/pages/RoleSelectionPage";
import OwnerDashboard from "@/pages/OwnerDashboard";
import OwnerProfilePage from "@/pages/OwnerProfilePage";
import AddListingPageNew from "@/pages/AddListingPageNew";

function App() {
  return (
    <div className="App min-h-screen flex flex-col">
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              
              {/* Protected Routes */}
              <Route
                path="/select-role"
                element={
                  <ProtectedRoute>
                    <RoleSelectionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/listing/:id"
                element={
                  <ProtectedRoute>
                    <ListingDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Owner Only Routes */}
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute requireRole="OWNER">
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/profile"
                element={
                  <ProtectedRoute requireRole="OWNER">
                    <OwnerProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/add-listing"
                element={
                  <ProtectedRoute requireRole="OWNER">
                    <AddListingPageNew />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
