import React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  const handleMount = async () => {
    try {
      // Fetch user data to get the ID
      const { data: userData } = await axiosReq.get("dj-rest-auth/user/");
      // Extract the user's ID
      const userId = userData.pk;
      // Fetch profile data using the user ID
      const { data: profileData } = await axiosReq.get(`/profiles/${userId}/`);
      // Set the current user to the profile data
      setCurrentUser(profileData);
    } catch (err) {
      console.error(err);
    }
  };
  

  useEffect(() => {
    handleMount();
  }, []);

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        try {
          const response = await axios.post("/dj-rest-auth/token/refresh/", {
            refresh: localStorage.getItem("refreshToken"),
          });
          const newAccessToken = response.data.access;
          localStorage.setItem("accessToken", newAccessToken);
          const token = localStorage.getItem("accessToken");
          if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        } catch (err) {
          setCurrentUser((prevCurrentUser) => {
            if (prevCurrentUser) {
              history.push("/signin");
            }
            return null;
          });
          return config;
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          try {
            const response = await axios.post("/dj-rest-auth/token/refresh/", {
              refresh: localStorage.getItem("refreshToken"),
            });
            const newAccessToken = response.data.access;
            localStorage.setItem("accessToken", newAccessToken);
          } catch (err) {
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/signin");
              }
              return null;
            });
          }
          return axios(err.config);
        }
        return Promise.reject(err);
      }
    );
  }, [history]);
 
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};