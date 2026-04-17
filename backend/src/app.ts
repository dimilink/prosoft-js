import Fastify from "fastify";
import crypto, { UUID } from "crypto";
import { fastifyCookie } from "@fastify/cookie";
import { fastifySession } from "@fastify/session";

import { LogicError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "@/errors";
import { constants } from "@/constants";

type User = {
  login: string;
  role: "user" | "admin";
  passwordHash: Buffer;
  createdAt: Date;
}

type Book = {
  id: UUID;
  name: string;
  description: string;
  publisher: string;
  createdAt: Date;
}

type PostAuthUserBody = {
  login: string;
  password: string;
}

type GetBooksQuery = {
  offset: number;
  count: number;
  start_date: string;
  end_date: string;
  sort: "name" | "created_at";
  order: "asc" | "desc";
}

type PostBooksBody = {
  name: string;
  description: string;
}

type GetBookParams = {
  bookId: string;
}

type PatchBookParams = {
  bookId: string;
}

type PatchBookBody = {
  name?: string;
  description?: string;
}

type DeleteBookParams = {
  bookId: string;
}

const users: Map<string, User> = new Map([
  ["user", {
    login: "user",
    role: "user",
    passwordHash: Buffer.from(
      "04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb",
      "hex"
    ), // "user"
    createdAt: new Date("2025-12-13")
  }],
  ["admin", {
    login: "admin",
    role: "admin",
    passwordHash: Buffer.from(
      "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
      "hex"
    ), // "admin"
    createdAt: new Date("2025-12-13")
  }]
]);
const books: Map<UUID, Book> = new Map([
  ["621347fc-c1c7-4414-a783-9396252ca7cb", {
    id: "621347fc-c1c7-4414-a783-9396252ca7cb",
    name: `Окружающий мир, Буква-Ленд, сборник шпаргалок 1-4 класс, ФГОС. Соколова Юлия Сергеевна`,
    description: `\
Пособие предназначено для учеников начальной школы и их родителей, охватывает материалы, \
полезные для детей с 1 по 4 класс.`,
    publisher: "admin",
    createdAt: new Date("2025-12-11")
  }],
  ["157ceca7-185b-4005-9af5-45f12e9231cb", {
    id: "157ceca7-185b-4005-9af5-45f12e9231cb",
    name: `Самоучитель английского языка. Английский с нуля. Учебник. Бебрис Александр Олегович`,
    description: `\
Простой и понятный пошаговый подход, системные упражнения и формулы делают \
обучение лёгким и доступным для каждого. Методика успешно протестирована на \
фокус-группах разных возрастов и поможет вам быстро достичь результата, даже \
если у вас нет времени на занятия с репетитором. \
Не важно, с какого уровня вы начинаете. Главное — ваша цель.`,
    publisher: "admin",
    createdAt: new Date("2025-12-12")
  }],
  ["16cc7e9b-64e6-4238-b43d-2a47bc22fa9a", {
    id: "16cc7e9b-64e6-4238-b43d-2a47bc22fa9a",
    name: `Игры, в которые играют люди. Люди, которые играют в игры. Психология. Берн Эрик`,
    description: `\
Книга американского психолога и психиатра Эрика Берна, опубликованная в 1964 году, в основе \
которой лежит его работа, посвящённая трансакционному анализу. С момента публикации было продано \
более пяти миллионов экземпляров.`,
    publisher: "admin",
    createdAt: new Date("2025-12-13")
  }],
]);


const app = Fastify();

app.register(fastifyCookie);
app.register(fastifySession, {
  secret: constants.COOKIE_SECRET,
  cookieName: "us",
  cookie: {
    path: "/api",
    secure: false,
    maxAge: 86400000 // 1 день
  }
});

app.removeContentTypeParser("text/plain");

app.addHook("preHandler", (req, _reply, next) => {
  if (req.session.isAuthenticated === undefined) {
    req.session.login = "";
    req.session.isAuthenticated = false
  }
  next();
});

app.get("/api/health", (_req, reply) => {
  reply.send();
});

app.post<{ Body: PostAuthUserBody }>("/api/auth/user", {
  schema: {
    body: {
      type: "object",
      properties: {
        login: { type: "string" },
        password: { type: "string" }
      },
      required: ["login", "password"]
    }
  }
}, (req, reply) => {
  if (req.session.isAuthenticated) {
    throw new UnauthorizedError();
  }

  const { login, password } = req.body;
  const user: User | undefined = users.get(login);
  if (user === undefined) {
    throw new LogicError("Failed to find user with the specified login.");
  }
  if (!user.passwordHash.equals(crypto.hash("sha256", password, "buffer"))) {
    throw new UnauthorizedError();
  }

  req.session.login = user.login;
  req.session.isAuthenticated = true;

  reply.send({
    login: user.login,
    role: user.role,
    created_at: user.createdAt.toISOString()
  });
});

app.get("/api/me", (req, reply) => {
  if (!req.session.isAuthenticated) {
    throw new UnauthenticatedError();
  }

  const user: User | undefined = users.get(req.session.login);
  if (user === undefined) {
    throw new LogicError("Failed to find user with the specified login.");
  }

  reply.send({
    login: user.login,
    role: user.role,
    created_at: user.createdAt.toISOString()
  });
});

app.get<{ Querystring: GetBooksQuery }>("/api/books", {
  schema: {
    querystring: {
      type: "object",
      properties: {
        offset: {
          type: "number",
          minimum: 0,
          default: 0
        },
        count: {
          type: "number",
          minimum: 0,
          maximum: 100,
          default: 15
        },
        sort: {
          type: "string",
          enum: ["name", "created_at"],
          default: "created_at"
        },
        order: {
          type: "string",
          enum: ["asc", "desc"],
          default: "desc"
        }
      }
    },
  }
}, (req, reply) => {
  if (!req.session.isAuthenticated) {
    throw new UnauthenticatedError();
  }

  const result: Book[] =
    Array.from(books.values())
      .sort((a, b) => {
        if (req.query.sort === "name") {
          if (req.query.order === "asc") {
            return a.name.localeCompare(b.name);
          }
          return -a.name.localeCompare(b.name);
        }
        if (req.query.order === "asc") {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      })
      .slice(req.query.offset, req.query.offset + req.query.count);

    reply.header("X-Total-Count", books.size);
    reply.send(result.map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      publisher: b.publisher,
      created_at: b.createdAt.toISOString()
    })));
});

