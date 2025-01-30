import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Spinner,
  Alert,
  Form,
  Button,
} from "react-bootstrap";
import axios from "axios";
import EventCard from "../../components/EventCard";
import styles from "../../styles/EventsPage.module.css";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMusician, setSelectedMusician] = useState("");
  const [musicians, setMusicians] = useState([]);
  const [musicianLoading, setMusicianLoading] = useState(false);
  const [musicianError, setMusicianError] = useState(null);
  const eventRefs = useRef([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get("/events/");
        if (Array.isArray(data)) {
          setEvents(data);
          setFilteredEvents(data);
        } else if (data.results && Array.isArray(data.results)) {
          setEvents(data.results);
          setFilteredEvents(data.results);
        } else {
          setEvents([]);
          setFilteredEvents([]);
        }

        if (data.length > 0 && Array.isArray(data[0].musicians) && data[0].musicians.length > 0) {
          console.log("Type of first musician ID:", typeof data[0].musicians[0]);
        }
      } catch (err) {
        setError(err.response?.data || "Error fetching events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchMusicians = async () => {
      const musicianIds = Array.from(
        new Set(events.flatMap((event) => event.musicians || []))
      );

      if (musicianIds.length === 0) {
        setMusicians([]);
        return;
      }

      setMusicianLoading(true);
      try {
        const profilePromises = musicianIds.map((id) =>
          axios.get(`/profiles/${id}/`)
        );
        const responses = await Promise.all(profilePromises);
        const profiles = responses.map((res) => res.data);
        setMusicians(profiles);
      } catch (err) {
        setMusicianError("Error fetching musician profiles.");
      } finally {
        setMusicianLoading(false);
      }
    };

    fetchMusicians();
  }, [events]);

  const musicianMap = {};
  musicians.forEach((musician) => {
    musicianMap[musician.id] = musician.name;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    let filtered = events;

    if (searchTerm.trim() !== "") {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(lowercasedTerm) ||
          event.location.toLowerCase().includes(lowercasedTerm)
      );
    }

    if (selectedMusician.trim() !== "") {
      const musicianId = Number(selectedMusician);
      if (!isNaN(musicianId)) {
        filtered = filtered.filter(
          (event) =>
            Array.isArray(event.musicians) &&
            event.musicians.includes(musicianId)
        );
      }
    }

    setFilteredEvents(filtered);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedMusician("");
    setFilteredEvents(events);
  };

  if (loading || musicianLoading) {
    return (
      <Container className="my-4 d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
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
      <div className={styles.FixedSidebar}>
        <Form onSubmit={handleSearch} className={`mb-4 ${styles.SearchForm}`}>
          <Form.Group controlId="search">
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by title or location..."
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
                  {musician.name}
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
      </div>

      <Container fluid className={styles.EventsContainer}>
        <h1 className={`text-center mb-4 ${styles.PageTitle}`}>Events</h1>

        {filteredEvents.length === 0 ? (
          <Alert variant="info">No events match your search criteria.</Alert>
        ) : (
          <div className={styles.EventsList}>
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={styles.EventSection}
                ref={(el) => (eventRefs.current[event.id] = el)}
              >
                <EventCard event={event} musicianMap={musicianMap} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default EventsPage;
