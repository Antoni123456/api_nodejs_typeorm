import express from "express";
import { saveAuthor, getAllAuthors } from "../controllers/authorController";
import {
  savePhoto,
  getAllPhotos,
  editPhoto,
  deletePhoto,
} from "../controllers/photoController";

const router = express.Router();

const routes = (app: any) => {
  // endpoint model Author
  router.post("/author", saveAuthor);
  router.get("/author", getAllAuthors);

  // endpoint model Photo
  router.get("/photo", getAllPhotos);
  router.post("/photo", savePhoto);
  router.put("/photo/:id", editPhoto);
  router.delete("/photo/:id", deletePhoto);

  return app.use("/", router);
};

export { routes };
