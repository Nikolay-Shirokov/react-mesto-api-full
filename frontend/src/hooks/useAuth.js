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
        setTimeout(handleGetUserInfo, 1000);
      })
  }

  const handleGetUserInfo = () => {
    return api.getUserInfo()
      .then(res => {
        setAuthInfo({
          ...authInfo,
          loggedIn: true,
          ...res,
        });
        navigate('/')
      })
  }

  const checkToken = () => {
    handleGetUserInfo();
  }

  const handleLogout = () => {
    return api.signout()
      .then(res => {
        if (res.ok) {
          setAuthInfo(emptyAuthInfo);
        }
      })
  }

  return { authInfo, setAuthInfo, handleSignup, handleSignin, checkToken, handleLogout };
}
