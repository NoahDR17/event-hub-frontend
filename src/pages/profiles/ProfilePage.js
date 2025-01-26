import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  ListGroup,
} from "react-bootstrap";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";

function ProfilePage() {
  const { id } = useParams();
  const history = useHistory();
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`/profiles/${id}/`);
        setProfile(data);
      } catch (err) {
        console.error(err);
        setErrors(err.response?.data);
      }
    };
    fetchProfile();
  }, [id]);

  if (!profile && !errors) {
    return <Container className="my-4">Loading...</Container>;
  }

  if (errors) {
    return (
      <Container className="my-4">
        <h4 className="text-danger">Error loading profile!</h4>
      </Container>
    );
  }

  const {
    owner,
    image,
    content,
    role,
    upcoming_events = [],
    past_events = [],
    genres,
    instruments,
  } = profile;

  return (
    <Container className="my-4">
      <Row>
        <Col lg={8}>
          {/* Main Profile Card */}
          <Card className="mb-4">
            <Card.Body className="text-center">
              <Image
                src={image}
                roundedCircle
                alt="Profile Avatar"
                className="mb-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <Card.Title>{owner?.username}</Card.Title>
              <Card.Text>{content || "No bio available."}</Card.Text>
              <Button
                variant="outline-primary"
                className="mt-2"
                onClick={() => history.push(`/profiles/${id}/edit`)}
              >
                Edit Profile
              </Button>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header as="h5">Your Profile Details</Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <div>
                    <strong>Followers:</strong> [N/A]
                  </div>
                  <div>
                    <strong>Following:</strong> [N/A]
                  </div>
                </Col>
                <Col>
                  <div>
                    <strong>Liked:</strong> [N/A]
                  </div>
                  <div>
                    <strong>Joined:</strong>{" "}
                    {owner?.date_joined
                      ? new Date(owner.date_joined).toLocaleDateString()
                      : "Unknown"}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {role === "musician" && (
            <Card className="mb-4">
              <Card.Header as="h5">Musician Details</Card.Header>
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

          <Card className="mb-4">
            <Card.Header as="h5">Past Events</Card.Header>
            {past_events.length > 0 ? (
              <ListGroup variant="flush">
                {past_events.map((event) => (
                  <ListGroup.Item key={event.id}>
                    {event.title}
                    <small className="text-muted d-block">
                      {new Date(event.event_date).toLocaleString()}
                    </small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <ListGroup variant="flush">
                <ListGroup.Item>No past events.</ListGroup.Item>
              </ListGroup>
            )}
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header as="h5">Upcoming Events</Card.Header>
            {upcoming_events.length > 0 ? (
              <ListGroup variant="flush">
                {upcoming_events.map((event) => (
                  <ListGroup.Item key={event.id}>
                    {event.title}
                    <small className="text-muted d-block">
                      {new Date(event.event_date).toLocaleString()}
                    </small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <ListGroup variant="flush">
                <ListGroup.Item>No upcoming events.</ListGroup.Item>
              </ListGroup>
            )}
          </Card>

          <Card className="mb-4">
            <Card.Header as="h5">User Type</Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>{role}</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
