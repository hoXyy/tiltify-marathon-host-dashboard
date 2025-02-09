/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware to handle Prisma errors
 */
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Prisma Error:", err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": // Unique constraint violation
        res
          .status(400)
          .json({ error: "Duplicate entry. This record already exists." });
        return;
      case "P2025": // Record not found
        res.status(404).json({ error: "Record not found." });
        return;
      default:
        res.status(400).json({ error: `Database error: ${err.message}` });
        return;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({ error: "Invalid data format." });
    return;
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    res.status(500).json({ error: "Database connection failed." });
    return;
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    res.status(500).json({ error: "Critical database error." });
    return;
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    res.status(500).json({ error: "Unknown database error occurred." });
    return;
  }

  // Default fallback error
  res.status(500).json({ error: "Something went wrong." });
  return;
};

export default errorHandler;
