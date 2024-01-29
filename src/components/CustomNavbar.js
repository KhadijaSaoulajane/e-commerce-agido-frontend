import React, { useContext } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import {LoginContext} from "../context/LoginContext";
import {useLogout} from "../hooks/useLogout";


function CustomNavbar({title}) {
    const { user } = useContext(LoginContext);
    const { logout } = useLogout();

    const handleLogout = () => {
        logout();
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container className="justify-content-between">
                <Navbar.Brand href="#home">{title}</Navbar.Brand>
                {user && (
                    <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                )}
            </Container>
        </Navbar>
    );
}
export default CustomNavbar;

