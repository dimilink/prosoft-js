import { app } from "@/app"
import { constants } from "@/constants";

app.listen({ port: constants.PORT, host: constants.HOSTNAME }, (err: Error | null) => {
  if (err !== null) {
    throw err;
  }
  console.log(`Server is listening on http://${constants.HOSTNAME}:${constants.PORT}.`);
});

process.on("SIGTERM", async () => {
  await app.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await app.close();
  process.exit(0)
});

