import React, { FormEvent, useState } from "react";

import { useApi } from "../hooks";

export type LoginFormProps = {
  onChange?: () => void;
  onError?: (err: unknown) => void;
};

export const LoginForm = ({ onChange = () => {}, onError = (_e) => {} }: LoginFormProps) => {
  const api = useApi();

  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsPending(true);
    try {
      await api.authenticateUser({ login, password });
      window.location.reload();
    }
    catch(err: unknown) {
      onError(err);
    }
    finally {
      setIsPending(false);
    }
  };

  return (
    <form onChange={() => { onChange(); }} onSubmit={handleSubmit}>
      <div style={{ display: "flex", flexDirection: "column", rowGap: "10px", width: "400px" }}>
        <input
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) => { setLogin(e.target.value) }}
          disabled={isPending}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => { setPassword(e.target.value) }}
          disabled={isPending}
          required
        />
      </div>
      <button type="submit" style={{ marginTop: "10px" }}>Войти</button>
    </form>
  );
};

