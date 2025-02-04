import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import styles from "../../styles/ProfileEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";
import Upload from "../../assets/upload.webp";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser, useSetCurrentUser } from "../../contexts/CurrentUserContext";

function ProfileEditForm() {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const history = useHistory();

  const [profileData, setProfileData] = useState({
    name: "",
    content: "",
    role: "basic",
    genres: "",
    instruments: "",
    image: "",
  });
  const [profileImage, setProfileImage] = useState("");
  const [errors, setErrors] = useState({});
  const [originalRole, setOriginalRole] = useState("");

  const { name, content, role, genres, instruments, image } = profileData;

  useEffect(() => {
    if (currentUser) {
      const fetchProfile = async () => {
        try {
          const { data } = await axiosReq.get(`/profiles/${currentUser.id}/`);
          setProfileData(data);
          setProfileImage(data.image);
          setOriginalRole(data.role);
        } catch (err) {
          console.error(err);
        }
      };
      fetchProfile();
    }
  }, [currentUser]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setProfileImage(URL.createObjectURL(file));
      setProfileData({
        ...profileData,
        image: file,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("content", content);
    formData.append("role", role);
    formData.append("genres", genres);
    formData.append("instruments", instruments);

    if (typeof image === "object") {
      formData.append("image", image);
    }
    try {
      await axiosReq.put(`/profiles/${currentUser.id}/`, formData);
      const { data: updatedUser } = await axiosReq.get(`/profiles/${currentUser.id}/`);
      setCurrentUser(updatedUser);
      setOriginalRole(role);
      history.push(`/profiles/${currentUser.id}/`);
    } catch (err) {
      console.error(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Container className={styles.Content}>
            <h2 className={styles.Heading}>Edit Profile</h2>

            <Form.Group className="text-center">
              {profileImage ? (
                <>
                  <figure>
                    <Image className={styles.ProfileImage} src={profileImage} rounded />
                  </figure>
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
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
                onChange={handleChangeImage}
                className="d-none"
              />
              {errors?.image?.map((message, idx) => (
                <div className="text-danger" key={idx}>
                  {message}
                </div>
              ))}
            </Form.Group>

            <Form.Group controlId="profileName">
              <Form.Label className={styles.Label}>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                name="name"
                onChange={handleChange}
              />
              {errors?.name?.map((message, idx) => (
                <div className="text-danger" key={idx}>
                  {message}
                </div>
              ))}
            </Form.Group>

            <Form.Group controlId="profileContent">
              <Form.Label className={styles.Label}>Bio / About</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={content}
                name="content"
                onChange={handleChange}
              />
              {errors?.content?.map((message, idx) => (
                <div className="text-danger" key={idx}>
                  {message}
                </div>
              ))}
            </Form.Group>

            <Form.Group controlId="profileRole">
              <Form.Label className={styles.Label}>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={role}
                onChange={handleChange}
                disabled={originalRole !== "basic"}
              >
                <option value="basic">Basic User</option>
                <option value="organiser">Event Organiser</option>
                <option value="musician">Musician/Band</option>
              </Form.Control>
              {originalRole !== "basic" && (
                <div className="text-muted mt-1">
                  Your role is locked because it is no longer &quot;Basic&quot;.
                </div>
              )}
              {errors?.role?.map((message, idx) => (
                <div className="text-danger" key={idx}>
                  {message}
                </div>
              ))}
            </Form.Group>

            {role === "musician" && (
              <>
                <Form.Group controlId="profileGenres">
                  <Form.Label>Genres</Form.Label>
                  <Form.Control
                    type="text"
                    value={genres || ""}
                    name="genres"
                    onChange={handleChange}
                    placeholder="Rock, Pop, Jazz, etc."
                  />
                  {errors?.genres?.map((message, idx) => (
                    <div className="text-danger" key={idx}>
                      {message}
                    </div>
                  ))}
                </Form.Group>

                <Form.Group controlId="profileInstruments">
                  <Form.Label>Instruments</Form.Label>
                  <Form.Control
                    type="text"
                    value={instruments || ""}
                    name="instruments"
                    onChange={handleChange}
                    placeholder="Guitar, Piano, Vocals, etc."
                  />
                  {errors?.instruments?.map((message, idx) => (
                    <div className="text-danger" key={idx}>
                      {message}
                    </div>
                  ))}
                </Form.Group>
              </>
            )}

            <div className="mt-3">
              <Button
                variant="secondary"
                className="mr-2"
                onClick={() => history.goBack()}
              >
                Cancel
              </Button>
              <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                type="submit"
              >
                Save
              </Button>
            </div>
          </Container>
        </Col>
      </Row>
    </Form>
  );
}

export default ProfileEditForm;
