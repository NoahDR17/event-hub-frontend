import React, { useRef, useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Alert,
  Image,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";

import Asset from "../../components/Asset";
import Upload from "../../assets/upload.png";

import styles from "../../styles/EventCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { axiosReq } from "../../api/axiosDefaults";

function EventCreateForm() {
  const [errors, setErrors] = useState({});

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    event_type: "OTHER",
    event_date: "",
    image: "",
    musicians: [],
  });
  const { title, description, location, event_type, event_date, image, musicians } =
    eventData;

  const [musicianProfiles, setMusicianProfiles] = useState([]);

  const imageInput = useRef(null);
  const history = useHistory();

  useEffect(() => {
    const fetchMusicians = async () => {
      try {
        const { data } = await axiosReq.get("/profiles/");
        const results = data?.results || data;

        const musiciansOnly = results.filter(
          (profile) => profile.role === "musician"
        );

        setMusicianProfiles(musiciansOnly);
      } catch (err) {
        console.error("Error fetching musician profiles:", err);
      }
    };

    fetchMusicians();
  }, []);

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

  const handleMusiciansChange = (event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setEventData({
      ...eventData,
      musicians: selectedOptions,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Build 
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("event_type", event_type);
    formData.append("event_date", event_date);

    if (imageInput.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    if (musicians.length > 0) {
      musicians.forEach((musicianId) => formData.append("musicians", musicianId));
    }

    try {
      const { data } = await axiosReq.post("/events/", formData);
      history.push(`/events/${data.id}`);
    } catch (err) {
      console.error("Error creating event:", err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
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
        />
      </Form.Group>
      {errors?.event_date?.map((message, idx) => (
        <Alert variant="warning" key={idx} className={styles.Alert}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Event Type</Form.Label>
        <Form.Control
          className={styles.Select}
          as="select"
          name="event_type"
          value={event_type}
          onChange={handleChange}
        >
          <option value="CONFERENCE">Conference</option>
          <option value="MEETUP">Meetup</option>
          <option value="WORKSHOP">Workshop</option>
          <option value="PARTY">Party</option>
          <option value="OTHER">Other</option>
        </Form.Control>
      </Form.Group>
      {errors?.event_type?.map((message, idx) => (
        <Alert variant="warning" key={idx} className={styles.Alert}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Musicians (Optional)</Form.Label>
        <Form.Control
          as="select"
          multiple
          name="musicians"
          value={musicians}
          onChange={handleMusiciansChange}
          className={styles.Select}
        >
          {musicianProfiles.map((profile) => (
            <option key={profile.id} value={profile.owner_id}>
              {profile.owner}
            </option>
          ))}
        </Form.Control>
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

export default EventCreateForm;
