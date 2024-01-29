import React, {useState, useContext} from 'react';
import { LoginContext } from '../context/LoginContext';
import ApiService from "../services/ApiService";
import { Button, Form, Alert, Row, Col } from 'react-bootstrap';

function Login() {
  const [login, setLogin] = useState({ email: '', password: '' });
  const { dispatch } = useContext(LoginContext);
  const [error, setError] = useState(null);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setLogin((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
      setError(null);

      ApiService.getUser({"email":login.email,"password":login.password})
        .then((response) => {
          const user = response.data;
            localStorage.setItem('user', JSON.stringify(user));
            dispatch({ type: 'LOGIN', payload: user });

        })
        .catch(() => {
            setError("These credentials are incorrect, please try again!");
        });


  };

  return (
        <Row className="login-container">
          <Col  className="mx-auto col-9">
            <Form onSubmit={handleSubmit}>
              <h3 className="text-center">Sign In</h3>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={login.email}
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
                    value={login.password}
                    onChange={handleChange}
                    required
                />
              </Form.Group>
              <div className="d-grid">
              <Button variant="primary" type="submit">
                Login
              </Button>
              </div>
            </Form>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Col>
        </Row>
  );
}

export default Login;
