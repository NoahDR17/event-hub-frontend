import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <h1 style={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#dc3545",
        }}>401 Unauthorized!</h1>
      <p>You do not have Authorization to perform this action!</p>
      <Link to="/">
        <Button variant="primary">Return to Home</Button>
      </Link>
    </Container>
  );
};

export default UnauthorizedPage;
