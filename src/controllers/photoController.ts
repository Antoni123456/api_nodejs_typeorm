import { Request, Response } from "express";
import { AppDataSource } from "../config/dbConfig";
import { Photo } from "../entities/Photo";
import { Author } from "../entities/Author";

// Enregistrement des données
const savePhoto = async (req: Request, res: Response) => {
  try {
    if (req.body) {
      const { name, description, filename, views, isPublished } = req.body;
      const nameAuthor: string = req.body.author.name;

      // instanciation d'objet author
      const author = new Author();
      author.name = nameAuthor;

      await AppDataSource.manager.save(author);

      // instanciation d'objet Photo
      const photo = new Photo();
      photo.name = name;
      photo.description = description;
      photo.filename = filename;
      photo.views = views;
      photo.isPublished = isPublished;
      photo.author = author;

      // save in datbase
      await AppDataSource.getRepository(Photo).save(photo);


      res.status(201).json(photo);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Parcourir les données
const getAllPhotos = async (req: Request, res: Response) => {
  const allPhotos = await AppDataSource.getRepository(Photo)
    .createQueryBuilder("photo")
    .innerJoinAndSelect("photo.author", "author")
    .getMany();

  if (allPhotos) {
    res.status(200).json(allPhotos);
  } else {
    res.status(400).json("Data not found!");
  }
};

// Mise à jour
const editPhoto = async (req: Request, res: Response) => {
  const photoRepository = AppDataSource.getRepository(Photo);

  if (req.params.id) {
    const photoToUpdate: any = await photoRepository.findOneBy({
      id: +req.params.id,
    });

    photoToUpdate.name = req.body.name;
    await photoRepository.save(photoToUpdate);

    res.json(photoToUpdate);
  }
};

// Suppression
const deletePhoto = async (req: Request, res: Response) => {
  const idPhoto: number = +req.params.id;

  if (idPhoto) {
    const photoToRemove = await AppDataSource.getRepository(Photo).findBy({
      id: idPhoto,
    });

    if (photoToRemove) {
      await AppDataSource.getRepository(Photo).remove(photoToRemove);
      res.json("Delete data successfully");
    }
  }
};

export { savePhoto, getAllPhotos, editPhoto, deletePhoto };
