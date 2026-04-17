import React, { useState } from "react";
import { useNavigate } from "react-router";

import { AddBookForm } from "../components";

export const AddBookPage = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSuccess = () => {
    setErrorMessage(null);
    navigate("/catalog");
  };
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
      <title>Добавить книгу в каталог</title>

      <h1>Добавить книгу в каталог</h1>
      <AddBookForm
        onSuccess={handleSuccess}
        onChange={handleChange}
        onError={handleError}
      />
      {errorMessage !== null && (
      <p style={{ color: "red" }}>{errorMessage}</p>
      )}
    </>
  );
};

