import { Request, Response } from "express";
import { AppDataSource } from "../config/dbConfig";
import { Photo } from "../entities/Photo";
import { Author } from "../entities/Author";

/**
 * Enregistrement des données
 * @param req
 * @param res
 */
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

// Systeme de pagination coté serveur
const getPagination = (data: any[], page: number, limit: number) => {
  const totalItems: number = data[1];
  const photos = data[0];
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = page ? page : 0;

  return { totalItems, photos, totalPages, currentPage };
};

/**
 * Parcourir des photos avec pagination
 * @param req
 * @param res
 */
const getAllPhotos = async (req: Request, res: Response) => {
  // Récuperation de la nombre de page et taille via client
  const { page, size } = req.body;

  // Calcule des élément à ignorer
  const offset = page ? +page * +size : 0;

  // Récupération des photos existe dans la base
  const allPhotosAndCount = await AppDataSource.getRepository(
    Photo
  ).findAndCount({
    relations: {
      author: true,
    },
    take: +size,
    skip: offset,
  });

  if (allPhotosAndCount) {
    const response = getPagination(allPhotosAndCount, page, size);
    res.status(200).json(response);
  } else {
    res.status(400).json("Data not found!");
  }
};

/**
 * Mise à jour
 * @param req
 * @param res
 */
const editPhoto = async (req: Request, res: Response) => {
  const photoRepository = AppDataSource.getRepository(Photo);

  const photoToUpdate: any = await photoRepository.findOneBy({
    id: +req.params.id,
  });

  if (photoToUpdate) {
    photoToUpdate.name = req.body.name;
    await photoRepository.save(photoToUpdate);

    res.status(200).json(photoToUpdate);
  }
};

/**
 * Suppression
 * @param req
 * @param res
 */
const deletePhoto = async (req: Request, res: Response) => {
  try {
    const idPhoto: number = +req.params.id;

    const photoToRemove = await AppDataSource.getRepository(Photo).findBy({
      id: idPhoto,
    });

    if (photoToRemove) {
      await AppDataSource.getRepository(Photo).remove(photoToRemove);
      res.status(200).json({ message: "Delete data successfully!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export { savePhoto, getAllPhotos, editPhoto, deletePhoto };
