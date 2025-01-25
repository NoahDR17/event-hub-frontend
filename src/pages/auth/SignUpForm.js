import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";


import {
    Form,
    Button,
    Image,
    Col,
    Row,
    Container,
    Alert,
} from "react-bootstrap";
import axios from "axios";

const SignUpForm = () => {
    const [signUpData, setSignUpData] = useState({
        username: "",
        password1: "",
        password2: "",
        role: "basic",
        genres: "",
        instruments: "",
    });
    const { username, password1, password2, role, genres, instruments, } = signUpData;
    const [errors, setErrors] = useState({});

    const history = useHistory();

    const handleChange = (event) => {
        setSignUpData({
            ...signUpData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("/dj-rest-auth/registration/", signUpData);
            localStorage.setItem("accountCreated", "true");
            history.push("/signin");
        } catch (err) {
            setErrors(err.response?.data);
        }
    };

    return (
        <Row className={styles.Row}>
            <Col className="my-auto py-2 p-md-2" md={6}>
                <Container className={styles.content}>
                    <h1 className={styles.Header}>sign up</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label className="d-none">username</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={username}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {errors.username?.map((message, idx) => (
                            <Alert variant="warning" key={idx}>
                                {message}
                            </Alert>
                        ))}

                        <Form.Group controlId="password1">
                            <Form.Label className="d-none">Password</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="password"
                                placeholder="Password"
                                name="password1"
                                value={password1}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {errors.password1?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}

                        <Form.Group controlId="password2">
                            <Form.Label className="d-none">Confirm password</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="password"
                                placeholder="Confirm password"
                                name="password2"
                                value={password2}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="role">
                            <Form.Control
                                as="select"
                                name="role"
                                value={role}
                                required
                                onChange={handleChange}
                            >
                                <option value="basic">Basic User</option>
                                <option value="organiser">Event Organiser</option>
                                <option value="musician">Musician/Band</option>
                            </Form.Control>
                            {errors?.role?.map((msg, idx) => (
                                <div className="text-danger" key={idx}>{msg}</div>
                            ))}
                        </Form.Group>
                        {errors.password2?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
                        {role === "musician" && (
                            <>
                                <Form.Group controlId="profileGenres">
                                    <Form.Label className={styles.CustomLabel}>Genres</Form.Label>
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
                                    <Form.Label className={styles.CustomLabel}>Instruments</Form.Label>
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

                        <Button
                            className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
                            type="submit"
                        >
                            Sign up
                        </Button>
                        {errors.non_field_errors?.map((message, idx) => (
                            <Alert key={idx} variant="warning" className="mt-3">
                                {message}
                            </Alert>
                        ))}
                    </Form>
                    <Link className={styles.Link} to="/signin">
                        Already have an account? <span>Sign in</span>
                    </Link>
                </Container>

            </Col>
            <Col
                md={6}
                className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
            >
                <Image
                    className={`${appStyles.FillerImage}`}
                    src={"https://res-console.cloudinary.com/du7daaai2/thumbnails/v1/image/upload/v1737555665/c2lnbi11cF9yYjB4bnQ=/drilldown"}
                    style={{ height: "97%", paddingTop: "10px" }}
                />
            </Col>
        </Row>
    );
};

export default SignUpForm;
