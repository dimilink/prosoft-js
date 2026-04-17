import React, { useState } from "react";
import { NavLink } from "react-router";

import { Book } from "../api/api";
import { useApi } from "../hooks";

export type EditBookFormProps = {
  book: Book;
  onChange?: () => void;
  onSuccess?: (updatedBook: Book) => void;
  onError?: (err: unknown) => void;
};

export const EditBookForm = ({
  book,
  onChange = () => {},
  onSuccess = (_ub) => {},
  onError = (_e) => {}
}: EditBookFormProps) => {
  const api = useApi();

  const [name, setName] = useState<string>(book.name);
  const [description, setDescription] = useState<string>(book.description);
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsPending(true);
    try {
      const updatedBook = await api.updateBook({ bookId: book.id, name, description });

      setName("");
      setDescription("");

      onSuccess(updatedBook);
    } catch (err: unknown) {
      onError(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onChange={() => { onChange(); }} onSubmit={handleSubmit}>
      <div style={{ display: "flex", flexDirection: "column", width: "400px" }}>
        <input
          type="text"
          placeholder="Название"
          value={name}
          onChange={(e) => { setName(e.target.value); }}
          disabled={isPending}
        />
        <textarea
          placeholder="Описание"
          value={description}
          onChange={(e) => { setDescription(e.target.value); }}
          disabled={isPending}
        />
      </div>
      <div style={{ marginTop: "10px", display: "flex", columnGap: "10px" }}>
        <button type="submit">Сохранить</button>
        <NavLink to="/catalog">
          <button>Отмена</button>
        </NavLink>
      </div>
    </form>
  );
};

