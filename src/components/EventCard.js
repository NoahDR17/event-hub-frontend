import React from "react";
import { Card, Button, Row, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../styles/EventCard.module.css";

function EventCard({ event, musicianMap, minimal }) {
  const {
    id,
    title,
    description,
    location,
    event_date,
    image,
    musicians,
  } = event;

  return (
    <Card className={`mb-5 shadow-lg ${styles.EventCard}`}>
      <Row noGutters className={styles.CardBody}>
        <Col md={6}>
          <Link to={`/events/${id}/`}>
            <Card.Img
              src={image || "/default_event.png"}
              alt={`${title} Image`}
              className={styles.EventImage}
              loading="lazy"
            />
          </Link>
        </Col>
        <Col md={6}>
          <Card.Body className={styles.EventDetails}>
            <Card.Title className={styles.EventTitle}>{title}</Card.Title>
            <div className={styles.EventMeta}>
              <Badge variant="info" className={styles.Badge}>
                {new Date(event_date).toLocaleDateString()}{" "}
                {new Date(event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Badge>
              <Badge variant="secondary" className={styles.Badge}>
                {location}
              </Badge>
            </div>

            {!minimal && (
              <>
                {Array.isArray(musicians) && musicians.length > 0 && (
                  <div className={styles.Musicians}>
                    <strong>Musicians:</strong>
                    <ul className={styles.MusiciansList}>
                      {musicians.map((musicianId) => (
                        <li key={musicianId} className={styles.MusicianItem}>
                          {musicianMap[musicianId] || "Unknown Musician"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Card.Text className={styles.EventDescription}>
                  {description.length > 200
                    ? `${description.slice(0, 200)}...`
                    : description}
                </Card.Text>
              </>
            )}
            <Button
              as={Link}
              to={`/events/${id}/`}
              className={styles.Button}
              aria-label={`View details for ${title}`}
            >View Details</Button>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    location: PropTypes.string,
    event_date: PropTypes.string,
    image: PropTypes.string,
    musicians: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  }).isRequired,
  musicianMap: PropTypes.object.isRequired,
  minimal: PropTypes.bool,
};

export default EventCard;
