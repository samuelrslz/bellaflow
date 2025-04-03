import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js"; // Import your axios instance
import { Container, Form, Button, Alert } from "react-bootstrap"; // Import Bootstrap components
import Footer from "../components/Footer";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/login/", { username, password }); // Send login request to Django
            const { token, user } = response.data;

            // Store token and user data in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // Redirect based on user role
            if (user.role === "manager") {
                navigate("/"); 
            } else {
                navigate("/"); // Redirect to staff home page
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Invalid username or password. Please try again.");
        }
    };

    return (
        <Container className="my-4">
            <h1 className="mb-4">Login</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button type="submit" variant="primary">
                    Login
                </Button>
            </Form>
        </Container>
    );
};

export default LoginPage;