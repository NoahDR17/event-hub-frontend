import React, { useRef, useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Alert,
  Image,
  Spinner,
} from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import Select from "react-select";
import Asset from "../../components/Asset";
import Upload from "../../assets/upload.webp";
import styles from "../../styles/EventCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { axiosReq } from "../../api/axiosDefaults";

function EventEditForm() {
  const { id } = useParams();
  const history = useHistory();
  const [errors, setErrors] = useState({});
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    event_date: "",
    image: "",
    musicians: [],
  });
  const { title, description, location, event_date, image, musicians } =
    eventData;

  const [musicianProfiles, setMusicianProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const imageInput = useRef(null);
  const [loading, setLoading] = useState(true);

  const getMinDate = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now - tzOffset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchEventAndMusicians = async () => {
      try {
        const { data: event } = await axiosReq.get(`/events/${id}/`);
        setEventData({
          title: event.title,
          description: event.description,
          location: event.location,
          event_date: event.event_date,
          image: event.image,
          musicians: event.musicians,
        });
        const { data } = await axiosReq.get("/profiles/");
        const results = data?.results || data;
        const musiciansOnly = results.filter(
          (profile) => profile.role === "musician"
        );
        setMusicianProfiles(musiciansOnly);
      } catch (err) {
        console.error("Error fetching event or musician profiles:", err);
        setErrors(err.response?.data || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchEventAndMusicians();
  }, [id]);

  const filteredMusicians = musicianProfiles.filter((profile) =>
    profile.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (event) => {
    setEventData({
      ...eventData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      const localURL = URL.createObjectURL(event.target.files[0]);
      setEventData({
        ...eventData,
        image: localURL,
      });
    }
  };

  const handleMusiciansChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setEventData({
      ...eventData,
      musicians: selectedIds,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedDate = new Date(event_date);
    const now = new Date();
    if (selectedDate < now) {
      setErrors({
        event_date: ["Event date and time cannot be in the past."],
      });
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("event_date", event_date);
    if (imageInput.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }
    if (musicians.length > 0) {
      musicians.forEach((musicianId) => formData.append("musicians", musicianId));
    }
    try {
      const { data } = await axiosReq.put(`/events/${id}/`, formData);
      history.push(`/events/${data.id}`);
    } catch (err) {
      if (err.response?.status === 401) {
        setErrors(err.response?.data);
        history.push("/401");
      }
      if (err.response?.status === 403) {
        setErrors(err.response?.data);
        history.push("/403");
      }
    }
  };

  const titleDescriptionFields = (
    <div className={styles.DetailsContainer}>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          className={styles.Input}
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
          placeholder="Enter event title"
          maxLength={20}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx} className={styles.Alert}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="description"
          value={description}
          onChange={handleChange}
          className={styles.Input}
          placeholder="Enter event description"
          maxLength={200}
        />
      </Form.Group>
      {errors?.description?.map((message, idx) => (
        <Alert variant="warning" key={idx} className={styles.Alert}>
          {message}
        </Alert>
      ))}
    </div>
  );

  const otherFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Location</Form.Label>
        <Form.Control
          className={styles.Input}
          type="text"
          name="location"
          value={location}
          onChange={handleChange}
          placeholder="Enter event location"
          maxLength={20}
        />
      </Form.Group>
      {errors?.location?.map((message, idx) => (
        <Alert variant="warning" key={idx} className={styles.Alert}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Event Date & Time</Form.Label>
        <Form.Control
          className={styles.Input}
          type="datetime-local"
          name="event_date"
          value={event_date}
          onChange={handleChange}
          min={getMinDate()}
        />
      </Form.Group>
      {errors?.event_date?.map((message, idx) => (
        <Alert variant="warning" key={idx} className={styles.Alert}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Musicians (Optional)</Form.Label>
        <Form.Control
          type="text"
          placeholder="Search musicians by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${styles.Input} mb-2`}
        />
        <Select
          isMulti
          name="musicians"
          options={filteredMusicians.map((profile) => ({
            value: profile.id,
            label: profile.owner,
          }))}
          classNamePrefix="select"
          onChange={handleMusiciansChange}
          value={musicians
            .map((id) => {
              const profile = musicianProfiles.find((m) => m.id === id);
              return profile ? { value: profile.id, label: profile.owner } : null;
            })
            .filter((option) => option !== null)}
          placeholder="Select musicians..."
          noOptionsMessage={() =>
            searchQuery
              ? "No musicians found."
              : "Type to search for musicians."
          }
        />
      </Form.Group>
      {errors?.musicians?.map((message, idx) => (
        <Alert variant="warning" key={idx} className={styles.Alert}>
          {message}
        </Alert>
      ))}
      <div className={styles.ButtonGroup}>
        <Button
          className={`${btnStyles.Button} ${btnStyles.CancelButton}`}
          onClick={() => history.goBack()}
        >
          Cancel
        </Button>
        <Button
          className={`${btnStyles.Button} ${btnStyles.CreateButton}`}
          type="submit"
        >
          Create
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Container className="my-4 d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Form onSubmit={handleSubmit} className={styles.Form}>
      <Row className={styles.Row}>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              {image ? (
                <>
                  <Image
                    className={styles.ImagePreview}
                    src={image}
                    rounded
                    alt="Event Image Preview"
                  />
                  <div>
                    <Form.Label
                      className={`${btnStyles.UploadButton} ${styles.UploadButton}`}
                      htmlFor="image-upload"
                    >
                      Change the image
                    </Form.Label>
                  </div>
                </>
              ) : (
                <Form.Label
                  className="d-flex justify-content-center"
                  htmlFor="image-upload"
                >
                  <Asset src={Upload} message="Click or tap to upload an image" />
                </Form.Label>
              )}
              <Form.File
                id="image-upload"
                accept="image/*"
                ref={imageInput}
                onChange={handleChangeImage}
                style={{ display: "none" }}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx} className={styles.Alert}>
                {message}
              </Alert>
            ))}
            <Container className={styles.DetailsContainer}>
              {titleDescriptionFields}
            </Container>
            <div className="d-md-none">{otherFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={`${appStyles.Content} ${styles.Container}`}>
            {otherFields}
          </Container>
        </Col>
      </Row>
    </Form>
  );
}

export default EventEditForm;