app.post<{ Body: PostBooksBody }>("/api/books", {
  schema: {
    body: {
      type: "object",
      properties: {
        name: {
          type: "string",
          pattern: "^[a-zA-Zа-яА-Я\d,;:.!?'\"\-— /()\\[\\]]+$"
        },
        description: {
          type: "string",
          pattern: "^[a-zA-Zа-яА-Я\d,;:.!?'\"\-— /()\\[\\]]+$"
        }
      },
      required: ["name", "description"]
    }
  }
}, (req, reply) => {
  if (!req.session.isAuthenticated) {
    throw new UnauthenticatedError();
  }
  const user: User | undefined = users.get(req.session.login);
  if (user === undefined) {
    throw new Error(`Failed to find user '${req.session.login}'.`);
  }
  if (user.role !== "admin") {
    throw new UnauthorizedError();
  }

  const book: Book = {
    id: crypto.randomUUID(),
    name: req.body.name,
    description: req.body.description,
    publisher: req.session.login,
    createdAt: new Date()
  };
  books.set(book.id, book);

  reply.status(201);
  reply.header("Location", `http://${constants.HOSTNAME}:${constants.PORT}/books/${book.id}`);
  reply.send({
    id: book.id,
    name: book.name,
    description: book.description,
    publisher: book.publisher,
    created_at: book.createdAt.toISOString()
  });
});

app.get<{ Params: GetBookParams }>("/api/books/:bookId", {
  schema: {
    params: {
      type: "object",
      properties: {
        bookId: {
          type: "string",
          format: "uuid"
        }
      },
      required: ["bookId"]
    }
  }
}, (req, reply) => {
  if (!req.session.isAuthenticated) {
    throw new UnauthenticatedError();
  }

  const book: Book | undefined = books.get(req.params.bookId as UUID);
  if (book === undefined) {
    throw new NotFoundError("Book with the specified identifier does not exist.");
  }

  reply.send({
    id: book.id,
    name: book.name,
    description: book.description,
    publisher: book.publisher,
    created_at: book.createdAt.toISOString()
  });
});

app.patch<{ Params: PatchBookParams, Body: PatchBookBody }>("/api/books/:bookId", {
  schema: {
    params: {
      type: "object",
      properties: {
        bookId: {
          type: "string",
          format: "uuid"
        }
      },
      required: ["bookId"]
    },
    body: {
      type: "object",
      properties: {
        name: {
          type: "string",
          pattern: "^[a-zA-Zа-яА-Я\d,;:.!?'\"\-— /()\\[\\]]+$"
        },
        description: {
          type: "string",
          pattern: "^[a-zA-Zа-яА-Я\d,;:.!?'\"\-— /()\\[\\]]+$"
        }
      }
    }
  }
}, (req, reply) => {
  if (!req.session.isAuthenticated) {
    throw new UnauthenticatedError();
  }
  const user: User | undefined = users.get(req.session.login);
  if (user === undefined) {
    throw new Error(`Failed to find user '${req.session.login}'.`);
  }
  if (user.role !== "admin") {
    throw new UnauthorizedError();
  }

  const book: Book | undefined = books.get(req.params.bookId as UUID);
  if (book === undefined) {
    throw new NotFoundError("Book with the specified identifier does not exist.");
  }
  if (req.body.name !== undefined) {
    book.name = req.body.name;
  }
  if (req.body.description !== undefined) {
    book.description = req.body.description
  }

  reply.send({
    id: book.id,
    name: book.name,
    description: book.description,
    publisher: book.publisher,
    created_at: book.createdAt.toISOString()
  });
});

app.delete<{ Params: DeleteBookParams }>("/api/books/:bookId", {
  schema: {
    params: {
      type: "object",
      properties: {
        bookId: {
          type: "string",
          format: "uuid"
        }
      },
      required: ["bookId"]
    }
  }
}, (req, reply) => {
  if (!req.session.isAuthenticated) {
    throw new UnauthenticatedError();
  }
  const user: User | undefined = users.get(req.session.login);
  if (user === undefined) {
    throw new Error(`Failed to find user '${req.session.login}'.`);
  }
  if (user.role !== "admin") {
    throw new UnauthorizedError();
  }
  if (!books.has(req.params.bookId as UUID)) {
    throw new NotFoundError("Book with the specified identifier does not exist.");
  }

  books.delete(req.params.bookId as UUID);

  reply.send();
});

app.setErrorHandler((err, _req, reply) => {
  if (err instanceof UnauthenticatedError) {
    reply.status(401);
    reply.send({ message: err.message });
  } else if (err instanceof UnauthorizedError) {
    reply.status(403);
    reply.send({ message: err.message });
  } else if (err instanceof LogicError) {
    reply.status(400);
    reply.send({ message: err.message });
  } else {
    console.log(err);

    reply.status(500);
    reply.send({ message: "Internal server error." });
  }
});

export { app };

