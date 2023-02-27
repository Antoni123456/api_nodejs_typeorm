import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { routes } from "./routes/router";
import { AppDataSource } from "./config/dbConfig";

const app = express();

// Configuration et connexion à la base mysql
AppDataSource.initialize()
  .then(() => {
    console.log("connexion établie");
  })
  .catch((error) => {
    console.log(`Erreur de la connexion: ${error}`);
  });

// Autorisation n'importe quel domaine
app.use(cors());

// Parse application/json
app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);

const port = 4572;
app.listen(port, () => {
  console.log(`The application is listening on port ${port}`);
});
