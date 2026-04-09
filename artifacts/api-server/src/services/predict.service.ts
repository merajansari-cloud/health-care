import { DISEASES } from "../data/diseases.js";
import type { PredictionResult } from "../types/index.js";

export function predictDiseases(symptoms: string[]): PredictionResult[] {
  const normalizedInput = symptoms.map((s) => s.toLowerCase().trim());

  const scored = DISEASES.map((disease) => {
    const matched = disease.symptoms.filter((ds) =>
      normalizedInput.some((sel) => sel === ds.toLowerCase()),
    );
    const matchCount = matched.length;
    const matchPercent = Math.round(
      (matchCount / disease.symptoms.length) * 100,
    );
    return {
      name: disease.name,
      matchPercent,
      severity: disease.severity,
      recommendation: disease.recommendation,
      specialist: disease.specialist,
      matchedSymptoms: matched,
      description: disease.description,
      _matchCount: matchCount,
    };
  });

  return scored
    .filter((r) => r._matchCount >= 2)
    .sort((a, b) => {
      if (b.matchPercent !== a.matchPercent)
        return b.matchPercent - a.matchPercent;
      return b._matchCount - a._matchCount;
    })
    .slice(0, 5)
    .map(({ _matchCount: _mc, ...rest }) => rest);
}
