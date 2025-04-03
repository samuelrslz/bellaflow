import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AppointmentsPage from "./pages/AppointmentsPage";
import CustomersPage from "./pages/CustomersPage";
import ServicesPage from "./pages/ServicesPage";
import LoginPage from "./pages/LoginPage";
import ManagerPage from "./pages/ManagerPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PrimeNavBar from "./components/PrimeNavBar";
import Footer from "./components/Footer";
import { Navbar } from "react-bootstrap";

const App = () => {
    return (
        <Router>
            <PrimeNavBar/>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/appointments"
                    element={
                        <ProtectedRoute>
                            <AppointmentsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/customers"
                    element={
                        <ProtectedRoute>
                            <CustomersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/services"
                    element={
                        <ProtectedRoute>
                            <ServicesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager"
                    element={
                        <ProtectedRoute>
                            <ManagerPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;