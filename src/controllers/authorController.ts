import express, { Request, Response } from "express";
import { AppDataSource } from "../index";
import { Author } from "../entity/Author";

const router = express.Router();

// Create author for in database
router.post("/", async (req: Request, res: Response) => {
  try {
    if (req.body) {
      const name: string = req.body.name;

      const author = new Author();
      author.name = name;

      await AppDataSource.manager.save(author);

      return res.status(201).json(author);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Get all authors
router.get("/", async (req: Request, res: Response) => {
  try {
    const allAuthors = await AppDataSource.getRepository(Author)
      .createQueryBuilder("author")
      .leftJoinAndSelect("author.photos", "photo")
      .getMany();

    if (allAuthors) {
      return res.status(200).json(allAuthors);
    }
  } catch (error) {
    return res.status(404).json(error);
  }
});

export { router as authorController };
