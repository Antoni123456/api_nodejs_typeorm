import { Request, Response } from "express";
import { AppDataSource } from "../index";
import { Author } from "../entities/Author";

// Create author in database
const saveAuthor = async (req: Request, res: Response) => {
  try {
    if (req.body) {
      const name: string = req.body.name;

      const author = new Author();
      author.name = name;

      await AppDataSource.manager.save(author);

      res.status(201).json(author);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all authors
const getAllAuthors = async (req: Request, res: Response) => {
  try {
    const allAuthors = await AppDataSource.getRepository(Author).find({
      relations: {
        photos: true,
      },
    });
    /*.createQueryBuilder("author")
      .leftJoinAndSelect("author.photos", "photo")
      .getMany();*/

    if (allAuthors) {
      res.status(200).json(allAuthors);
    }
  } catch (error) {
    res.status(404).json(error);
  }
};

export { saveAuthor, getAllAuthors };
