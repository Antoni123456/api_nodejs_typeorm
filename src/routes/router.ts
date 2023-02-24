import express from "express";
import { saveAuthor, getAllAuthors } from "../controllers/authorController";
import {
  savePhoto,
  getAllPhotos,
  editPhoto,
  deletePhoto,
} from "../controllers/photoController";
import { uploadFile } from "../middleware/upload";
import { uploadFiles } from "../controllers/uploadFileController";
import { signin, signup } from "../controllers/authController";
import { isUser, verifyToken } from "../middleware/authJwt";

const router = express.Router();

const routes = (app: any) => {
  // endpoint security
  router.post("/auth/register", signup);
  router.post("/auth/signin", signin);

  // endpoint model Author
  router.post("/author", saveAuthor);
  router.get("/author", getAllAuthors);

  // endpoint model Photo
  router.get("/photo", [verifyToken, isUser], getAllPhotos);
  router.post("/photo", savePhoto);
  router.put("/photo/:id", editPhoto);
  router.delete("/photo/:id", deletePhoto);

  // endpoint model Iamage
  router.post("/upload", uploadFile.single("file"), uploadFiles);

  return app.use("/api", router);
};

export { routes };
