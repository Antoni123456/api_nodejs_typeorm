import { DataSource } from "typeorm";
import { Photo } from "../entities/Photo";
import { Author } from "../entities/Author";

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "db_demo_type_orm",
  entities: [Photo, Author],
  synchronize: true,
  logging: false,
});

export { AppDataSource };
