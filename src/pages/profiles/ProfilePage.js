import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  ListGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { useParams, useHistory, Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/ProfilePage.module.css";
import btnStyles from "../../styles/Button.module.css";

function ProfilePage() {
  const { id } = useParams();
  const history = useHistory();
  const currentUser = useCurrentUser();
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showAllUpcomingEvents, setShowAllUpcomingEvents] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`/profiles/${id}/`);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setErrors(err.response?.data || "Error fetching profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <Container className="my-4 d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
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

  if (!profile) {
    return (
      <Container className="my-4">
        <Alert variant="warning">Profile not found.</Alert>
      </Container>
    );
  }

  const {
    image,
    content,
    role,
    upcoming_events = [],
    past_events = [],
    genres,
    instruments,
    created_at,

  } = profile;

  const isOwner = currentUser?.id === profile?.id;
  const handleToggleUpcomingEvents = () => {
    setShowAllUpcomingEvents((prevState) => !prevState);
  };
  const joined = created_at

  const displayedUpcomingEvents = showAllUpcomingEvents
    ? upcoming_events
    : upcoming_events.slice(0, 5);
console.log(profile)
  return (
    <Container className="my-4">
      <div className={styles.ProfileContainer}>
        <Row>
          <Col lg={8}>
            <Card className="mb-4" style={{ backgroundColor: "transparent", border: "none" }}>
              <Card.Body className="text-center">
                <Image
                  src={image || "/default_profile.png"}
                  roundedCircle
                  alt="Profile Avatar"
                  className={`${styles.ProfileImage} mb-3`}
                />
                <Card.Title className={styles.CardTitle}>{profile.name}</Card.Title>
                <Card.Text className={styles.CardText}>{content || "No bio available."}</Card.Text>
                {isOwner && (
                  <Button
                    variant="outline-primary"
                    className={`${btnStyles.Button} ${styles.Button} mt-2`}
                    onClick={() => history.push(`/profiles/${id}/edit`)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Card.Body>
            </Card>

            <Card className="mb-4" style={{ backgroundColor: "transparent", border: "none" }}>
              <Card.Header as="h5" className={styles.CardHeader}>Profile Details</Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <div>
                      <strong>Followers:</strong> 0
                    </div>
                    <div>
                      <strong>Following:</strong> 0
                    </div>
                  </Col>
                  <Col>
                    <div>
                      <strong>Liked:</strong> 0
                    </div>
                    <div>
                      <strong>Joined:</strong> {joined}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {role === "musician" && (
              <Card className="mb-4" style={{ backgroundColor: "transparent", border: "none" }}>
                <Card.Header as="h5" className={styles.CardHeader}>Musician Details</Card.Header>
                <Card.Body>
                  <p>
                    <strong>Genres:</strong> {genres || "N/A"}
                  </p>
                  <p>
                    <strong>Instruments:</strong> {instruments || "N/A"}
                  </p>
                </Card.Body>
              </Card>
            )}

            <Card className="mb-4" style={{ backgroundColor: "transparent", border: "none" }}>
              <Card.Header as="h5" className={styles.CardHeader}>Past Events</Card.Header>
              {past_events.length > 0 ? (
                <ListGroup variant="flush">
                  {past_events.map((event) => (
                    <ListGroup.Item key={event.id} style={{ backgroundColor: "transparent", border: "none", color: "#fffaf0" }}>
                      <Link to={`/events/${event.id}`} style={{ color: "#c97cff", textDecoration: "none" }}>
                        {event.title}
                      </Link>
                      <br />
                      <small className="text-muted">
                        {new Date(event.event_date).toLocaleString()}
                      </small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <ListGroup variant="flush">
                  <ListGroup.Item style={{ backgroundColor: "transparent", border: "none", color: "#fffaf0" }}>
                    No past events.
                  </ListGroup.Item>
                </ListGroup>
              )}
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="mb-4" style={{ backgroundColor: "transparent", border: "none" }}>
              <Card.Header as="h5" className={styles.CardHeader}>Upcoming Events</Card.Header>
              {upcoming_events.length > 0 ? (
                <>
                  <ListGroup variant="flush">
                    {displayedUpcomingEvents.map((event) => (
                      <ListGroup.Item key={event.id} style={{ backgroundColor: "transparent", border: "none", color: "#fffaf0" }}>
                        <Link to={`/events/${event.id}`} style={{ color: "#c97cff", textDecoration: "none" }}>
                          {event.title}
                        </Link>
                        <br />
                        <small className="text-muted">
                          {new Date(event.event_date).toLocaleString()}
                        </small>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  {upcoming_events.length > 5 && (
                    <Button
                      variant="link"
                      className="mt-2 p-0"
                      onClick={handleToggleUpcomingEvents}
                      style={{ color: "#c97cff" }}
                    >
                      {showAllUpcomingEvents ? "Show Less" : "Show More"}
                    </Button>
                  )}
                </>
              ) : (
                <ListGroup variant="flush">
                  <ListGroup.Item style={{ backgroundColor: "transparent", border: "none", color: "#fffaf0" }}>
                    No upcoming events.
                  </ListGroup.Item>
                </ListGroup>
              )}
            </Card>

            <Card className="mb-4" style={{ backgroundColor: "transparent", border: "none" }}>
              <Card.Header as="h5" className={styles.CardHeader}>User Type</Card.Header>
              <Card.Body>
                <Card.Text className={styles.CardText}>
                  <strong>{role}</strong>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default ProfilePage;
