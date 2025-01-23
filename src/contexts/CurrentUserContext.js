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
      const { data } = await axiosReq.get("dj-rest-auth/user/");
      setCurrentUser(data);
      console.log(data)
    } catch (err) {
      console.log(err);
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
            refresh: localStorage.getItem('refreshToken'),
          });
          const newAccessToken = response.data.access;
          localStorage.setItem('accessToken', newAccessToken);
          const token = localStorage.getItem('accessToken');
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
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
              refresh: localStorage.getItem('refreshToken'),
            });
            const newAccessToken = response.data.access;
            localStorage.setItem('accessToken', newAccessToken);
            console.log(newAccessToken, 'New Token')
            // const response = await axiosInstance.post('/token/refresh/', {
            //   refresh: localStorage.getItem('refresh_token'),
            // });
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