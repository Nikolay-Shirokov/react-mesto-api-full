import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from "../utils/api";

export function useAuth() {

  const emptyAuthInfo = {
    loggedIn: false,
  }

  const navigate = useNavigate();

  const [authInfo, setAuthInfo] = useState(emptyAuthInfo);

  const handleSignup = (userInfo) => {
    return api.signup(userInfo)
      .then(res => {
        handleSignin(userInfo);
      })
  }

  const handleSignin = (userInfo) => {
    return api.signin(userInfo)
      .then(res => {
          handleGetUserInfo();
      })
  }

  const handleGetUserInfo = () => {
    return api.getUserInfo()
      .then(res => {
        setAuthInfo({
          ...authInfo,
          loggedIn: true,
          email: res.data.email,
        });
        navigate('/')
      })
  }

  const checkToken = () => {
      handleGetUserInfo();
  }

  const handleLogout = () => {
    setAuthInfo(emptyAuthInfo);
  }

  return { authInfo, setAuthInfo, handleSignup, handleSignin, checkToken, handleLogout };
}
