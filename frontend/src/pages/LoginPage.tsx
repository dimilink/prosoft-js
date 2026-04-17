import React, { useState } from "react";

import { LoginForm } from "../components";

export const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = () => {
    setErrorMessage(null);
  };
  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setErrorMessage(err.message);
    } else {
      alert(err);
    }
  };

  return (
    <>
      <title>Вход</title>

      <h1>Вход</h1>
      <LoginForm onChange={handleChange} onError={handleError} />
      {errorMessage !== null && (
      <p style={{ color: "red" }}>{errorMessage}</p>
      )}
    </>
  );
}

