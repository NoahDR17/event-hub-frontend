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
import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { fetchMoreData } from "../../utils/utils";
import Comment from "../comments/Comment";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { MoreDropdown } from "../../components/MoreDropdown";

function EventDetailPage() {
  const { id } = useParams();
  const history = useHistory();
  const [event, setEvent] = useState({ results: [] });
  const [musicianProfiles, setMusicianProfiles] = useState([]);
  const [errors, setErrors] = useState(null);
  const [musicianError, setMusicianError] = useState(null);
  const [musicianLoading, setMusicianLoading] = useState(false);
  const currentUser = useCurrentUser();
  const [comments, setComments] = useState({ results: [] });
  const profile_image = currentUser?.image;

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: eventData }, { data: commentsData }] = await Promise.all([
          axiosReq.get(`/events/${id}/`),
          axiosReq.get(`/comments/?event=${id}`),
        ]);
        setEvent({ results: [eventData] });
        setComments(commentsData);
        if (process.env.NODE_ENV === "development") {
          console.log("Fetched Event Data:", eventData);
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setErrors(err.response?.data || "Error fetching event details");
      }
    };

    handleMount();
  }, [id]);

  useEffect(() => {
    const fetchMusicianProfiles = async () => {
      if (
        event.results.length > 0 &&
        Array.isArray(event.results[0].musicians) &&
        event.results[0].musicians.length > 0
      ) {
        setMusicianLoading(true);
        try {
          const profilePromises = event.results[0].musicians.map((musicianId) =>
            axiosReq.get(`/profiles/${musicianId}/`)
          );
          const responses = await Promise.all(profilePromises);
          const profiles = responses.map((res) => res.data);
          setMusicianProfiles(profiles);
        } catch (err) {
          console.error("Error fetching musician profiles:", err);
          setMusicianError("Error fetching musician profiles");
        } finally {
          setMusicianLoading(false);
        }
      } else {
        setMusicianProfiles([]);
      }
    };

    fetchMusicianProfiles();
  }, [event]);

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

  if (!event.results.length) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading event details...</p>
      </Container>
    );
  }

  const { title, description, location, event_date, image, owner } = event.results[0];
  const isOwner = currentUser?.owner === owner;

  return (
    <Container className={`${appStyles.Content} ${styles.EventContainer}`} style={{ position: 'relative' }}>
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

        <Col md={6} className={styles.EventInfo} style={{ position: 'relative' }}>
          {isOwner && (
            <div className={styles.dropdownContainer}>
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </div>
          )}
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
              />
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
              onClick={() => history.goBack()}
            >
              <i className="fas fa-arrow-left"></i> Go Back
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <Container className={styles.EventInfo}>
            {currentUser ? (
              <CommentCreateForm
                profile_id={currentUser.profile_id}
                profileImage={profile_image}
                event={id}
                setEvent={setEvent}
                setComments={setComments}
              />
            ) : comments.results.length ? (
              "Comments"
            ) : null}
            {comments.results.length ? (
              <InfiniteScroll
                children={comments.results.map((comment) => (
                  <Comment
                    key={comment.id}
                    {...comment}
                    setEvent={setEvent}
                    setComments={setComments}
                  />
                ))}
                dataLength={comments.results.length}
                loader={<Asset spinner />}
                hasMore={!!comments.next}
                next={() => fetchMoreData(comments, setComments)}
              />
            ) : currentUser ? (
              <span>No comments yet, be the first to comment!</span>
            ) : (
              <span>No comments yet.</span>
            )}
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default EventDetailPage;
