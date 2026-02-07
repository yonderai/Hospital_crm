"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ClinicalInsightForm() {
    const [loading, setLoading] = useState(false);
    const [insight, setInsight] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        symptoms: "",
        history: "",
        medications: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generateInsight = async () => {
        setLoading(true);
        setError(null);
        setInsight(null);

        try {
            const res = await fetch("http://127.0.0.1:5001/api/clinical-insight", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to generate insight");
            }

            setInsight(data.insight);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle>Clinical Insight Input</CardTitle>
                    <CardDescription>
                        Enter patient data to generate an AI-powered clinical summary.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Symptoms</label>
                        <textarea
                            name="symptoms"
                            className="w-full p-2 border rounded-md min-h-[100px] mt-1 bg-background text-foreground"
                            placeholder="e.g., High fever, persistent cough, fatigue..."
                            value={formData.symptoms}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Medical History</label>
                        <textarea
                            name="history"
                            className="w-full p-2 border rounded-md min-h-[80px] mt-1 bg-background text-foreground"
                            placeholder="e.g., Type 2 Diabetes, Hypertension..."
                            value={formData.history}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Current Medications</label>
                        <textarea
                            name="medications"
                            className="w-full p-2 border rounded-md min-h-[80px] mt-1 bg-background text-foreground"
                            placeholder="e.g., Metformin 500mg, Lisinopril..."
                            value={formData.medications}
                            onChange={handleChange}
                        />
                    </div>

                    <Button
                        onClick={generateInsight}
                        className="w-full"
                        disabled={loading || !formData.symptoms}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            "Generate Insight"
                        )}
                    </Button>

                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                            Error: {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="h-fit">
                <CardHeader>
                    <CardTitle>AI Analysis Result</CardTitle>
                    <CardDescription>
                        Generated clinical insights based on the provided data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {insight ? (
                        <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-wrap bg-muted/50 p-4 rounded-lg border">
                            {insight}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            <span className="text-4xl mb-2">🧠</span>
                            <p>No insight generated yet.</p>
                            <p className="text-xs">Fill the form and click generate.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
