import React, { useState, useEffect, useRef } from "react";
import api from "../api/api.js"; // Import your axios instance
import { Container, Form, Button, Table, Alert, Modal } from "react-bootstrap"; // Import Bootstrap components
import Footer from "../components/Footer";

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]); // State to store the list of customers
    const [successMessage, setSuccessMessage] = useState(""); // State for success messages
    const [newCustomer, setNewCustomer] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
    }); // State for creating a new customer
    const [editingCustomer, setEditingCustomer] = useState(null); // State for editing a customer
    const [error, setError] = useState(""); // State for error messages
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [showHistoryModal, setShowHistoryModal] = useState(false); // State to control the history modal
    const [selectedCustomer, setSelectedCustomer] = useState(null); // State for the selected customer
    const [appointmentHistory, setAppointmentHistory] = useState([]); // State for the appointment history
    const [showForm, setShowForm] = useState(false); // State to toggle the form visibility
    const formRef = useRef(null); // Ref to scroll to the form

    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data from localStorage

    // Fetch all customers from the backend
    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await api.get("customers/"); // Fetch customers from the backend
            setCustomers(response.data); // Update state with the fetched customers
        } catch (error) {
            console.error("Error fetching customers:", error);
            setError("Failed to fetch customers. Please try again later.");
        }
    };

    // Handle input change for creating/editing a customer
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingCustomer) {
            setEditingCustomer({ ...editingCustomer, [name]: value });
        } else {
            setNewCustomer({ ...newCustomer, [name]: value });
        }
    };

    // Handle search input change
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter customers based on search query
    const filteredCustomers = customers.filter((customer) => {
        const query = searchQuery.toLowerCase();
        return (
            customer.first_name.toLowerCase().includes(query) ||
            customer.last_name.toLowerCase().includes(query) ||
            customer.phone_number.toLowerCase().includes(query) ||
            customer.email.toLowerCase().includes(query)
        );
    });

    // Create a new customer
    const handleCreateCustomer = async (e) => {
        e.preventDefault();
        try {
            await api.post("customers/", newCustomer); // Send POST request to create a new customer
            setNewCustomer({ first_name: "", last_name: "", phone_number: "", email: "" }); // Reset form
            fetchCustomers(); // Refresh the list of customers
            setError(""); // Clear any previous errors
            setSuccessMessage("Customer created successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error creating customer:", error);
            setError("Failed to create customer. Please check your input and try again.");
        }
    };

    // Update an existing customer
    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        try {
            await api.put(`customers/${editingCustomer.id}/`, editingCustomer); // Send PUT request to update the customer
            setEditingCustomer(null); // Reset editing state
            fetchCustomers(); // Refresh the list of customers
            setError(""); // Clear any previous errors
            setSuccessMessage("Customer updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error updating customer:", error);
            setError("Failed to update customer. Please check your input and try again.");
        }
    };

    // Handle delete confirmation
    const handleDeleteCustomer = async (id) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                await api.delete(`customers/${id}/`); // Send DELETE request to delete the customer
                fetchCustomers(); // Refresh the list of customers
                setError(""); // Clear any previous errors
            } catch (error) {
                console.error("Error deleting customer:", error);
                setError("Failed to delete customer. Please try again.");
            }
        }
    };

    // Set the customer to be edited, show the form, and scroll to it
    const handleEditCustomer = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true); // Ensure the form is visible
        scrollToTop(); // Scroll to the form
    };

    // Smooth scroll to the form
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Fetch appointment history for a customer
    const fetchAppointmentHistory = async (customerId) => {
        try {
            const response = await api.get(`appointments/customer/${customerId}/`); // Updated endpoint to fetch appointments for a specific customer
            setAppointmentHistory(response.data); // Update state with the fetched appointments
        } catch (error) {
            console.error("Error fetching appointment history:", error);
            setError("Failed to fetch appointment history. Please try again later.");
        }
    };

    // Handle showing the history modal
    const handleShowHistory = (customer) => {
        setSelectedCustomer(customer);
        fetchAppointmentHistory(customer.id);
        setShowHistoryModal(true);
    };

    return (
        <Container className="my-4">
            <h1 className="mb-4">Customers</h1>

            {/* Success message */}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            {/* Error message */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Button to toggle the form */}
            <Button
                variant="primary" // Changed color to blue
                className="mb-4"
                onClick={() => {
                    setShowForm(!showForm);
                    if (!showForm) {
                        setEditingCustomer(null); // Reset editing state when opening the form
                        scrollToForm();
                    }
                }}
            >
                {showForm ? "Hide Form" : "Add Customer"}
            </Button>

            {/* Form for creating/editing a customer */}
            {showForm && (
                <Form
                    ref={formRef}
                    onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}
                    className="mb-4"
                >
                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="first_name"
                            placeholder="Enter first name"
                            value={editingCustomer ? editingCustomer.first_name : newCustomer.first_name}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="last_name"
                            placeholder="Enter last name"
                            value={editingCustomer ? editingCustomer.last_name : newCustomer.last_name}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone_number"
                            placeholder="Enter phone number"
                            value={editingCustomer ? editingCustomer.phone_number : newCustomer.phone_number}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={editingCustomer ? editingCustomer.email : newCustomer.email}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="me-2">
                        {editingCustomer ? "Update Customer" : "Create Customer"}
                    </Button>
                    {editingCustomer && (
                        <Button variant="secondary" onClick={() => setEditingCustomer(null)}>
                            Cancel Edit
                        </Button>
                    )}
                </Form>
            )}

            <hr />

            {/* Search bar */}
            <Form.Group className="mb-4">
                <Form.Control
                    type="text"
                    placeholder="Search by First Name, Last Name, Phone Number, or Email"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
            </Form.Group>

            {/* List of customers */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.first_name}</td>
                            <td>{customer.last_name}</td>
                            <td>{customer.phone_number}</td>
                            <td>{customer.email}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    onClick={() => handleEditCustomer(customer)} // Ensure single-click functionality
                                    className="me-2"
                                >
                                    Edit
                                </Button>
                                
                                <Button
                                    variant="info"
                                    onClick={() => handleShowHistory(customer)}
                                    className="me-2" // Add spacing to match "Edit" button
                                >
                                    History
                                </Button>

                                {user?.role === "manager" && ( // Conditionally render the Delete button
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteCustomer(customer.id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* History Modal */}
            <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Appointment History for {selectedCustomer?.first_name} {selectedCustomer?.last_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Total Price</th>
                                <th>Employee</th>
                                <th>Services</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointmentHistory.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td>{appointment.appointment_date}</td>
                                    <td>{appointment.appointment_time}</td>
                                    <td>{appointment.status}</td>
                                    <td>${appointment.total_price}</td>
                                    <td>{appointment.employee_assigned}</td>
                                    <td>
                                        {appointment.services_details.map((service) => (
                                            <div key={service.id}>{service.service_name}</div>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CustomersPage;