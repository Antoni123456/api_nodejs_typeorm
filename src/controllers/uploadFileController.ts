import { Request, Response } from "express";
import { Image } from "../entities/Image";
import fs from "fs";
import { AppDataSource } from "../config/dbConfig";

const uploadFiles = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.json("Yo must select a file");
    }

    const image = new Image();
    image.name = String(req.file?.originalname);
    image.type = String(req.file?.mimetype);
    image.data = fs.readFileSync(
      __dirname + "/resources/static/assets/uploads/" + req.file?.filename
    );

    await AppDataSource.getRepository(Image)
      .save(image)
      .then((result) => {
        fs.writeFileSync(
          __dirname + "/resources/static/assets/tmp/" + result.name,
          result.data
        );
        res.send("File has been uploaded.");

      });
  } catch (error) {
    res.status(500).json(`Error when trying upload images: ${error}`);
  }
};

export { uploadFiles };
