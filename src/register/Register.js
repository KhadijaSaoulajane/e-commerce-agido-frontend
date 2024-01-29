import React, { useState } from 'react';
import ApiService from "../services/ApiService";
import {useCustomNavigate} from "../hooks/useNavigate";
import { Button, Form, Alert, Row, Col } from 'react-bootstrap';

function Register() {
  const [register, setRegister] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const goTo = useCustomNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRegister(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (register.password === "" || register.email=== "" || register.password !== register.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    ApiService.register({ email: register.email, password: register.password,role:'customer' })
        .then((response) => {
          goTo('/login');
        })
        .catch((error) => {
          setError("An error occurred, please try again!");
        });
  };

  return (
      <Row className="login-container">
        <Col  className="mx-auto col-9">
        <Form onSubmit={handleSubmit}>
          <h3 className="text-center">Register</h3>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={register.email}
                onChange={handleChange}
                required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={register.password}
                onChange={handleChange}
                required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={register.confirmPassword}
                onChange={handleChange}
                required
            />
          </Form.Group>
          <div className="d-grid">
            <Button variant="primary" type="submit">
              Create account
            </Button>
          </div>
        </Form>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Col>
      </Row>
  );
}

export default Register;
