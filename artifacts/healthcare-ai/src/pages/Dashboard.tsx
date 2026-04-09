import { useState, useMemo } from "react";
import { Search, X, FlaskConical, AlertCircle, CheckCircle2, Info, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
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

interface PredictionResult {
  name: string;
  matchPercent: number;
  severity: Severity;
  recommendation: string;
  specialist: string;
  matchedSymptoms: string[];
  description: string;
}

const SEVERITY_CONFIG = {
  mild: { label: "Mild", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20", icon: CheckCircle2 },
  moderate: { label: "Moderate", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20", icon: Info },
  severe: { label: "Severe", color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-200 dark:border-rose-500/20", icon: AlertCircle },
};

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "").replace(/^\/healthcare-ai/, "") || "";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<PredictionResult[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
  };

  const removeSymptom = (s: string) => {
    setSelected((prev) => prev.filter((x) => x !== s));
    setResults(null);
    setError(null);
  };

  const predict = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selected }),
      });

      const json = await res.json() as { success: boolean; data?: { results: PredictionResult[] }; error?: { message: string } };

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message ?? "Prediction failed. Please try again.");
      }

      const predictions = json.data!.results;
      setResults(predictions);
      setExpanded(predictions.length > 0 ? predictions[0].name : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelected([]);
    setResults(null);
    setSearch("");
    setExpanded(null);
    setError(null);
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
          disabled={selected.length < 2 || loading}
          onClick={predict}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FlaskConical className="h-4 w-4" />
          )}
          {loading ? "Analyzing…" : "Predict Disease"}
        </Button>
        {(selected.length > 0 || results) && (
          <Button size="lg" variant="outline" onClick={reset} disabled={loading}>
            Clear All
          </Button>
        )}
      </div>

      {selected.length === 1 && !results && (
        <p className="text-sm text-muted-foreground">Add at least one more symptom to run a prediction.</p>
      )}

      {/* Error */}
      {error && (
        <Card className="border-rose-200 bg-rose-50 dark:bg-rose-500/10">
          <CardContent className="py-4 flex items-center gap-3 text-rose-600">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
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
              const cfg = SEVERITY_CONFIG[r.severity];
              const SeverityIcon = cfg.icon;
              const isOpen = expanded === r.name;

              return (
                <Card
                  key={r.name}
                  className={`border shadow-sm overflow-hidden transition-all ${idx === 0 ? "border-primary/30 ring-1 ring-primary/10" : "border-card-border/60"}`}
                >
                  <button
                    className="w-full text-left"
                    onClick={() => setExpanded(isOpen ? null : r.name)}
                  >
                    <CardHeader className="py-4 px-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {idx === 0 && (
                            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                              Top Match
                            </span>
                          )}
                          <span className="font-semibold truncate">{r.name}</span>
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
                        {r.description}
                      </p>

                      {/* Matched symptoms */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Matching symptoms ({r.matchedSymptoms.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {r.matchedSymptoms.map((s) => (
                            <span
                              key={s}
                              className="text-xs px-2.5 py-1 rounded-full border bg-primary/10 text-primary border-primary/25 font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border} space-y-1`}>
                        <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${cfg.color}`}>
                          <SeverityIcon className="h-3.5 w-3.5" />
                          Recommendation
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{r.recommendation}</p>
                      </div>

                      {/* Specialist */}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Consult a</span>
                        <span className="font-medium text-primary">{r.specialist}</span>
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
