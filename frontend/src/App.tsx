import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import {
  AddBookPage,
  BookPage,
  CatalogPage,
  EditBookPage,
  HomePage,
  LoginPage
} from "./pages";
import { Api } from "./api/api";
import { ApiContext, CurrentUser, UserContext } from "./contexts";
import { DefaultLayout } from "./layouts";

export const App = () => {
  const [api, _setApi] = useState<Api>(new Api());
  const [currentUser, setCurrentUser] =
    useState<CurrentUser>({ user: null, isAuthenticated: false });
  const [isPending, setIsPending] = useState<boolean>(true);

  useEffect(() => {
    setIsPending(true);
    (async function () {
      const [isAuthenticated, user] = await api.isUserAuthenticated();
      if (!isAuthenticated) {
        localStorage.removeItem("currentUser");
      }
      setCurrentUser({ isAuthenticated, user } as CurrentUser);
    }()).catch((err) => console.error(err)).finally(() => setIsPending(false));
  }, []);

  return (
    <ApiContext value={api}>
      <UserContext value={currentUser}>

        <BrowserRouter>
          <Routes>
            <Route element={<DefaultLayout />}>
              {!isPending && !currentUser.isAuthenticated && (
              <Route path="/*" element={<LoginPage />} />
              )}
              {!isPending && currentUser.isAuthenticated && (
              <>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/catalog/new" element={<AddBookPage />} />
                <Route path="/catalog/:bookId" element={<BookPage />} />
                <Route path="/catalog/:bookId/edit" element={<EditBookPage />} />
              </>
              )}
            </Route>
          </Routes>
        </BrowserRouter>

      </UserContext>
    </ApiContext>
  );
};

