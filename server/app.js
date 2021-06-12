import cors from "cors";
require('dotenv').config();
import express from "express";
import router from "./src/Routes";
import bodyParser from "body-parser";
import databaseConnect from "./src/database";

const serverPort = process.env.SERVER_PORT || 3001;

async function startServer() {
  await databaseConnect();

  const app = express();
  app.use(cors())
  app.use(bodyParser.json());
  app.use('/', router);

  app.listen(serverPort, () => console.log(`server listening on http://localhost:${serverPort}`));
}

startServer();