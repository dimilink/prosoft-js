import React, { useState } from "react";

import { Book } from "../api/api";
import { useApi } from "../hooks";

export type AddBookFormProps = {
  onChange?: () => void;
  onSuccess?: (book: Book) => void;
  onError?: (err: unknown) => void;
};

export const AddBookForm = ({
  onChange = () => {},
  onSuccess = (_b) => {},
  onError = (_e) => {}
}: AddBookFormProps) => {
  const api = useApi();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsPending(true);
    try {
      const book = await api.publishBook({ name, description });

      setName("");
      setDescription("");

      onSuccess(book);
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
      <button type="submit" style={{ marginTop: "10px" }}>Добавить</button>
    </form>
  )
};

