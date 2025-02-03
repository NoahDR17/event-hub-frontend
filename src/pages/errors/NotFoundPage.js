import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <h1 style={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#dc3545",
        }}>404 Page not found!</h1>
      <Link to="/">
        <Button variant="primary">Return to Home</Button>
      </Link>
    </Container>
  );
};

export default NotFoundPage;
