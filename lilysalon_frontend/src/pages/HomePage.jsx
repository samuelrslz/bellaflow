import React, { useEffect, useState } from "react";
import { Container, Button, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import Footer from "../components/Footer";

const HomePage = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data from localStorage

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get("appointments/");
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setError("Failed to fetch appointments. Please try again later.");
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
            // Prepare the payload
            const payload = {
                customer_id: appointment.customer.id, // Map customer to customer_id
                appointment_date: appointment.appointment_date,
                appointment_time: appointment.appointment_time,
                status: newStatus, // Toggle status
                total_price: parseFloat(appointment.total_price), // Ensure total_price is a float
                employee_assigned: appointment.employee_assigned,
                services: appointment.services_details.map((service) => service.id), // Map services_details to service IDs
            };

            console.log("Payload being sent to backend:", payload); // Debugging log
            const response = await api.put(`appointments/${appointment.id}/`, payload); // Update the appointment status
            console.log("Response from backend:", response.data); // Debugging log
            fetchAppointments(); // Refresh the list of appointments
            setError(""); // Clear any previous errors
        } catch (error) {
            console.error("Error toggling appointment status:", error);
            console.error("Error response data:", error.response?.data); // Log the error response
            setError("Failed to update appointment status. Please try again.");
        }
    };

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() - 1); // Subtract one day

    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate());

    const endOfWeek = new Date();
    endOfWeek.setDate(today.getDate() + 5);
    endOfWeek.setHours(23, 59, 59, 999);

    const todayAppointments = appointments
        .filter((appointment) => {
            const appointmentDate = new Date(appointment.appointment_date);
            return appointmentDate.toDateString() === today.toDateString();
        })
        .sort((a, b) => {
            const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
            const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
            return dateA - dateB; // Sort by date and time (ascending)
        });

    const weekAppointments = appointments
        .filter((appointment) => {
            const appointmentDate = new Date(appointment.appointment_date);
            return appointmentDate > tomorrow && appointmentDate <= endOfWeek;
        })
        .sort((a, b) => {
            const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
            const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
            return dateA - dateB; // Sort by date and time (ascending)
        });

    const handleCreateCustomer = () => {
        navigate("/customers", { state: { showForm: true } });
    };

    const handleCreateAppointment = () => {
        navigate("/appointments", { state: { showForm: true } });
    };

    return (
        <Container className="my-4 text-center">
            <h1 className="mb-4">Welcome, {user?.first_name} {user?.last_name}!</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="d-flex justify-content-center mb-4">
                <Button variant="primary" className="me-3" onClick={handleCreateCustomer}>
                    Create New Customer
                </Button>
                <Button variant="success" onClick={handleCreateAppointment}>
                    Create New Appointment
                </Button>
            </div>

            <h2>Today's Appointments</h2>
            <Table striped bordered hover className="mb-4">
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
                    {todayAppointments.map((appointment) => (
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
                                    variant={appointment.status === "completed" ? "info" : "success"} // Change color based on status
                                    onClick={() => handleToggleAppointmentStatus(appointment)}
                                >
                                    {appointment.status === "completed" ? "Mark as Scheduled" : "Mark as Completed"}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h2>Upcoming Appointments (Next 5 Days)</h2>
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
                    {weekAppointments.map((appointment) => (
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
                                    variant={appointment.status === "completed" ? "info" : "success"} // Change color based on status
                                    onClick={() => handleToggleAppointmentStatus(appointment)}
                                >
                                    {appointment.status === "completed" ? "Mark as Scheduled" : "Mark as Completed"}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default HomePage;
