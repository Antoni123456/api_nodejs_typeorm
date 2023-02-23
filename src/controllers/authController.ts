import { Request, Response } from "express";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/authConfig";
import { AppDataSource } from "../config/dbConfig";

/**
 * Créer un nouvel utilisateur dans la base de données
 * @param req
 * @param res
 */
const signup = async (req: Request, res: Response) => {
  // Desctructuration de notre body
  const { username, email, password, roles } = req.body;

  // La repository de notre classe User
  const userRepository = AppDataSource.getRepository(User);

  if (username && email && password) {
    // On va instancier la classe User
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = bcrypt.hashSync(password, 8); // ici, on va crypter notre mdp
    user.roles = roles?.length ? roles : ["user"];

    // Avant de persiter dans la base
    // on va verifier si l'user exite dans la base (mot clé = email)
    let userExist = await userRepository.findOne({ where: { email: email } });
    if (userExist) {
      res.status(400).json({ message: "Username is already taken!" });
    } else {
      // Dans le cas contraire, on va persister à la base
      await userRepository.save(user);
      res.status(201).json({ message: "User was registered successfully!" });
    }
  }
  try {
  } catch (error) {
    res.status(500).json(`Erreur: ${error}`);
  }
};

/**
 * Authentification utilisateur
 * @param req
 * @param res
 */
const signin = async (req: Request, res: Response) => {
  try {
    // Verification de l'utilisateur par email ou username
    let user = await AppDataSource.getRepository(User)
      .createQueryBuilder("u")
      .where("u.username = :name", { name: req.body.username })
      .orWhere("u.email = :mail", { mail: req.body.username })
      .getOne();

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Verification du mot de passe
    let passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user?.password as string
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid password!",
      });
    }

    // Signature Token
    let token = jwt.sign({ id: user?.id }, config.secret, {
      expiresIn: 86400, // 1 jour
    });

    // Les infos user à retourner avec Token
    res.status(200).json({
      id: user?.id,
      username: user?.username,
      email: user?.email,
      roles: user?.roles,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json(`Erreur: ${error}`);
  }
};

export { signup, signin };
