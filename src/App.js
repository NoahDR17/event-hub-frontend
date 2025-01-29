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

function App() {
  const location = useLocation();
  const currentUser = useCurrentUser();
  console.log("currentuser", currentUser)
  // Check if current route is '/signup' or '/signin'
  const isAuthPage = location.pathname === "/signup" || location.pathname === "/signin";

  return (
    <div className={`${styles.App} ${isAuthPage ? styles.AuthBackground : ""}`}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/" render={() => <h1>Home page</h1>} />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />

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
          <Route exact path="/events/:id" component={EventDetailPage} />

          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}
export default App;
