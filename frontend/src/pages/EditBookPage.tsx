import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Book } from "../api/api";
import { EditBookForm } from "../components";
import { useApi } from "../hooks";

export const EditBookPage = () => {
  const params = useParams() as { bookId: string };
  const navigate = useNavigate();
  const api = useApi();

  const [book, setBook] = useState<Book | null>(null);
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

  useEffect(() => {
    (async function () {
      try {
        const book = await api.getBook(params.bookId);
        setBook(book);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          alert(err);
        }
      }
    }());
  }, []);

  return (
    <>
      <h1>Изменить информацию о книге</h1>
      {book && (
      <EditBookForm
        book={book}
        onSuccess={handleSuccess}
        onChange={handleChange}
        onError={handleError}
      />
      )}
      {errorMessage && (
      <p style={{ color: "red" }}>{errorMessage}</p>
      )}
    </>
  );
};

