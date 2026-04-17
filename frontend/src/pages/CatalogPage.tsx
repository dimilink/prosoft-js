import React, { useEffect, useState } from "react";

import { Book } from "../api/api";
import { Link, NavLink } from "react-router";
import { useApi, useCurrentUser } from "../hooks";

export const CatalogPage = () => {
  const api = useApi();
  const currentUser = useCurrentUser();

  const [books, setBooks] = useState<Book[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    (async function () {
      const books = await api.getBooks();
      setBooks(books);
    }()).catch((err: unknown) => {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        alert(err);
      }
    });
  }, []);

  return (
    <>
      <title>Каталог</title>

      <h1>Каталог</h1>
      <div>
        <div>
          {books.map((b, i) => (
            <>
              <Link key={i} to={`/catalog/${b.id}`}>{b.name}</Link>
              <br />
            </>
          ))}
        </div>
        {currentUser.isAuthenticated && currentUser.user.role === "admin" && (
        <div style={{ marginTop: "10px" }}>
          <NavLink to="/catalog/new">
            <button>Добавить</button>
          </NavLink>
        </div>
        )}
      </div>
      {errorMessage !== null && (
      <p style={{ color: "red" }}>{errorMessage}</p>
      )}
    </>
  )
};

