import type { Request, Response, NextFunction } from "express";
import { predictDiseases } from "../services/predict.service.js";
import type { PredictRequest } from "../schemas/predict.schema.js";

export function predictController(
  req: Request<object, object, PredictRequest>,
  res: Response,
  next: NextFunction,
): void {
  try {
    const { symptoms } = req.body;

    const results = predictDiseases(symptoms);

    res.json({
      success: true,
      data: {
        results,
        totalMatched: results.length,
        symptomsAnalyzed: symptoms,
      },
    });
  } catch (err) {
    next(err);
  }
}
