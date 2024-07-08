import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import { User } from "./modules/user/domain/user";

const app = express();
app.use(express.json());
// INFO: Probably I should run some function with CORS settings
// app.use(cors())
const port = process.env.PORT || 3000;

const prisma = new PrismaClient();

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

const emailQuerySchema = Joi.object({
  email: Joi.string().email().required(),
});

const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message,
    }));

    console.log(errors);

    return res
      .status(400)
      .json({ error: Errors.ValidationError, data: undefined, success: false });
  }

  next();
};

const Errors = {
  UsernameAlreadyTaken: "UserNameAlreadyTaken",
  EmailAlreadyInUse: "EmailAlreadyInUse",
  ValidationError: "ValidationError",
  ServerError: "ServerError",
  ClientError: "ClientError",
  UserNotFound: "UserNotFound",
};

function generateRandomPassword(length: number): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const passwordArray = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    passwordArray.push(charset[randomIndex]);
  }

  return passwordArray.join("");
}

function parseUserForResponse(user: User) {
  const returnData = JSON.parse(JSON.stringify(user));
  delete returnData.password;

  return returnData;
}

// INFO: Request body: email, username, firstName, lastName
app.post("/users/new", validateUser, async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    const existingUserByEmail = await prisma.user.findFirst({
      where: { email: userData.email },
    });

    if (existingUserByEmail) {
      return res.status(409).json({
        error: Errors.EmailAlreadyInUse,
        data: undefined,
        success: false,
      });
    }

    const existingUserByUsername = await prisma.user.findFirst({
      where: { username: userData.username },
    });

    if (existingUserByUsername) {
      return res.status(409).json({
        error: Errors.UsernameAlreadyTaken,
        data: undefined,
        success: false,
      });
    }

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: generateRandomPassword(10),
      },
    });

    console.log(user);

    await prisma.$disconnect();

    return res.status(201).json({
      error: undefined,
      data: parseUserForResponse(user),
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: Errors.ServerError,
      data: undefined,
      success: false,
    });
  }
});

app.post(
  "/users/edit/:userId",
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const userData = req.body;
      const paramUserId = parseInt(req.params.userId);

      const userById = await prisma.user.findFirst({
        where: { id: paramUserId },
      });

      if (!userById) {
        return res.status(404).json({
          error: Errors.UserNotFound,
          data: undefined,
          success: false,
        });
      }

      const userByUserName = await prisma.user.findFirst({
        where: { username: userData.username },
      });

      if (userByUserName && userByUserName.id !== paramUserId) {
        return res.status(409).json({
          error: Errors.UsernameAlreadyTaken,
          data: undefined,
          success: false,
        });
      }

      const userByEmail = await prisma.user.findFirst({
        where: { email: userData.email },
      });

      if (userByEmail && userByEmail.id !== paramUserId) {
        return res.status(409).json({
          error: Errors.EmailAlreadyInUse,
          data: undefined,
          success: false,
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: paramUserId },
        data: {
          ...userData,
        },
      });

      console.log(updatedUser);

      await prisma.$disconnect();

      return res.status(200).json({
        error: undefined,
        data: parseUserForResponse(updatedUser),
        success: true,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        error: Errors.ServerError,
        data: undefined,
        success: false,
      });
    }
  }
);

app.get("/users", async (req: Request, res: Response) => {
  try {
    const { error, value: queryParams } = emailQuerySchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    }

    const userByEmail = await prisma.user.findFirst({
      where: { email: queryParams.email },
    });

    if (!userByEmail) {
      return res.status(404).json({
        error: Errors.UserNotFound,
        data: undefined,
        success: false,
      });
    }

    return res.status(200).json({
      error: undefined,
      data: parseUserForResponse(userByEmail),
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: Errors.ServerError,
      data: undefined,
      success: false,
    });
  }
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
