import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Alert, Button, Spinner } from "react-bootstrap";
import { useParams, useHistory, Link } from "react-router-dom";
import Asset from "../../components/Asset";
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
      if (eventData && Array.isArray(eventData.musicians) && eventData.musicians.length > 0) {
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
        <Button onClick={() => history.goBack()} className={btnStyles.Button}>
          Go Back
        </Button>
      </Container>
    );
  }


  if (!eventData) {
    return <Asset spinner message="Loading event details..." />;
  }

  const { title, description, location, event_type, event_date, image } = eventData;

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
            <strong>Featuring:</strong>{" "}
            {musicianLoading ? (
              <Spinner animation="border" role="status" size="sm" className="ml-2">
                <span className="sr-only">Loading...</span>
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
