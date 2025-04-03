import React, { useEffect, useState } from "react";
import { Container, Table, Alert } from "react-bootstrap";
import api from "../api/api.js";
import Footer from "../components/Footer";

const ManagerPage = () => {
    const [serviceReports, setServiceReports] = useState([]);
    const [currentMonthAppointments, setCurrentMonthAppointments] = useState(0);
    const [previousMonthAppointments, setPreviousMonthAppointments] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchServiceReports();
        fetchMonthlyAppointments();
    }, []);

    const fetchServiceReports = async () => {
        try {
            const response = await api.get("services/"); // Fetch services
            const services = response.data;

            const appointmentResponse = await api.get("appointments/"); // Fetch appointments
            const appointments = appointmentResponse.data;

            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

            const endOfPreviousMonth = new Date(previousMonthYear, previousMonth + 1, 0); // Last day of the previous month

            // Calculate service frequency
            const serviceFrequency = {};
            const serviceFrequencyCurrentMonth = {};
            const serviceFrequencyPreviousMonth = {};

            appointments.forEach((appointment) => {
                const appointmentDate = new Date(appointment.appointment_date);
                const appointmentMonth = appointmentDate.getMonth();
                const appointmentYear = appointmentDate.getFullYear();

                appointment.services_details.forEach((service) => {
                    serviceFrequency[service.id] = (serviceFrequency[service.id] || 0) + 1;

                    if (
                        appointmentMonth === currentMonth &&
                        appointmentYear === currentYear &&
                        appointmentDate <= today // Only include up to the current day
                    ) {
                        serviceFrequencyCurrentMonth[service.id] =
                            (serviceFrequencyCurrentMonth[service.id] || 0) + 1;
                    }

                    if (
                        appointmentMonth === previousMonth &&
                        appointmentYear === previousMonthYear &&
                        appointmentDate <= endOfPreviousMonth // Only include up to the last day of the previous month
                    ) {
                        serviceFrequencyPreviousMonth[service.id] =
                            (serviceFrequencyPreviousMonth[service.id] || 0) + 1;
                    }
                });
            });

            // Map service frequency to service details
            const report = services.map((service) => ({
                service_name: service.service_name,
                frequency: serviceFrequency[service.id] || 0,
                frequencyCurrentMonth: serviceFrequencyCurrentMonth[service.id] || 0,
                frequencyPreviousMonth: serviceFrequencyPreviousMonth[service.id] || 0,
            }));

            // Sort by frequency (descending)
            report.sort((a, b) => b.frequency - a.frequency);

            setServiceReports(report);
        } catch (error) {
            console.error("Error fetching service reports:", error);
            setError("Failed to fetch service reports. Please try again later.");
        }
    };

    const fetchMonthlyAppointments = async () => {
        try {
            const response = await api.get("appointments/"); // Fetch appointments
            const appointments = response.data;

            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

            const endOfPreviousMonth = new Date(previousMonthYear, previousMonth + 1, 0); // Last day of the previous month

            const currentMonthCount = appointments.filter((appointment) => {
                const appointmentDate = new Date(appointment.appointment_date);
                return (
                    appointmentDate.getMonth() === currentMonth &&
                    appointmentDate.getFullYear() === currentYear &&
                    appointmentDate <= today // Only include up to the current day
                );
            }).length;

            const previousMonthCount = appointments.filter((appointment) => {
                const appointmentDate = new Date(appointment.appointment_date);
                return (
                    appointmentDate.getMonth() === previousMonth &&
                    appointmentDate.getFullYear() === previousMonthYear &&
                    appointmentDate <= endOfPreviousMonth // Only include up to the last day of the previous month
                );
            }).length;

            setCurrentMonthAppointments(currentMonthCount);
            setPreviousMonthAppointments(previousMonthCount);
        } catch (error) {
            console.error("Error fetching monthly appointments:", error);
            setError("Failed to fetch monthly appointments. Please try again later.");
        }
    };

    const getMonthName = (monthIndex) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ];
        return monthNames[monthIndex];
    };

    const today = new Date();
    const currentMonthName = getMonthName(today.getMonth());
    const previousMonthName = getMonthName(today.getMonth() === 0 ? 11 : today.getMonth() - 1);
    const previousMonthYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();

    return (
        <Container className="my-4">
            <h1 className="mb-4">Manager Dashboard</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <h2>Salon Performance</h2>
            <p>Total Appointments This Month ({currentMonthName}): <strong>{currentMonthAppointments}</strong></p>
            <p>Total Appointments Last Month ({previousMonthName} {previousMonthYear}): <strong>{previousMonthAppointments}</strong></p>

            <h2>Most Frequently Booked Services</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Service Name</th>
                        <th>Times Booked (All Time)</th>
                        <th>Times Booked ({currentMonthName})</th>
                        <th>Times Booked ({previousMonthName} {previousMonthYear})</th>
                    </tr>
                </thead>
                <tbody>
                    {serviceReports.map((report, index) => (
                        <tr key={index}>
                            <td>{report.service_name}</td>
                            <td>{report.frequency}</td>
                            <td>{report.frequencyCurrentMonth}</td>
                            <td>{report.frequencyPreviousMonth}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ManagerPage;
