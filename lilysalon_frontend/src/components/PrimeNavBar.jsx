import React from "react";
import { Menubar } from "primereact/menubar";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import "./PrimeNavBar.css";

export default function PrimeNavBar() {  // Renamed to PrimeNavBar
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const itemRenderer = (item) => (
        <Link to={item.url} className="menu-item-link">
            <span className={item.icon} />
            <span className="menu-item-label">{item.label}</span>
            {item.badge && <Badge className="menu-item-badge" value={item.badge} />}
            {item.shortcut && (
                <span className="menu-item-shortcut">{item.shortcut}</span>
            )}
        </Link>
    );

    const items = [
        { label: "Home", icon: "pi pi-home", url: "/" },
        { label: "Customers", icon: "pi pi-users", url: "/customers" },
        { label: "Appointments", icon: "pi pi-calendar", url: "/appointments" },
        { label: "Services", icon: "pi pi-wrench", url: "/services" },
        ...(user?.role === "manager"
            ? [{ label: "Manager", icon: "pi pi-user", url: "/manager" }]
            : []),
    ];

    const start = (
        <img
            alt="logo"
            src="src/assets/logo.webp"
            height="60"
        />
    );

    const end = (
        <div className="menu-end">
            {user ? (
                <>
                    <Avatar
                        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                        shape="circle"
                    />
                    <span className="user-name">{user.username}</span>
                    <Button
                        label="Logout"
                        icon="pi pi-sign-out"
                        className="p-button-text p-button-danger"
                        onClick={handleLogout}
                    />
                </>
            ) : (
                <Button
                    label="Login"
                    icon="pi pi-sign-in"
                    className="p-button-text p-button-success"
                    onClick={() => navigate("/login")}
                />
            )}
        </div>
    );

    return (
        <div className="menu-container">
            <Menubar
                model={items}
                start={start}
                end={end}
                itemTemplate={itemRenderer}
            />
        </div>
    );
}