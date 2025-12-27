import React, { useState, useCallback, useEffect } from "react";
import { AppStep, AppMode, Pillar, Variation, Course } from "./types";
import { Loading } from "./components/Loading";
import { CourseView } from "./components/CourseView";
import { Sparkles, ArrowRight, BookOpen, PlayCircle, Zap, ZapOff, Eye, Layers } from "lucide-react";
import { mockCourse } from "./mockCourse";
import { APP_DESCRIPTION, APP_CREDITS } from "./src/constants/metadata";

const App: React.FC = () => {
  // ─── STATE ──────────────────────────────────────────────
  const [appMode, setAppMode] = useState<AppMode>("ai"); // Start in AI mode
  const [step, setStep] = useState<AppStep>(AppStep.TOPIC_INPUT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [topic, setTopic] = useState("");
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [course, setCourse] = useState<Course | null>(null);

  // ─── INITIALIZE DEMO MODE ───────────────────────────────
  useEffect(() => {
    if (appMode === "demo" && !course) {
      setCourse(mockCourse);
      setStep(AppStep.COURSE_VIEW);
    }
  }, [appMode, course]);

  // ─── MODE HANDLERS ──────────────────────────────────────

  const switchMode = (newMode: AppMode) => {
    setAppMode(newMode);
    setError(null); // Clear errors when switching modes
    
    // Reset state when switching modes
    setStep(AppStep.TOPIC_INPUT);
    setTopic("");
    setPillars([]);
    setVariations([]);
    setSelectedPillar(null);
    
    if (newMode === "demo") {
      setCourse(mockCourse);
      setStep(AppStep.COURSE_VIEW);
    } else {
      setCourse(null);
    }
  };

  const handleReset = () => {
    // Reset to initial state based on current mode
    setStep(AppStep.TOPIC_INPUT);
    setTopic("");
    setPillars([]);
    setVariations([]);
    setCourse(null);
    setSelectedPillar(null);
    
    if (appMode === "demo") {
      setCourse(mockCourse);
      setStep(AppStep.COURSE_VIEW);
    }
  };

  const handleTopicSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!topic.trim()) return;
      
      setError(null); // Clear previous errors
      
      // Only call AI if mode is "ai"
      if (appMode === "ai") {
        setIsLoading(true);
        try {
          const { generatePillars } = await import("./services/geminiService");
          const data = await generatePillars(topic);
          setPillars(data);
          setStep(AppStep.PILLAR_SELECTION);
          setError(null);
        } catch (error) {
          console.error("Error generando los pilares:", error);
          const errorMessage = error instanceof Error ? error.message : "Error desconocido";
          
          // Check if it's an API key error
          if (errorMessage.includes("VITE_GEMINI_API_KEY") || errorMessage.includes("API key")) {
            setError("API key no configurada. Para usar el Modo IA, configura la variable de entorno VITE_GEMINI_API_KEY en Vercel (Settings → Environment Variables).");
          } else {
            setError(`Error generando los pilares: ${errorMessage}`);
          }
        } finally {
          setIsLoading(false);
        }
      }
      // In "explore" mode, do nothing - let the microcopy explain
    },
    [topic, appMode]
  );

  const handlePillarSelect = useCallback(async (pillar: Pillar) => {
    setSelectedPillar(pillar);
    setError(null);
    
    // Only call AI if mode is "ai"
    if (appMode === "ai") {
      setIsLoading(true);
      try {
        const { generateVariations } = await import("./services/geminiService");
        const data = await generateVariations(pillar);
        setVariations(data);
        setStep(AppStep.VARIATION_SELECTION);
        setError(null);
      } catch (error) {
        console.error("Error generando variaciones:", error);
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        if (errorMessage.includes("VITE_GEMINI_API_KEY") || errorMessage.includes("API key")) {
          setError("API key no configurada. Configura VITE_GEMINI_API_KEY en Vercel.");
        } else {
          setError(`Error generando variaciones: ${errorMessage}`);
        }
      } finally {
        setIsLoading(false);
      }
    }
    // In "explore" mode, do nothing
  }, [appMode]);

  const handleVariationSelect = useCallback(
    async (variation: Variation) => {
      if (!selectedPillar) return;
      setError(null);

      // Only call AI if mode is "ai"
      if (appMode === "ai") {
        setIsLoading(true);
        try {
          const { generateCourse } = await import("./services/geminiService");
          const data = await generateCourse(variation, selectedPillar);
          setCourse(data);
          setStep(AppStep.COURSE_VIEW);
          setError(null);
        } catch (error) {
          console.error("Error generando el curso:", error);
          const errorMessage = error instanceof Error ? error.message : "Error desconocido";
          if (errorMessage.includes("VITE_GEMINI_API_KEY") || errorMessage.includes("API key")) {
            setError("API key no configurada. Configura VITE_GEMINI_API_KEY en Vercel.");
          } else {
            setError(`Error generando el curso: ${errorMessage}`);
          }
        } finally {
          setIsLoading(false);
        }
      } else if (appMode === "explore") {
        // In explore mode, switch to demo as fallback
        switchMode("demo");
      }
    },
    [appMode, selectedPillar]
  );

  // ─── RENDER HELPERS ─────────────────────────────────────

  const renderStepOne = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4">
      <div className="mb-8 p-4 bg-indigo-50 rounded-full">
        <Sparkles className="w-12 h-12 text-indigo-600" />
      </div>

      <h1 className="text-4xl font-bold text-center mb-4">
        ¿Sobre qué quieres aprender hoy?
      </h1>

      <form onSubmit={handleTopicSubmit} className="w-full relative">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-6 pr-16 rounded-2xl border bg-slate-800 text-white"
          placeholder="Ej: Curaduría contemporánea"
        />
        <button
          type="submit"
          className="absolute right-3 top-3 bottom-3 bg-indigo-600 text-white rounded-xl px-4 hover:bg-indigo-700"
        >
          <ArrowRight />
        </button>
      </form>
      
      {/* Microcopy contextual inline - explica el modo actual */}
      {appMode === "explore" && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-xl">
          <p className="text-sm text-blue-800 text-center leading-relaxed">
            <strong>Modo Exploración:</strong> Puedes ingresar un tema y explorar la interfaz. 
            La generación con IA está desactivada. 
            Cambia a <strong>"Modo IA"</strong> en el header para generar cursos, o usa <strong>"Modo Demo"</strong> para ver un ejemplo completo.
          </p>
        </div>
      )}
      
      {appMode === "ai" && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg max-w-xl">
          <p className="text-sm text-green-800 text-center leading-relaxed">
            <strong>Modo IA:</strong> La generación automática con IA está habilitada. 
            Ingresa un tema y se generará un curso completo paso a paso.
          </p>
        </div>
      )}
      
      {/* Error message display */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-lg max-w-xl">
          <p className="text-sm text-red-800 text-center leading-relaxed">
            <strong>Error:</strong> {error}
          </p>
          <p className="text-xs text-red-600 mt-2 text-center">
            Para configurar la API key en Vercel: Settings → Environment Variables → Add VITE_GEMINI_API_KEY
          </p>
        </div>
      )}
    </div>
  );

  const renderStepTwo = () => (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-sm text-red-800 leading-relaxed">
            <strong>Error:</strong> {error}
          </p>
          <p className="text-xs text-red-600 mt-2">
            Para configurar la API key en Vercel: Settings → Environment Variables → Add VITE_GEMINI_API_KEY
          </p>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {pillars.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePillarSelect(p)}
            className="p-6 border rounded-xl text-left hover:border-indigo-600"
          >
            <h3 className="font-bold">{p.title}</h3>
            <p className="text-sm text-slate-600">{p.description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-sm text-red-800 leading-relaxed">
            <strong>Error:</strong> {error}
          </p>
          <p className="text-xs text-red-600 mt-2">
            Para configurar la API key en Vercel: Settings → Environment Variables → Add VITE_GEMINI_API_KEY
          </p>
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-4">
        {variations.map((v) => (
          <button
            key={v.id}
            onClick={() => handleVariationSelect(v)}
            className="p-6 border rounded-xl text-left hover:border-indigo-600"
          >
            <Layers className="mb-2 text-indigo-600" />
            <h3 className="font-bold">{v.title}</h3>
            <p className="text-sm text-slate-600">{v.focus}</p>
          </button>
        ))}
      </div>
    </div>
  );

  // ─── RENDER ─────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <span onClick={handleReset} className="font-bold cursor-pointer hover:text-indigo-600">
          CurriculumLab
        </span>
        <div className="flex items-center gap-2">
          {/* Mode badge */}
          <span className={`text-xs px-2 py-1 rounded ${
            appMode === "demo" 
              ? "bg-indigo-100 text-indigo-700"
              : appMode === "explore"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}>
            {appMode === "demo" && "Modo Demo"}
            {appMode === "explore" && "Modo Exploración"}
            {appMode === "ai" && "Modo IA"}
          </span>
          
          {/* Mode toggle button - toggles between demo and ai */}
          <button
            onClick={() => {
              if (appMode === "demo" || appMode === "explore") {
                switchMode("ai");
              } else {
                switchMode("demo");
              }
            }}
            className="flex items-center gap-2 text-xs border px-3 py-1 rounded hover:bg-slate-50 transition-colors"
          >
            {(appMode === "demo" || appMode === "explore") && (
              <>
                <Zap className="w-3 h-3" />
                Cambiar a modo IA
              </>
            )}
            {appMode === "ai" && (
              <>
                <Eye className="w-3 h-3" />
                Cambiar a modo Demo
              </>
            )}
          </button>
        </div>
      </header>

      <main>
        {isLoading && <Loading message="Cargando..." />}
        {!isLoading && course && (
          <CourseView course={course} onBack={handleReset} />
        )}
        {!isLoading && !course && (appMode === "explore" || appMode === "ai") && step === AppStep.TOPIC_INPUT && renderStepOne()}
        {!isLoading && !course && (appMode === "explore" || appMode === "ai") && step === AppStep.PILLAR_SELECTION && renderStepTwo()}
        {!isLoading && !course && (appMode === "explore" || appMode === "ai") && step === AppStep.VARIATION_SELECTION && renderStepThree()}
      </main>
      
      {/* App Footer with Credits */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <p className="mb-1">{APP_DESCRIPTION}</p>
        <p>{APP_CREDITS}</p>
      </footer>
    </div>
  );
};

export default App;
