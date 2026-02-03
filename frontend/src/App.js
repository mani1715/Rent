import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
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
import OwnerInboxPage from "@/pages/OwnerInboxPage";

function App() {
  return (
    <div className="App min-h-screen flex flex-col">
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes - Only Login/Register */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                
                {/* Protected Routes - Require Login */}
                <Route
                  path="/listings"
                  element={
                    <ProtectedRoute>
                      <ListingsPage />
                    </ProtectedRoute>
                  }
                />
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
                <Route
                  path="/owner/inbox"
                  element={
                    <ProtectedRoute requireRole="OWNER">
                      <OwnerInboxPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
