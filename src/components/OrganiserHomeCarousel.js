import React, { useEffect, useState } from "react";
import { Carousel, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";
import EventCard from "./EventCard";
import { useCurrentUser } from "../contexts/CurrentUserContext";

function OrganiserHomeCarousel({ organiserId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axiosReq.get("/events");
        const filteredEvents = data.results.filter(
          (event) => event.owner === currentUser.owner
        );
        setEvents(filteredEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setErrors("Error fetching events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  });

  if (loading) {
    return (
      <Container className="text-center my-4">
        <Spinner animation="border" role="status" />
        <span className="sr-only">Loading events...</span>
      </Container>
    );
  }

  if (errors) {
    return (
      <Container className="my-4">
        <Alert variant="danger">{errors}</Alert>
      </Container>
    );
  }

  if (events.length === 0) {
    return (
      <Container className="my-4">
        <p>No events available at this time.</p>
      </Container>
    );
  }

  return (
    <Carousel interval={5000} pause="hover" controls={false}>
      {events.map((event) => (
        <Carousel.Item key={event.id}>
          <Row className="justify-content-center">
            <Col md={8}>
              <EventCard event={event} minimal />
            </Col>
          </Row>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default OrganiserHomeCarousel;
