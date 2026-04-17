export class UnauthenticatedError extends Error {
  constructor(message: string = "Unauthenticated.", options?: ErrorOptions) {
    super(message, options);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = "Unauthorized.", options?: ErrorOptions) {
    super(message, options);
  }
}

export class LogicError extends Error {
  constructor(message: string = "Logic error.", options?: ErrorOptions) {
    super(message, options);
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Not found.", options?: ErrorOptions) {
    super(message, options);
  }
}

