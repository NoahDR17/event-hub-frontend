import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Spinner,
  Alert,
  Form,
  Button,
  Col,
} from "react-bootstrap";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import EventCard from "../../components/EventCard";
import styles from "../../styles/EventsPage.module.css";
import { fetchMoreData } from "../../utils/utils";
import Asset from "../../components/Asset";
import { useHistory } from "react-router-dom";

function EventsPage() {

  const [eventsResource, setEventsResource] = useState({ results: [], next: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMusician, setSelectedMusician] = useState("");
  const [musicians, setMusicians] = useState([]);
  const [musicianLoading, setMusicianLoading] = useState(false);
  const [musicianError, setMusicianError] = useState(null);
  const eventRefs = useRef([]);
  const history = useHistory();
  

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get("/events/");
        setEventsResource(data);
      } catch (err) {
        setError(err.response?.data || "Error fetching events.");
        history.push("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [history]);

  const filteredResults = eventsResource.results.filter((event) => {
    let matches = true;

    if (searchTerm.trim() !== "") {
      const lowercasedTerm = searchTerm.toLowerCase();
      matches =
        event.title.toLowerCase().includes(lowercasedTerm) ||
        event.location.toLowerCase().includes(lowercasedTerm);
    }

    if (matches && selectedMusician.trim() !== "") {
      const musicianId = Number(selectedMusician);
      matches =
        Array.isArray(event.musicians) &&
        event.musicians.includes(musicianId);
    }

    return matches;
  });

  useEffect(() => {
    const fetchMusicians = async () => {
      setMusicianLoading(true);
      try {

        const { data } = await axios.get("/profiles/");

        setMusicians(data.results || data);
      } catch (err) {
        setMusicianError("Error fetching musician profiles.");
      } finally {
        setMusicianLoading(false);
      }
    };

    fetchMusicians();
  }, []);

  const musicianMap = {};
  musicians.forEach((musician) => {
    musicianMap[musician.id] = musician.owner;
  });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedMusician("");
  };

  if (loading || musicianLoading) {
    return (
      <Container
        className="my-4 d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || musicianError) {
    return (
      <Container className="my-4">
        <Alert variant="danger">{error || musicianError}</Alert>
      </Container>
    );
  }

  return (
    <div className={styles.PageContainer}>
      <Col md={4} className={styles.FixedSidebar}>
        <Form onSubmit={handleSearch} className="mb-4">
          <Form.Group controlId="search">
            <Form.Label>Search by title or location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.SearchInput}
            />
          </Form.Group>
          <Form.Group controlId="filterMusician">
            <Form.Label>Filter by Musician</Form.Label>
            <Form.Control
              as="select"
              value={selectedMusician}
              onChange={(e) => setSelectedMusician(e.target.value)}
              className={styles.FilterSelect}
            >
              <option value="">All Musicians</option>
              {musicians.map((musician) => (
                <option key={musician.id} value={musician.id}>
                  {musician.owner}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <div className={`d-flex justify-content-between ${styles.SearchButtons}`}>
            <Button variant="primary" type="submit" aria-label="Search events">
              Search
            </Button>
            <Button variant="secondary" onClick={handleReset} aria-label="Reset search filters">
              Reset
            </Button>
          </div>
        </Form>
      </Col>

      <Col md={8} className={styles.EventsContainer}>
        {filteredResults.length === 0 ? (
          <Alert variant="info">No events match your search criteria.</Alert>
        ) : (
          <InfiniteScroll
            dataLength={eventsResource.results.length}
            hasMore={!!eventsResource.next}
            loader={<Asset spinner />}
            next={() => fetchMoreData(eventsResource, setEventsResource)}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>You&apos;ve reached the end of the events list.</b>
              </p>
            }
          >
            <div className={styles.EventsList}>
              {filteredResults.map((event) => (
                <div
                  key={event.id}
                  className={styles.EventSection}
                  ref={(el) => (eventRefs.current[event.id] = el)}
                >
                  <EventCard event={event} musicianMap={musicianMap} />
                </div>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </Col>
    </div>
  );
}

export default EventsPage;
