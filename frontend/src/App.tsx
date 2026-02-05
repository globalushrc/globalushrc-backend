import { Routes, Route, useLocation } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Documents from "./pages/Documents";
import GlobalCoverage from "./pages/GlobalCoverage";
import Industries from "./pages/Industries";
import AdminDashboard from "./pages/AdminDashboard";
import LegalPage from "./pages/Legal";
import BookConsultation from "./pages/BookConsultation";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import MeetingRoom from "./pages/MeetingRoom";
import WhatsAppWidget from "./components/WhatsAppWidget";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";

function App() {
  const location = useLocation();
  const isAdminPath =
    location.pathname === "/admin" ||
    location.pathname === "/login" ||
    location.pathname.startsWith("/meeting/");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/global-coverage" element={<GlobalCoverage />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-consultation" element={<BookConsultation />} />
          <Route path="/book-consultation" element={<BookConsultation />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/privacy" element={<LegalPage />} />
          <Route path="/terms" element={<LegalPage />} />
          <Route path="/disclaimer" element={<LegalPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />
          <Route
            path="/meeting/:id"
            element={
              <ProtectedRoute>
                <MeetingRoom />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <WhatsAppWidget />}
    </div>
  );
}

export default App;
