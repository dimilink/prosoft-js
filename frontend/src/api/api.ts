export type User = {
  login: string;
  role: "user" | "admin";
  created_at: string;
};

export type Book = {
  id: string;
  name: string;
  description: string;
  publisher: string;
  created_at: string;
};

export type AuthenticateUserParams = {
  login: string;
  password: string;
};

export type GetBooksOptions = {
  offset?: number;
  count?: number;
  sort?: "name" | "created_at";
  order?: "asc" | "desc";
};

export type PublishBookParams = {
  name: string;
  description: string;
};

export type UpdateBookParams = {
  bookId: string;
  name?: string;
  description?: string;
};

export class Api {
  async authenticateUser(params: AuthenticateUserParams): Promise<void> {
    const response =
      await fetch("/api/auth/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ login: params.login, password: params.password })
      });
    if (response.status !== 200) {
      throw new Error("Не удалось выполнить аутентификацию пользователя.");
    }
  }

  async isUserAuthenticated(): Promise<[true, User] | [false, null]> {
    const response = await fetch("/api/me");
    if (response.status === 401) {
      return [false, null];
    }
    if (response.status !== 200) {
      throw new Error(
        "Не удалось получить информацию о текущем аутентифицированном пользователе."
      );
    }
    return [true, await response.json()];
  }

  async getBooks(opts: GetBooksOptions = {}): Promise<Book[]> {
    const query = new URLSearchParams();
    if (opts.offset !== undefined) {
      query.set("offset", opts.offset.toString());
    }
    if (opts.count !== undefined) {
      query.set("count", opts.count.toString());
    }
    if (opts.sort !== undefined) {
      query.set("sort", opts.sort);
    }
    if (opts.order !== undefined) {
      query.set("order", opts.order);
    }
    const response = await fetch("/api/books");
    if (response.status !== 200) {
      throw new Error("Не удалось запросить информации о книгах в каталоге.");
    }
    return response.json();
  }

  async getBook(bookId: string): Promise<Book | null> {
    const response = await fetch(`/api/books/${bookId}`);
    if (response.status === 404) {
      return null;
    }
    if (response.status !== 200) {
      throw new Error("Не удалось запросить информацию о книге в каталоге.");
    }
    return response.json();
  }

  async publishBook(params: PublishBookParams): Promise<Book> {
    const response =
      await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: params.name,
          description: params.description
        })
      });
    if (response.status !== 201) {
      throw new Error("Не удалось опубликовать информацию о книге в каталоге");
    }
    return response.json();
  }

  async updateBook(params: UpdateBookParams): Promise<Book> {
    const response =
      await fetch(`/api/books/${params.bookId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: params.name,
          description: params.description
        })
      });
    if (response.status !== 200) {
      throw new Error("Не удалось выполнить обновление книги в каталоге.");
    }
    return response.json();
  }

  async deleteBook(bookId: string): Promise<void> {
    const response = await fetch(`/api/books/${bookId}`, { method: "DELETE" });
    if (response.status !== 200) {
      throw new Error("Не удалось выполнить удаление книги из каталога.");
    }
  }
}

