import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch, useLocation, Redirect } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";

import EventCreateForm from "./pages/events/EventCreateForm";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import EventDetailPage from "./pages/events/EventDetailPage";
import EventsPage from "./pages/events/EventsPage"
import EventEditForm from "./pages/events/EventEditForm";

function App() {
  const location = useLocation();
  const currentUser = useCurrentUser();

  const isAuthPage = location.pathname === "/signup" || location.pathname === "/signin";
  const isEventsPage = location.pathname.startsWith("/events/");

  return (
    <div className={`${styles.App} ${isAuthPage ? styles.AuthBackground : ""}
                    ${styles.App} ${isEventsPage ? styles.EventsBackground : ""} `}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/" render={() => <h1>Home page</h1>} />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/events" render={() => <EventsPage message="No events found." />} />
          <Route exact path="/events/:id/edit" render={() => <EventEditForm />} />

          <Route exact path="/events/create">
            {currentUser?.role === "organiser" ? (
              <EventCreateForm />
            ) : (
              <Redirect to="/" />
            )}
          </Route>

          <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
          <Route
            exact
            path="/profiles/:id/edit"
            render={() => <ProfileEditForm />}
          />
          <Route exact path="/events/:id" render={() => <EventDetailPage />} />

          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}
export default App;
