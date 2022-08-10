import express, { Request, Response } from "express";
import { AppDataSource } from "../index";
import { Photo } from "../entity/Photo";
import { Author } from "../entity/Author";

const router = express.Router();

// Enregistrement des données
router.post("/", async (req: Request, res: Response) => {
  try {
    if (req.body) {
      const { name, description, filename, views, isPublished } = req.body;
      const nameAuthor: string = req.body.author.name;

      // instanciation objet author
      const author = new Author();
      author.name = nameAuthor;

      await AppDataSource.manager.save(author);

      // instanciation de notre objet Photo
      const photo = new Photo();
      photo.name = name;
      photo.description = description;
      photo.filename = filename;
      photo.views = views;
      photo.isPublished = isPublished;
      photo.author = author;

      const photoRepository = AppDataSource.getRepository(Photo);
      await photoRepository.save(photo);

      return res.status(201).json(photo);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Parcourir les données
router.get("/", async (req: Request, res: Response) => {
  const allPhotos = await AppDataSource.getRepository(Photo)
    .createQueryBuilder("photo")
    .innerJoinAndSelect("photo.author", "author")
    .getMany();

  if (allPhotos) {
    return res.status(200).json(allPhotos);
  } else {
    return res.status(400).json("Data not found!");
  }
});

// Mise à jour
router.put("/:id", async (req: Request, res: Response) => {
  const photoRepository = AppDataSource.getRepository(Photo);

  if (req.params.id) {
    const photoToUpdate: any = await photoRepository.findOneBy({
      id: +req.params.id,
    });

    photoToUpdate.name = req.body.name;
    await photoRepository.save(photoToUpdate);

    return res.json(photoToUpdate);
  }
});

// Suppression
router.delete("/:id", async (req, res) => {
  const photoRepository = AppDataSource.getRepository(Photo);

  const idPhoto: number = +req.params.id;

  if (idPhoto) {
    const photoToRemove = await photoRepository.findBy({ id: idPhoto });
    await photoRepository.remove(photoToRemove);

    return res.json("Delete data successfully");
  }
});

export { router as photoController };
