import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const AppointmentSearchBar = ({
    searchQuery,
    handleSearchInputChange,
    startDate,
    handleStartDateChange,
    endDate,
    handleEndDateChange,
    statusFilter,
    handleStatusFilterChange,
}) => {

return <Form className="mb-4">
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Search by Customer or Employee</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Search by Customer or Employee"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={handleStartDateChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={endDate}
                                onChange={handleEndDateChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                            >
                                <option value="">All Statuses</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="canceled">Canceled</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
}

export default AppointmentSearchBar;