import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Alert,
  Button,
  Spinner,
} from "react-bootstrap";
import { useParams, useHistory, Link } from "react-router-dom";
import styles from "../../styles/EventDetail.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { axiosReq } from "../../api/axiosDefaults";

function EventDetailPage() {
  const { id } = useParams();
  const history = useHistory();
  const [eventData, setEventData] = useState(null);
  const [musicianProfiles, setMusicianProfiles] = useState([]);
  const [errors, setErrors] = useState(null);
  const [musicianError, setMusicianError] = useState(null);
  const [musicianLoading, setMusicianLoading] = useState(false);

  const handleEdit = () => {
    history.push(`/events/${id}/edit`);
  };
  const handleDelete = async () => {
    try {
      await axiosReq.delete(`/events/${id}/`);
      history.goBack();
    } catch (err) {
      console.log(err);
      setErrors("Failed to delete the event. Please try again.");
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axiosReq.get(`/events/${id}/`);
        setEventData(data);
        if (process.env.NODE_ENV === "development") {
          console.log("Fetched Event Data:", data);
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setErrors(err.response?.data || "Error fetching event details");
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    const fetchMusicianProfiles = async () => {
      if (
        eventData &&
        Array.isArray(eventData.musicians) &&
        eventData.musicians.length > 0
      ) {
        setMusicianLoading(true);
        try {
          const profilePromises = eventData.musicians.map((musicianId) =>
            axiosReq.get(`/profiles/${musicianId}/`)
          );
          const responses = await Promise.all(profilePromises);
          const profiles = responses.map((res) => res.data);
          setMusicianProfiles(profiles);
          if (process.env.NODE_ENV === "development") {
            console.log("Fetched Musician Profiles:", profiles);
          }
        } catch (err) {
          console.error("Error fetching musician profiles:", err);
          setMusicianError("Error fetching musician profiles");
        } finally {
          setMusicianLoading(false);
        }
      } else {
        setMusicianProfiles([]);
        if (process.env.NODE_ENV === "development") {
          console.log("No musicians associated with this event.");
        }
      }
    };
    fetchMusicianProfiles();
  }, [eventData]);

  if (errors) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{errors}</Alert>
        <Button
          onClick={() => history.goBack()}
          className={`${btnStyles.Button} ${btnStyles.Gray}`}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!eventData) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
        </Spinner>
        <p className="mt-3">Loading event details...</p>
      </Container>
    );
  }

  const { title, description, location, event_date, image } = eventData;

  return (
    <Container className={`${appStyles.Content} ${styles.EventContainer}`}>
      <Row className="align-items-center">
        <Col md={6} className="text-center">
          <Image
            src={image}
            className={styles.EventImage}
            rounded
            fluid
            alt={`Image for ${title}`}
          />
        </Col>

        {/* Right Column - Event Details */}
        <Col md={6} className="EventInfo">
          <h2 className={styles.EventTitle}>{title}</h2>
          <p>
            <span className={styles.EventLabel}>Date:</span>{" "}
            {new Date(event_date).toLocaleString()}
          </p>
          <p>
            <span className={styles.EventLabel}>Location:</span> {location}
          </p>
          <p>
            <span className={styles.EventLabel}>Description:</span> {description}
          </p>
          <p>
            <span className={styles.EventLabel}>Featuring:</span>{" "}
            {musicianLoading ? (
              <Spinner
                animation="border"
                role="status"
                size="sm"
                className="ms-2"
              >
              </Spinner>
            ) : musicianError ? (
              <span className={styles.Error}>{musicianError}</span>
            ) : musicianProfiles.length > 0 ? (
              <div className={styles.MusiciansList}>
                {musicianProfiles.map((profile) => (
                  <div key={profile.id} className={styles.MusicianCard}>
                    <Link to={`/profiles/${profile.id}`} className={styles.MusicianLink}>
                      <Image
                        src={profile.image || "/default_profile.png"}
                        roundedCircle
                        className={styles.MusicianImage}
                        alt={`${profile.name}'s profile`}
                      />
                      <span className={styles.MusicianName}>{profile.name}</span>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              "None"
            )}
          </p>

          <div className={styles.Buttons}>
            <Button
              className={`${btnStyles.Button}`}
              onClick={handleEdit}
            >
              <i className="fas fa-edit"></i> Edit
            </Button>
            <Button
              className={`${btnStyles.Button}`}
              onClick={handleDelete}
            >
              <i className="fas fa-trash-alt"></i> Delete
            </Button>
            <Button
              className={`${btnStyles.Button}`}
              onClick={() => history.goBack()}
            >
              <i className="fas fa-arrow-left"></i> Go Back
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default EventDetailPage;
