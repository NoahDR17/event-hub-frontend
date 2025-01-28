import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Alert, Button } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import Asset from "../../components/Asset";
import styles from "../../styles/EventDetail.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { axiosReq } from "../../api/axiosDefaults";

function EventDetailPage() {
  const { id } = useParams();
  const history = useHistory();
  const [eventData, setEventData] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axiosReq.get(`/events/${id}/`);
        setEventData(data);
      } catch (err) {
        console.error(err);
        setErrors(err.response?.data || "Error fetching event details");
      }
    };
    fetchEvent();
  }, [id]);

  if (errors) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{errors}</Alert>
        <Button onClick={() => history.goBack()} className={btnStyles.Button}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (!eventData) {
    return <Asset spinner message="Loading event details..." />;
  }

  const { title, description, location, event_type, event_date, image, musicians } = eventData;

  return (
    <Container className={`${appStyles.Content} ${styles.EventDetail}`}>
      <Row>
        <Col md={8}>
          <Image src={image} className={styles.Image} rounded fluid />
        </Col>
        <Col md={4}>
          <h2>{title}</h2>
          <p>
            <strong>Type:</strong> {event_type}
          </p>
          <p>
            <strong>Date:</strong> {new Date(event_date).toLocaleString()}
          </p>
          <p>
            <strong>Location:</strong> {location}
          </p>
          <p>
            <strong>Description:</strong> {description}
          </p>
          <p>
            <strong>Musicians:</strong>{" "}
            {musicians.length > 0 ? (
              musicians.map((musician) => (
                <span key={musician.id} className={styles.Musician}>
                  {musician.name}
                </span>
              ))
            ) : (
              "None"
            )}
          </p>
          <Button
            className={`${btnStyles.Button} ${btnStyles.Blue} mt-3`}
            onClick={() => history.goBack()}
          >
            Go Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default EventDetailPage;
