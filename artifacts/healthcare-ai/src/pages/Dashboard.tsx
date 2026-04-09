import { useState, useMemo } from "react";
import { Search, X, FlaskConical, AlertCircle, CheckCircle2, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ALL_SYMPTOMS = [
  "Fever", "High Fever", "Chills", "Sweating", "Fatigue", "Weakness",
  "Headache", "Dizziness", "Muscle Pain", "Joint Pain", "Body Ache",
  "Cough", "Dry Cough", "Sore Throat", "Runny Nose", "Nasal Congestion",
  "Shortness of Breath", "Chest Pain", "Chest Tightness",
  "Nausea", "Vomiting", "Diarrhea", "Abdominal Pain", "Stomach Cramps",
  "Loss of Appetite", "Weight Loss", "Bloating",
  "Rash", "Skin Itching", "Eye Redness", "Watery Eyes",
  "Ear Pain", "Difficulty Swallowing", "Swollen Lymph Nodes",
  "Back Pain", "Neck Stiffness", "Frequent Urination", "Excessive Thirst",
  "Pale Skin", "Cold Hands", "Palpitations", "Anxiety",
  "Loss of Taste", "Loss of Smell", "Sneezing", "Night Sweats",
];

type Severity = "mild" | "moderate" | "severe";

interface Disease {
  name: string;
  symptoms: string[];
  description: string;
  severity: Severity;
  recommendation: string;
  specialist: string;
}

const DISEASES: Disease[] = [
  {
    name: "Common Cold",
    symptoms: ["Runny Nose", "Sore Throat", "Cough", "Headache", "Fatigue", "Sneezing", "Nasal Congestion"],
    description: "A viral infection of the upper respiratory tract, usually caused by rhinoviruses.",
    severity: "mild",
    recommendation: "Rest, stay hydrated, and use over-the-counter cold remedies. Usually resolves in 7–10 days.",
    specialist: "General Physician",
  },
  {
    name: "Influenza (Flu)",
    symptoms: ["Fever", "Chills", "Muscle Pain", "Headache", "Fatigue", "Cough", "Sore Throat", "Body Ache"],
    description: "A contagious respiratory illness caused by influenza viruses, typically more severe than a cold.",
    severity: "moderate",
    recommendation: "Rest, fluids, and antiviral medication if caught early. Seek medical attention if symptoms worsen.",
    specialist: "General Physician",
  },
  {
    name: "COVID-19",
    symptoms: ["Fever", "Dry Cough", "Fatigue", "Loss of Taste", "Loss of Smell", "Shortness of Breath", "Muscle Pain", "Headache", "Chills"],
    description: "A respiratory illness caused by SARS-CoV-2, ranging from mild to severe.",
    severity: "moderate",
    recommendation: "Isolate immediately, get tested, and consult a doctor. Monitor oxygen levels closely.",
    specialist: "Infectious Disease Specialist",
  },
  {
    name: "Pneumonia",
    symptoms: ["Fever", "Cough", "Chills", "Shortness of Breath", "Chest Pain", "Fatigue", "Sweating", "Muscle Pain"],
    description: "An infection that inflames the air sacs in one or both lungs, which may fill with fluid.",
    severity: "severe",
    recommendation: "Seek immediate medical attention. Antibiotics (for bacterial) or antivirals may be needed.",
    specialist: "Pulmonologist",
  },
  {
    name: "Dengue Fever",
    symptoms: ["High Fever", "Headache", "Joint Pain", "Muscle Pain", "Rash", "Nausea", "Fatigue", "Eye Redness", "Vomiting"],
    description: "A mosquito-borne viral disease common in tropical regions, causing severe flu-like illness.",
    severity: "severe",
    recommendation: "See a doctor immediately. Stay hydrated, avoid NSAIDs, and monitor platelet count.",
    specialist: "Infectious Disease Specialist",
  },
  {
    name: "Typhoid Fever",
    symptoms: ["Fever", "Headache", "Abdominal Pain", "Diarrhea", "Loss of Appetite", "Nausea", "Weakness", "Sweating"],
    description: "A bacterial infection caused by Salmonella typhi, spread through contaminated food or water.",
    severity: "severe",
    recommendation: "Requires antibiotic treatment. Consult a doctor promptly and maintain strict hygiene.",
    specialist: "Gastroenterologist",
  },
  {
    name: "Malaria",
    symptoms: ["High Fever", "Chills", "Sweating", "Headache", "Muscle Pain", "Nausea", "Fatigue", "Vomiting"],
    description: "A life-threatening disease caused by Plasmodium parasites transmitted through infected mosquitoes.",
    severity: "severe",
    recommendation: "Urgent medical attention required. Antimalarial drugs are essential for treatment.",
    specialist: "Infectious Disease Specialist",
  },
  {
    name: "Gastroenteritis",
    symptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal Pain", "Stomach Cramps", "Fever", "Loss of Appetite", "Weakness"],
    description: "Inflammation of the stomach and intestines, usually caused by a viral or bacterial infection.",
    severity: "mild",
    recommendation: "Rest, oral rehydration salts, and bland diet (BRAT). See a doctor if symptoms persist > 3 days.",
    specialist: "Gastroenterologist",
  },
  {
    name: "Strep Throat",
    symptoms: ["Sore Throat", "Fever", "Difficulty Swallowing", "Swollen Lymph Nodes", "Headache", "Nausea", "Body Ache"],
    description: "A bacterial throat infection caused by group A Streptococcus, requiring antibiotic treatment.",
    severity: "moderate",
    recommendation: "Requires a throat culture test and antibiotics from a doctor. Do not self-medicate.",
    specialist: "ENT Specialist",
  },
  {
    name: "Sinusitis",
    symptoms: ["Headache", "Runny Nose", "Nasal Congestion", "Fatigue", "Sore Throat", "Facial Pain", "Cough", "Fever"],
    description: "Inflammation of the sinuses, causing facial pressure and nasal congestion.",
    severity: "mild",
    recommendation: "Steam inhalation, saline sprays, and decongestants help. Antibiotics if bacterial.",
    specialist: "ENT Specialist",
  },
  {
    name: "Anemia",
    symptoms: ["Fatigue", "Dizziness", "Headache", "Shortness of Breath", "Pale Skin", "Cold Hands", "Weakness", "Palpitations"],
    description: "A condition where the blood lacks enough healthy red blood cells or hemoglobin.",
    severity: "moderate",
    recommendation: "Iron-rich diet, supplements, and blood tests. Underlying cause must be identified.",
    specialist: "Hematologist",
  },
  {
    name: "Hypertension",
    symptoms: ["Headache", "Dizziness", "Chest Pain", "Shortness of Breath", "Palpitations", "Blurred Vision", "Nausea"],
    description: "High blood pressure — a chronic condition that significantly increases risk of heart disease and stroke.",
    severity: "moderate",
    recommendation: "Lifestyle changes and medication. Monitor blood pressure regularly and consult a cardiologist.",
    specialist: "Cardiologist",
  },
  {
    name: "Diabetes (Type 2)",
    symptoms: ["Fatigue", "Weight Loss", "Frequent Urination", "Excessive Thirst", "Blurred Vision", "Weakness", "Dizziness"],
    description: "A metabolic disorder where the body does not use insulin effectively, leading to high blood sugar.",
    severity: "moderate",
    recommendation: "Blood glucose monitoring, dietary changes, exercise, and possible medication.",
    specialist: "Endocrinologist",
  },
  {
    name: "Bronchitis",
    symptoms: ["Cough", "Fatigue", "Shortness of Breath", "Chest Tightness", "Fever", "Sore Throat", "Muscle Pain"],
    description: "Inflammation of the bronchial tubes that carry air to the lungs, causing coughing and mucus.",
    severity: "mild",
    recommendation: "Rest, hydration, and humidifier use. Antibiotics only if bacterial. See a doctor if cough persists > 3 weeks.",
    specialist: "Pulmonologist",
  },
  {
    name: "Migraine",
    symptoms: ["Headache", "Nausea", "Vomiting", "Dizziness", "Fatigue", "Eye Redness", "Anxiety", "Neck Stiffness"],
    description: "A neurological condition causing intense, debilitating headaches often with nausea and sensitivity to light.",
    severity: "moderate",
    recommendation: "Rest in a dark, quiet room. Triptans or pain relievers help. Identify and avoid triggers.",
    specialist: "Neurologist",
  },
  {
    name: "Urinary Tract Infection (UTI)",
    symptoms: ["Frequent Urination", "Abdominal Pain", "Fever", "Back Pain", "Nausea", "Fatigue", "Excessive Thirst"],
    description: "A bacterial infection in any part of the urinary system — kidneys, bladder, ureters, or urethra.",
    severity: "moderate",
    recommendation: "Drink plenty of water and consult a doctor for antibiotics. Do not delay treatment.",
    specialist: "Urologist",
  },
  {
    name: "Allergic Rhinitis",
    symptoms: ["Sneezing", "Runny Nose", "Nasal Congestion", "Eye Redness", "Watery Eyes", "Skin Itching", "Sore Throat", "Fatigue"],
    description: "An allergic response causing cold-like symptoms triggered by allergens like pollen, dust, or pet dander.",
    severity: "mild",
    recommendation: "Avoid allergens, use antihistamines, and nasal corticosteroids. Allergy testing is helpful.",
    specialist: "Allergist / Immunologist",
  },
];

const SEVERITY_CONFIG = {
  mild: { label: "Mild", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20", icon: CheckCircle2 },
  moderate: { label: "Moderate", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20", icon: Info },
  severe: { label: "Severe", color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-200 dark:border-rose-500/20", icon: AlertCircle },
};

interface PredictionResult {
  disease: Disease;
  matchCount: number;
  matchPercent: number;
  matchedSymptoms: string[];
}

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<PredictionResult[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_SYMPTOMS.filter(
      (s) => s.toLowerCase().includes(q) && !selected.includes(s)
    );
  }, [search, selected]);

  const addSymptom = (s: string) => {
    setSelected((prev) => [...prev, s]);
    setSearch("");
    setResults(null);
  };

  const removeSymptom = (s: string) => {
    setSelected((prev) => prev.filter((x) => x !== s));
    setResults(null);
  };

  const predict = () => {
    if (selected.length === 0) return;

    const predictions: PredictionResult[] = DISEASES.map((disease) => {
      const matched = disease.symptoms.filter((ds) =>
        selected.some((sel) => sel.toLowerCase() === ds.toLowerCase())
      );
      const matchCount = matched.length;
      const matchPercent = Math.round((matchCount / disease.symptoms.length) * 100);
      return { disease, matchCount, matchPercent, matchedSymptoms: matched };
    })
      .filter((r) => r.matchCount >= 2)
      .sort((a, b) => {
        if (b.matchPercent !== a.matchPercent) return b.matchPercent - a.matchPercent;
        return b.matchCount - a.matchCount;
      })
      .slice(0, 5);

    setResults(predictions);
    setExpanded(predictions.length > 0 ? predictions[0].disease.name : null);
  };

  const reset = () => {
    setSelected([]);
    setResults(null);
    setSearch("");
    setExpanded(null);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-6 w-6 text-primary" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Disease Prediction</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Select your symptoms to get an AI-powered disease prediction and recommendations.
        </p>
      </div>

      {/* Symptom Selector */}
      <Card className="border-card-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Step 1 — Select Your Symptoms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Type to search symptoms…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Dropdown suggestions */}
          {search.length > 0 && filtered.length > 0 && (
            <div className="border rounded-xl bg-card shadow-md divide-y max-h-52 overflow-y-auto">
              {filtered.slice(0, 12).map((s) => (
                <button
                  key={s}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/60 transition-colors first:rounded-t-xl last:rounded-b-xl"
                  onClick={() => addSymptom(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {search.length > 0 && filtered.length === 0 && (
            <p className="text-sm text-muted-foreground px-1">No matching symptoms found.</p>
          )}

          {/* Quick-pick common symptoms */}
          {search.length === 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Common symptoms</p>
              <div className="flex flex-wrap gap-2">
                {["Fever", "Headache", "Cough", "Fatigue", "Nausea", "Dizziness", "Sore Throat", "Chills", "Muscle Pain", "Rash", "Diarrhea", "Shortness of Breath"].map((s) => (
                  <button
                    key={s}
                    disabled={selected.includes(s)}
                    onClick={() => addSymptom(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/40 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all disabled:opacity-35 disabled:cursor-not-allowed"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected tags */}
          {selected.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                Selected symptoms ({selected.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selected.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="gap-1 pl-3 pr-2 py-1 text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 cursor-default"
                  >
                    {s}
                    <button
                      onClick={() => removeSymptom(s)}
                      className="ml-0.5 hover:text-rose-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Predict Button */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="gap-2 flex-1 sm:flex-none sm:px-10"
          disabled={selected.length < 2}
          onClick={predict}
        >
          <FlaskConical className="h-4 w-4" />
          Predict Disease
        </Button>
        {(selected.length > 0 || results) && (
          <Button size="lg" variant="outline" onClick={reset}>
            Clear All
          </Button>
        )}
      </div>

      {selected.length === 1 && !results && (
        <p className="text-sm text-muted-foreground">Add at least one more symptom to run a prediction.</p>
      )}

      {/* Results */}
      {results !== null && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Step 2 — Prediction Results
            </h2>
            <span className="text-sm text-muted-foreground">
              {results.length > 0 ? `${results.length} possible condition${results.length > 1 ? "s" : ""} found` : "No strong match"}
            </span>
          </div>

          {results.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center">
                <Info className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">No strong disease match found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adding more specific symptoms for a better prediction.
                </p>
              </CardContent>
            </Card>
          ) : (
            results.map((r, idx) => {
              const cfg = SEVERITY_CONFIG[r.disease.severity];
              const SeverityIcon = cfg.icon;
              const isOpen = expanded === r.disease.name;

              return (
                <Card
                  key={r.disease.name}
                  className={`border shadow-sm overflow-hidden transition-all ${idx === 0 ? "border-primary/30 ring-1 ring-primary/10" : "border-card-border/60"}`}
                >
                  <button
                    className="w-full text-left"
                    onClick={() => setExpanded(isOpen ? null : r.disease.name)}
                  >
                    <CardHeader className="py-4 px-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {idx === 0 && (
                            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                              Top Match
                            </span>
                          )}
                          <span className="font-semibold truncate">{r.disease.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {/* Match bar */}
                          <div className="hidden sm:flex items-center gap-2">
                            <div className="w-28 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${r.matchPercent}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground w-10 text-right">
                              {r.matchPercent}%
                            </span>
                          </div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </div>
                    </CardHeader>
                  </button>

                  {isOpen && (
                    <CardContent className="px-5 pb-5 pt-0 space-y-4 border-t border-border/60">
                      {/* Mobile match bar */}
                      <div className="flex sm:hidden items-center gap-2 pt-3">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${r.matchPercent}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {r.matchPercent}% match
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                        {r.disease.description}
                      </p>

                      {/* Matched symptoms */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Matching symptoms ({r.matchedSymptoms.length}/{r.disease.symptoms.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {r.disease.symptoms.map((s) => {
                            const isMatch = r.matchedSymptoms.some(
                              (m) => m.toLowerCase() === s.toLowerCase()
                            );
                            return (
                              <span
                                key={s}
                                className={`text-xs px-2.5 py-1 rounded-full border ${
                                  isMatch
                                    ? "bg-primary/10 text-primary border-primary/25 font-medium"
                                    : "bg-muted/40 text-muted-foreground border-border/50"
                                }`}
                              >
                                {s}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border} space-y-1`}>
                        <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${cfg.color}`}>
                          <SeverityIcon className="h-3.5 w-3.5" />
                          Recommendation
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{r.disease.recommendation}</p>
                      </div>

                      {/* Specialist */}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Consult a</span>
                        <span className="font-medium text-primary">{r.disease.specialist}</span>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center pt-2 border-t">
            This tool is for informational purposes only and is not a substitute for professional medical diagnosis.
            Always consult a qualified healthcare provider.
          </p>
        </div>
      )}
    </div>
  );
}
