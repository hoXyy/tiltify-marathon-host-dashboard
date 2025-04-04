import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next(); // If validation passes, proceed to next middleware
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ errors: err.errors });
        return;
      }
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  };

export default validate;
