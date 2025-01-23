import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";
import { axiosReq } from "../api/axiosDefaults";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import Avatar from "./Avatar";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();


  const handleSignOut = async () => {
    try {
      await axiosReq.post("dj-rest-auth/logout/");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
    console.log('Sign out: Successful')
  };

  const createEventIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/events/create"
    >
      <i className="fas fa-plus-square"></i>Create Event
    </NavLink>
  )

  const loggedInIcons = <>
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/liked"
    >
      <i className="fas fa-heart"></i>Liked
    </NavLink>
    <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
      <i className="fas fa-sign-out-alt"></i>Sign out
    </NavLink>
    <NavLink
      className={styles.NavLink}
      to={`/profiles/${currentUser?.profile_id}`}
    >
      <Avatar
        src={currentUser?.profile_image} text={
          currentUser?.username && currentUser.username.length < 10
            ? currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1)
            : "Profile"
        }
        height={40}
      />
    </NavLink>
  </>;
  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i>Sign in
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
      >
        <i className="fas fa-user-plus"></i>Sign up
      </NavLink>
    </>
  );

  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height="50" />
          </Navbar.Brand>
        </NavLink>
        {currentUser && createEventIcon}
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/"
            >
              <i className="fas fa-home"></i>Home
            </NavLink>

            <NavLink
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/events"
            >
              <i className="fas fa-stream"></i>Events
            </NavLink>
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;