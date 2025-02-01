import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import HomePageCarousel from "../../components/HomePageCarousel";
import OrganiserHomeCarousel from "../../components/OrganiserHomeCarousel";
import MusicianHomeCarousel from "../../components/MusicianHomeCarousel";
import styles from "../../styles/HomePage.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function HomePage() {
  const history = useHistory();
  const currentUser = useCurrentUser();

  return (
    <Container className={styles.HomeContainer}>
      <Row className="align-items-center">
        <Col md={12}>
          {currentUser && currentUser.role === "organiser" ? (
            <>
              <h1 className={styles.HomeTitle}>Welcome {currentUser.owner.charAt(0).toUpperCase() + currentUser.owner.slice(1)}!</h1>
              <p className={styles.HomeDescription}>
                Manage your events, monitor your upcoming shows, and connect with musicians. Create new events or manage your existing ones, all in one place.
              </p>
              <div className={styles.CallToActions}>
                <Button
                  className={styles.Button}
                  onClick={() => history.push("/events/create")}
                >
                  Create Event
                </Button>
                <Button
                  className={styles.Button}
                  onClick={() => history.push(`/profiles/${currentUser.id}`)}
                >
                  My Profile
                </Button>
              </div>
            </>
          ) : currentUser && currentUser.role === "musician" ? (
            <>
              <h1 className={styles.HomeTitle}>Welcome Musician!</h1>
              <p className={styles.HomeDescription}>
                Showcase your talent, connect with event organisers, and discover exciting opportunities. Manage your profile and stay updated on your upcoming gigs.
              </p>
              <div className={styles.CallToActions}>
                <Button
                  className={styles.Button}
                  onClick={() => history.push(`/profiles/${currentUser.id}`)}
                >
                  My Profile
                </Button>
                <Button
                  className={styles.Button}
                  onClick={() => history.push("/events")}
                >
                  Browse Events
                </Button>
              </div>
            </>
          ) : currentUser && currentUser.role === "basic" ? (
            <>
              <h1 className={styles.HomeTitle}>Welcome!</h1>
              <p className={styles.HomeDescription}>
                You currently have a basic account. Upgrade to unlock more features:
                <br />
                <strong>Organiser:</strong> Create and manage your own events, get insights on your audience, and more.
                <br />
                <strong>Musician:</strong> Showcase your talent, access exclusive opportunities, and feature on events that you're playing at.
              </p>
              <div className={styles.CallToActions}>
                <Button
                  className={styles.Button}
                  onClick={() => history.push(`/profiles/${currentUser.id}/edit`)}
                >
                  Upgrade Now!
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className={styles.HomeTitle}>Welcome to Our Platform</h1>
              <p className={styles.HomeDescription}>
                Discover amazing events, discover talented musicians, and share your passion for music. Join our vibrant community today!
              </p>
              <div className={styles.CallToActions}>
                <Button
                  className={styles.Button}
                  onClick={() => history.push("/events")}
                >
                  View Events
                </Button>
                <Button
                  className={styles.Button}
                  onClick={() => history.push("/signin")}
                >
                  Sign In
                </Button>
                <Button
                  className={styles.Button}
                  onClick={() => history.push("/signup")}
                >
                  Sign Up
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={12}>
          <h2 className={styles.CarouselTitle}>
            {currentUser && currentUser.role === "organiser"
              ? "Your Events"
              : currentUser && currentUser.role === "musician"
              ? "Your Upcoming Gigs"
              : "Featured Events"}
          </h2>
          {currentUser && currentUser.role === "organiser" ? (
            <OrganiserHomeCarousel organiserId={currentUser.id} />
          ) : currentUser && currentUser.role === "musician" ? (
            <MusicianHomeCarousel musicianId={currentUser.id} />
          ) : (
            <HomePageCarousel />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
