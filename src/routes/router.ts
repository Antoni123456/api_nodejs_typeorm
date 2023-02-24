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
  router.post("/api/auth/register", signup);
  router.post("/api/auth/signin", signin);

  // endpoint model Author
  router.post("/api/author", saveAuthor);
  router.get("/author", getAllAuthors);

  // endpoint model Photo
  router.get("/api/photo", [verifyToken, isUser], getAllPhotos);
  router.post("/api/photo", savePhoto);
  router.put("/api/photo/:id", editPhoto);
  router.delete("/api/photo/:id", deletePhoto);

  // endpoint model Iamage
  router.post("/api/upload", uploadFile.single("file"), uploadFiles);

  return app.use("/", router);
};

export { routes };
