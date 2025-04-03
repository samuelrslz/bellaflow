import React, { useEffect, useState } from "react";
import api from "../api/api";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("customers/"); // Use the correct endpoint
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div>
      <h1>Customers</h1>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.first_name} {customer.last_name} - {customer.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Customers;
