import React, { useState, useEffect } from "react";
import api from "../api/api.js"; // Import your axios instance
import { Container, Form, Button, Table, Alert, Modal, Row, Col } from "react-bootstrap"; // Import Bootstrap components
import Select from "react-select"; // Import react-select
import AppointmentSearchBar from "../components/AppointmentsSearchBar.jsx/";
import Footer from "../components/Footer";

const AppointmentsPage = () => {
    const [successMessage, setSuccessMessage] = useState(""); // State for success messages
    const [appointments, setAppointments] = useState([]); // State to store the list of appointments
    const [customers, setCustomers] = useState([]); // State to store the list of customers
    const [services, setServices] = useState([]); // State to store the list of services
    const [newAppointment, setNewAppointment] = useState({
        customer: "",
        appointment_date: "",
        appointment_time: "",
        status: "scheduled",
        total_price: "",
        employee_assigned: "",
        services: [], // Array of selected service IDs
    }); // State for creating a new appointment
    const [editingAppointment, setEditingAppointment] = useState(null); // State for editing an appointment
    const [error, setError] = useState(""); // State for error messages
    const [showModal, setShowModal] = useState(false); // State to control the modal for selecting services
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [startDate, setStartDate] = useState(""); // State for start date filter
    const [endDate, setEndDate] = useState(""); // State for end date filter
    const [statusFilter, setStatusFilter] = useState(""); // State for status filter
    const [showPastAppointments, setShowPastAppointments] = useState(false); // State to toggle past appointments
    const [showAppointmentForm, setShowAppointmentForm] = useState(false); // State to toggle the appointment form

    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data from localStorage

    // Scroll to the top of the page
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Fetch all appointments, customers, and services from the backend
    useEffect(() => {
        fetchAppointments();
        fetchCustomers();
        fetchServices();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get("appointments/"); // Fetch appointments
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setError("Failed to fetch appointments. Please try again later.");
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await api.get("customers/"); // Fetch customers
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
            setError("Failed to fetch customers. Please try again later.");
        }
    };

    const fetchServices = async () => {
        try {
            const response = await api.get("services/"); // Fetch services
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
            setError("Failed to fetch services. Please try again later.");
        }
    };

    // Handle input change for creating/editing an appointment
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingAppointment) {
            setEditingAppointment({ ...editingAppointment, [name]: value });
        } else {
            setNewAppointment({ ...newAppointment, [name]: value });
        }
    };

    // Handle service selection for creating/editing an appointment
    const handleServiceSelection = (serviceId) => {
        const selectedServices = editingAppointment ? editingAppointment.services : newAppointment.services;
        if (selectedServices.includes(serviceId)) {
            // Remove service if already selected
            const updatedServices = selectedServices.filter((id) => id !== serviceId);
            if (editingAppointment) {
                setEditingAppointment({ ...editingAppointment, services: updatedServices });
            } else {
                setNewAppointment({ ...newAppointment, services: updatedServices });
            }
        } else {
            // Add service if not selected
            const updatedServices = [...selectedServices, serviceId];
            if (editingAppointment) {
                setEditingAppointment({ ...editingAppointment, services: updatedServices });
            } else {
                setNewAppointment({ ...newAppointment, services: updatedServices });
            }
        }
    };

    // Handle search input change
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle start date change
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    // Handle end date change
    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    // Handle status filter change
    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    // Filter appointments based on search query, date range, and status
    const filteredAppointments = appointments.filter((appointment) => {
        const query = searchQuery.toLowerCase();
        const appointmentDate = new Date(appointment.appointment_date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const matchesQuery =
            appointment.customer.first_name.toLowerCase().includes(query) ||
            appointment.customer.last_name.toLowerCase().includes(query) ||
            appointment.employee_assigned.toLowerCase().includes(query);

        const matchesDateRange =
            (!start || appointmentDate >= start) &&
            (!end || appointmentDate <= end);

        const matchesStatus = !statusFilter || appointment.status === statusFilter;

        return matchesQuery && matchesDateRange && matchesStatus;
    });

    // Filter appointments for today and future
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight
    today.setDate(today.getDate() - 1); // Subtract one day
    

    // Sort future appointments by date and time (ascending)
    const futureAppointments = filteredAppointments
        .filter((appointment) => {
            const appointmentDate = new Date(appointment.appointment_date);
            return appointmentDate >= today; // Include today and future dates
        })
        .sort((a, b) => {
            const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
            const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
            return dateA - dateB; // Ascending order
        });

    // Sort past appointments by date and time (descending)
    const pastAppointments = filteredAppointments
        .filter((appointment) => {
            const appointmentDate = new Date(appointment.appointment_date);
            return appointmentDate < today; // Only dates before today
        })
        .sort((a, b) => {
            const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
            const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
            return dateB - dateA; // Descending order
        });

    const getStatusStyle = (status) => {
        switch (status) {
            case "completed":
                return { backgroundColor: "green", color: "white", padding: "5px", borderRadius: "5px" };
            case "scheduled":
                return { backgroundColor: "#0dcaf1", color: "black", padding: "5px", borderRadius: "5px" };
            case "canceled":
                return { backgroundColor: "red", color: "white", padding: "5px", borderRadius: "5px" };
            default:
                return {};
        }
    };

    const handleToggleAppointmentStatus = async (appointment) => {
        const newStatus = appointment.status === "completed" ? "scheduled" : "completed";
        const confirmMessage =
            appointment.status === "completed"
                ? "Are you sure you want to mark this appointment as scheduled?"
                : "Are you sure you want to mark this appointment as completed?";

        const confirmToggle = window.confirm(confirmMessage);
        if (!confirmToggle) return;

        try {
            const payload = {
                customer_id: appointment.customer.id,
                appointment_date: appointment.appointment_date,
                appointment_time: appointment.appointment_time,
                status: newStatus,
                total_price: parseFloat(appointment.total_price),
                employee_assigned: appointment.employee_assigned,
                services: appointment.services_details.map((service) => service.id),
            };

            await api.put(`appointments/${appointment.id}/`, payload);
            fetchAppointments();
            setError("");
        } catch (error) {
            console.error("Error toggling appointment status:", error);
            setError("Failed to update appointment status. Please try again.");
        }
    };

    // Create a new appointment
    const handleCreateAppointment = async (e) => {
        e.preventDefault();
        try {
            // Prepare the payload
            const payload = {
                customer_id: parseInt(newAppointment.customer), // Use customer_id instead of customer
                appointment_date: newAppointment.appointment_date,
                appointment_time: newAppointment.appointment_time,
                status: newAppointment.status,
                total_price: parseFloat(newAppointment.total_price),
                employee_assigned: newAppointment.employee_assigned,
                services: newAppointment.services.map((id) => parseInt(id)),
            };

            console.log("Sending data to backend:", payload); // Log the payload
            const response = await api.post("appointments/", payload);
            console.log("Response from backend:", response.data);

            // Reset the form
            setNewAppointment({
                customer: "",
                appointment_date: "",
                appointment_time: "",
                status: "scheduled",
                total_price: "",
                employee_assigned: "",
                services: [],
            });

            // Refresh the appointments list
            fetchAppointments();
            setError("");
            setSuccessMessage("Appointment created successfully!"); // Set success message
            setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
        } catch (error) {
            console.error("Error creating appointment:", error.response ? error.response.data : error);
            setError("Failed to create appointment. Please check your input and try again.");
        }
    };

    // Update an existing appointment
    const handleUpdateAppointment = async (e) => {
        e.preventDefault();
        try {
            // Prepare the payload
            const payload = {
                ...editingAppointment,
                customer_id: parseInt(editingAppointment.customer), // Use customer_id instead of customer
                services: editingAppointment.services.map((id) => parseInt(id)), // Convert services to integers
                total_price: parseFloat(editingAppointment.total_price), // Convert total_price to float
            };

            console.log("Sending data to backend:", payload); // Log the payload
            const response = await api.put(`appointments/${editingAppointment.id}/`, payload);
            console.log("Response from backend:", response.data);

            setEditingAppointment(null); // Reset editing state
            fetchAppointments(); // Refresh the list of appointments
            setError(""); // Clear any previous errors
            setSuccessMessage("Appointment updated successfully!"); // Set success message
            setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
        } catch (error) {
            console.error("Error updating appointment:", error);
            console.error("Error response data:", error.response?.data); // Log the error response
            setError("Failed to update appointment. Please check your input and try again.");
        }
    };

    // Delete an appointment with confirmation
    const handleDeleteAppointment = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
        if (!confirmDelete) return;

        try {
            await api.delete(`appointments/${id}/`); // Send DELETE request to delete the appointment
            fetchAppointments(); // Refresh the list of appointments
            setError(""); // Clear any previous errors
        } catch (error) {
            console.error("Error deleting appointment:", error);
            setError("Failed to delete appointment. Please try again.");
        }
    };

    // Set the appointment to be edited and show the form
    const handleEditAppointment = (appointment) => {
        setEditingAppointment({
            ...appointment,
            customer: appointment.customer.id, // Set customer ID for the dropdown
            services: appointment.services_details.map(service => service.id), // Map services_details to service IDs
        });
        setShowAppointmentForm(true); // Show the form
        scrollToTop(); // Scroll to the top
    };

    // Options for react-select
    const customerOptions = customers.map((customer) => ({
        value: customer.id,
        label: `${customer.first_name} ${customer.last_name}`,
    }));

    return (
        <Container className="my-4">
            <h1 className="mb-4">Appointments</h1>

            {/* Success message */}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            {/* Error message */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Button to toggle the appointment form */}
            <Button
                variant="primary"
                className="mb-4"
                onClick={() => setShowAppointmentForm(!showAppointmentForm)}
            >
                {showAppointmentForm ? "Hide Appointment Form" : "Add New Appointment"}
            </Button>

            {/* Form for creating/editing an appointment */}
            {showAppointmentForm && (
                <Form onSubmit={editingAppointment ? handleUpdateAppointment : handleCreateAppointment} className="mb-4">
                    <Form.Group className="mb-3">
                        <Form.Label>Customer</Form.Label>
                        <Select
                            name="customer"
                            options={customerOptions}
                            value={customerOptions.find(option => option.value === (editingAppointment ? editingAppointment.customer : newAppointment.customer))} // Automatically select the customer
                            onChange={(selectedOption) => {
                                const value = selectedOption ? selectedOption.value : "";
                                if (editingAppointment) {
                                    setEditingAppointment({ ...editingAppointment, customer: value });
                                } else {
                                    setNewAppointment({ ...newAppointment, customer: value });
                                }
                            }}
                            isClearable
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Appointment Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="appointment_date"
                            value={editingAppointment ? editingAppointment.appointment_date : newAppointment.appointment_date}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Appointment Time</Form.Label>
                        <Form.Control
                            type="time"
                            name="appointment_time"
                            value={editingAppointment ? editingAppointment.appointment_time : newAppointment.appointment_time}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={editingAppointment ? editingAppointment.status : newAppointment.status}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="canceled">Canceled</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Total Price</Form.Label>
                        <Form.Control
                            type="number"
                            name="total_price"
                            placeholder="Enter total price"
                            value={editingAppointment ? editingAppointment.total_price : newAppointment.total_price}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Employee Assigned</Form.Label>
                        <Form.Control
                            type="text"
                            name="employee_assigned"
                            placeholder="Enter employee name"
                            value={editingAppointment ? editingAppointment.employee_assigned : newAppointment.employee_assigned}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Services</Form.Label>
                        <Button variant="secondary" onClick={() => setShowModal(true)}>
                            Select Services
                        </Button>
                    </Form.Group>

                    <Button type="submit" variant="primary" className="me-2">
                        {editingAppointment ? "Update Appointment" : "Create Appointment"}
                    </Button>
                    {editingAppointment && (
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setEditingAppointment(null);
                                setShowAppointmentForm(false); // Hide the form when canceling edit
                            }}
                        >
                            Cancel Edit
                        </Button>
                    )}
                </Form>
            )}

            {/* Modal for selecting services */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Services</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {services.map((service) => (
                        <Form.Check
                            key={service.id}
                            type="checkbox"
                            label={`${service.service_name} - $${service.price}`}
                            checked={
                                editingAppointment
                                    ? editingAppointment.services.includes(service.id)
                                    : newAppointment.services.includes(service.id)
                            }
                            onChange={() => handleServiceSelection(service.id)}
                        />
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <hr />

            {/* Search and filter bar */}
            <AppointmentSearchBar
                searchQuery={searchQuery}
                handleSearchInputChange={handleSearchInputChange}
                startDate={startDate}
                handleStartDateChange={handleStartDateChange}
                endDate={endDate}
                handleEndDateChange={handleEndDateChange}
                statusFilter={statusFilter}
                handleStatusFilterChange={handleStatusFilterChange}
            />

            {/* Table for future appointments */}
            <h2>Upcoming Appointments</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Total Price</th>
                        <th>Employee</th>
                        <th>Services</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {futureAppointments.map((appointment) => (
                        <tr key={appointment.id}>
                            <td>{appointment.customer.first_name} {appointment.customer.last_name}</td>
                            <td>{appointment.appointment_date}</td>
                            <td>{appointment.appointment_time}</td>
                            <td>
                                <span style={getStatusStyle(appointment.status)}>
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                            </td>
                            <td>${appointment.total_price}</td>
                            <td>{appointment.employee_assigned}</td>
                            <td>
                                {appointment.services_details.map((service) => (
                                    <div key={service.id}>{service.service_name}</div>
                                ))}
                            </td>
                            <td>
                                <Button
                                    variant={appointment.status === "completed" ? "info" : "success"}
                                    onClick={() => handleToggleAppointmentStatus(appointment)}
                                    className="me-2"
                                >
                                    {appointment.status === "completed" ? "Mark as Scheduled" : "Mark as Completed"}
                                </Button>
                                <Button
                                    variant="warning"
                                    onClick={() => handleEditAppointment(appointment)}
                                    className="me-2"
                                >
                                    Edit
                                </Button>
                                {user?.role === "manager" && (
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteAppointment(appointment.id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Button to toggle past appointments */}
            <Button
                variant="secondary"
                className="my-3"
                onClick={() => setShowPastAppointments(!showPastAppointments)}
            >
                {showPastAppointments ? "Hide Past Appointments" : "Show Past Appointments"}
            </Button>

            {/* Table for past appointments */}
            {showPastAppointments && (
                <>
                    <h2>Past Appointments</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Total Price</th>
                                <th>Employee</th>
                                <th>Services</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastAppointments.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td>{appointment.customer.first_name} {appointment.customer.last_name}</td>
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
                                    <td>
                                        <Button
                                            variant="warning"
                                            onClick={() => handleEditAppointment(appointment)}
                                            className="me-2"
                                        >
                                            Edit
                                        </Button>
                                        {user?.role === "manager" && ( // Conditionally render the Delete button
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteAppointment(appointment.id)}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
        </Container>
    );
};

export default AppointmentsPage;