import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "db_demo_type_orm",
  entities: ["src/entities/*.ts"], // Toutes les entités disponibles
  synchronize: true,
  logging: false,
});

export { AppDataSource };
