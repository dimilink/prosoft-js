import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";

import { Book } from "../api/api";
import { useApi, useCurrentUser } from "../hooks";

export const BookPage = () => {
  const params = useParams() as { bookId: string };
  const navigate = useNavigate();
  const api = useApi();
  const currentUser = useCurrentUser();

  const [book, setBook] = useState<Book | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDeleteButtonClick = async () => {
    if (book !== null) {
      try {
        await api.deleteBook(params.bookId);
        navigate("/catalog");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          alert(err);
        }
      }
    }
  };

  useEffect(() => {
    (async function () {
      const book = await api.getBook(params.bookId);
      setBook(book);
    }()).catch((err: unknown) => {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        alert(err);
      }
    });
  }, []);

  return book !== null ? (
  <>
    <title>{book.name}</title>

    <h1>{book.name}</h1>
    <p>{book.description}</p>
    <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
      <label>
        {"Дата публикации: "}
        {new Date(book.created_at).toDateString()}
      </label>
      <label>
        {"Автор публикации: "}
        {book.publisher}
      </label>
    </div>
    {currentUser.isAuthenticated && currentUser.user.role === "admin" && (
    <div style={{ marginTop: "10px", display: "flex", columnGap: "10px" }}>
      <NavLink to={`/catalog/${params.bookId}/edit`}>
        <button>Изменить</button>
      </NavLink>
      <button onClick={handleDeleteButtonClick}>Удалить</button>
    </div>
    )}
  </>
  ) : (
  <p style={{ color: "red" }}>{errorMessage}</p>
  );
};

