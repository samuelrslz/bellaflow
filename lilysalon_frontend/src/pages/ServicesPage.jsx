import React, { useState, useEffect } from "react";
import api from "../api/api.js"; // Import your axios instance
import { Container, Form, Button, Table, Alert } from "react-bootstrap"; // Import Bootstrap components
import Footer from "../components/Footer";

const ServicesPage = () => {
    const [successMessage, setSuccessMessage] = useState(""); // State for success messages
    const [services, setServices] = useState([]); // State to store the list of services
    const [newService, setNewService] = useState({
        service_name: "",
        description: "",
        price: "",
        duration: "",
    }); // State for creating a new service
    const [editingService, setEditingService] = useState(null); // State for editing a service
    const [error, setError] = useState(""); // State for error messages
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data from localStorage

    // Fetch all services from the backend
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await api.get("services/"); // Fetch services from the backend
            setServices(response.data); // Update state with the fetched services
        } catch (error) {
            console.error("Error fetching services:", error);
            setError("Failed to fetch services. Please try again later.");
        }
    };

    // Handle input change for creating/editing a service
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingService) {
            setEditingService({ ...editingService, [name]: value });
        } else {
            setNewService({ ...newService, [name]: value });
        }
    };

    // Create a new service
    const handleCreateService = async (e) => {
        e.preventDefault();
        try {
            await api.post("services/", newService); // Send POST request to create a new service
            setNewService({ service_name: "", description: "", price: "", duration: "" }); // Reset form
            fetchServices(); // Refresh the list of services
            setError(""); // Clear any previous errors
            setSuccessMessage("Service created successfully!"); // Set success message
            setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
        } catch (error) {
            console.error("Error creating service:", error);
            setError("Failed to create service. Please check your input and try again.");
        }
    };

    // Update an existing service
    const handleUpdateService = async (e) => {
        e.preventDefault();
        try {
            await api.put(`services/${editingService.id}/`, editingService); // Send PUT request to update the service
            setEditingService(null); // Reset editing state
            fetchServices(); // Refresh the list of services
            setError(""); // Clear any previous errors
            setSuccessMessage("Service updated successfully!"); // Set success message
            setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
        } catch (error) {
            console.error("Error updating service:", error);
            setError("Failed to update service. Please check your input and try again.");
        }
    };

    // Delete a service
    const handleDeleteService = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this service?");
        if (!confirmDelete) return;

        try {
            await api.delete(`services/${id}/`); // Send DELETE request to delete the service
            fetchServices(); // Refresh the list of services
            setError(""); // Clear any previous errors
        } catch (error) {
            console.error("Error deleting service:", error);
            setError("Failed to delete service. Please try again.");
        }
    };

    // Set the service to be edited
    const handleEditService = (service) => {
        setEditingService(service);
        scrollToTop(); // Scroll to the top of the page
    };

    // Scroll to the top of the page
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Container className="my-4">
            <h1 className="mb-4">Services</h1>

             {/* Success message */}
             {successMessage && <Alert variant="success">{successMessage}</Alert>}

            {/* Error message */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Form for creating/editing a service */}
            <Form onSubmit={editingService ? handleUpdateService : handleCreateService} className="mb-4">
                <Form.Group className="mb-3">
                    <Form.Label>Service Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="service_name"
                        placeholder="Enter service name"
                        value={editingService ? editingService.service_name : newService.service_name}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        placeholder="Enter description"
                        value={editingService ? editingService.description : newService.description}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        name="price"
                        placeholder="Enter price"
                        value={editingService ? editingService.price : newService.price}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Duration (minutes)</Form.Label>
                    <Form.Control
                        type="number"
                        name="duration"
                        placeholder="Enter duration"
                        value={editingService ? editingService.duration : newService.duration}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Button type="submit" variant="primary" className="me-2">
                    {editingService ? "Update Service" : "Create Service"}
                </Button>
                {editingService && (
                    <Button variant="secondary" onClick={() => setEditingService(null)}>
                        Cancel Edit
                    </Button>
                )}
            </Form>

            {/* List of services */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Service Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Duration (minutes)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((service) => (
                        <tr key={service.id}>
                            <td>{service.service_name}</td>
                            <td>{service.description}</td>
                            <td>${service.price}</td>
                            <td>{service.duration}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    onClick={() => handleEditService(service)}
                                    className="me-2"
                                >
                                    Edit
                                </Button>
                                {user?.role === "manager" && ( // Conditionally render the Delete button
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteService(service.id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ServicesPage;