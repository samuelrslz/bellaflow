import React from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer style={{ textAlign: "center", padding: "1rem", background: "#f8f9fa", marginTop: "2rem" }}>
            <p>BellaFlow</p>
            <p>&copy; {currentYear} Samuel Rios-Lazo</p>
        </footer>
    );
};

export default Footer;
