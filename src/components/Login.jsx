import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { appContext } from "../Lib/contextLib";
import { handleAuthChange } from "../Lib/contextLib";


export default function Login() {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Validates the form
  function validateForm() {
    return username.length > 0 && password.length > 0;
  }
    
    // Handles the form submission and sends the request to the API to authenticate the user
    async function handleSubmit(event) {
        event.preventDefault();

        const authAPi = "https://learn.reboot01.com/api/auth/signin";

        try {
            const credentials = `${username}:${password}`;
            const base64Credentials = btoa(credentials);

            const response = await fetch(authAPi, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${base64Credentials}`,
              },
            });

            if (!response.ok) {
              setErrorMsg("Invalid credentials");
              return
            }
            const jwt = await response.json(); 

            if (jwt) {
              localStorage.setItem("jwtToken", jwt);

              appContext.setState({ isAuthenticated: true });
              navigate("/01-Profile");
            } else {
              appContext.setState({ isAuthenticated: false });
                console.log("Failed Auth")
            }

            
        } catch (error) {
            console.log(error.message);
        }
    }


  return (
    <div className="LoginPage">
      <div className="Login">
        <h1>Login</h1>
        <p style={{ color: "red" }}>{errorMsg}</p>
        <Form onSubmit={handleSubmit}>
          <Stack gap={3}>
            <Form.Group controlId="email">
              <Form.Label>Email: </Form.Label>
              <Form.Control
                autoFocus
                size="lg"
                type="text"
                value={username}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password: </Form.Label>
              <Form.Control
                size="lg"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button size="lg" type="submit" disabled={!validateForm()}>
              Login
            </Button>
          </Stack>
        </Form>
      </div>
    </div>
  );
}
