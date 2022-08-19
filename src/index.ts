import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import { routes } from "./routes/router";
import { AppDataSource } from "./config/dbConfig";

const app = express();

//Configuration et connexion à la base mysql
AppDataSource.initialize()
  .then((res) => {
    console.log("connexion établie");
  })
  .catch((error) => {
    console.log("Erreur de la connexion ==> " + error);
  });

app.use(bodyParser.json());
routes(app);

const port = 4572;
app.listen(port, () => {
  console.log("The application is listening on port " + port);
});
