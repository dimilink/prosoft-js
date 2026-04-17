type Constants = {
  HOSTNAME: string;
  PORT: number;
  COOKIE_SECRET: string;
}

const constants: Constants = {
  HOSTNAME: "0.0.0.0",
  PORT: 8080,
  COOKIE_SECRET: process.env.COOKIE_SECRET ?? "",
};

export { constants };

