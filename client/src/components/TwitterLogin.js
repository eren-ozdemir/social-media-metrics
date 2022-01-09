import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const TwitterLogin = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return !isAuthenticated ? (
    <button onClick={() => loginWithRedirect()}>Log In with Twitter</button>
  ) : (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out Twitter
    </button>
  );
};

export default TwitterLogin;
