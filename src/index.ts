import 'reflect-metadata';
import express from 'express';
import { DataSource } from 'typeorm';
import { Photo } from './entity/Photo';
import { Author } from './entity/Author';
import { photoController } from './controllers/photoController';
import bodyParser from 'body-parser';
import { authorController } from './controllers/authorController';

const app = express();

//Configuration et connexion à la base mysql
export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "db_demo_type_orm",
  entities: [Photo, Author],
  synchronize: true,
  logging: false
})

AppDataSource.initialize()
  .then(res => {
    console.log('connexion réussite');

  }).catch(error => {
    console.log("Erreur de la connexion ==>" + error);
  })

app.use(bodyParser.json());
app.use('/photo', photoController);
app.use('/author', authorController);

app.listen(4572, () => {
  console.log('The application is listening on port 4572!');
})
