
import React, { useState, useEffect } from 'react';
import { Course, CourseModule, QuizQuestion } from '../types';
import { BookOpen, Target, Palette, ArrowLeft, CheckCircle, XCircle, ImageIcon, Loader2, Download, FileJson, FileText, ChevronDown, Globe, GraduationCap } from 'lucide-react';
import { generateStaticSite, generateCanvasHTML, generateStaticSiteZIP, generateCanvasZIP } from '../services/exportService';
import { APP_ATTRIBUTION, APP_CREDITS } from '../src/constants/metadata';

// Stub function for demo mode - no Gemini SDK required
const generateImage = async (prompt: string): Promise<string> => {
  // In demo mode, return a placeholder or skip image generation
  // This prevents the Gemini SDK from being loaded in the browser
  return Promise.resolve('');
};

interface CourseViewProps {
  course: Course;
  onBack: () => void;
}

export const CourseView: React.FC<CourseViewProps> = ({ course, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | number>('overview');
  const [moduleImages, setModuleImages] = useState<Record<number, string>>({});
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showCanvasInstructions, setShowCanvasInstructions] = useState(false);
  const [showStaticInstructions, setShowStaticInstructions] = useState(false);

  const handleImageGeneration = async (moduleIndex: number, prompt: string) => {
    if (moduleImages[moduleIndex] || loadingImages[moduleIndex]) return;

    setLoadingImages(prev => ({ ...prev, [moduleIndex]: true }));
    try {
      const imageUrl = await generateImage(prompt);
      setModuleImages(prev => ({ ...prev, [moduleIndex]: imageUrl }));
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setLoadingImages(prev => ({ ...prev, [moduleIndex]: false }));
    }
  };

  useEffect(() => {
    if (typeof activeTab === 'number') {
      const module = course.modules[activeTab];
      if (module && module.visualPrompt) {
        handleImageGeneration(activeTab, module.visualPrompt);
      }
    }
  }, [activeTab, course.modules]);

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const exportToJson = () => {
    const courseWithMetadata = {
      ...course,
      metadata: {
        exportedAt: new Date().toISOString(),
        exportedWith: "CurriculumLab",
        credits: {
          attribution: APP_ATTRIBUTION,
          author: "Patricia Valladares",
          year: 2025,
          tool: "CurriculumLab"
        }
      }
    };
    const jsonString = JSON.stringify(courseWithMetadata, null, 2);
    downloadFile(jsonString, `${course.title.replace(/\s+/g, '_')}.json`, 'application/json');
  };

  const exportCourseForLMS = () => {
    const jsonString = JSON.stringify(course, null, 2);
    const fileName = `${course.title.replace(/\s+/g, '_')}.json`;
    downloadFile(jsonString, fileName, 'application/json');
  };

  const generateMarkdown = (targetCourse: Course) => {
    let md = `# ${targetCourse.title}\n\n`;
    md += `${targetCourse.description}\n\n`;
    md += `## Detalles del Curso\n`;
    md += `**Público Objetivo:** ${targetCourse.targetAudience}\n`;
    md += `**Estética Sugerida:** ${targetCourse.colorPalette}\n\n`;
    md += `### Objetivos de Aprendizaje\n`;
    targetCourse.learningObjectives.forEach(obj => md += `- ${obj}\n`);
    md += `\n---\n\n`;

    targetCourse.modules.forEach((mod, idx) => {
      md += `## Módulo ${idx + 1}: ${mod.title}\n`;
      md += `### ${mod.subtitle}\n\n`;
      md += `${mod.description}\n\n`;
      md += `#### Puntos Clave\n`;
      mod.keyPoints.forEach(kp => md += `- ${kp}\n`);
      md += `\n#### Evaluación\n`;
      mod.quiz.forEach((q, qIdx) => {
        md += `${qIdx + 1}. ${q.question}\n`;
        q.options.forEach(opt => md += `   - ${opt.label}) ${opt.text}\n`);
        md += `   *Respuesta Correcta: ${q.correctLabel}*\n\n`;
      });
      md += `\n---\n\n`;
    });

    return md;
  };

  const exportToMarkdown = () => {
    const mdString = generateMarkdown(course);
    downloadFile(mdString, `${course.title.replace(/\s+/g, '_')}.md`, 'text/markdown');
  };

  const exportModuleToMarkdown = (moduleIndex: number) => {
    const mod = course.modules[moduleIndex];
    let md = `# ${mod.title}\n`;
    md += `## ${mod.subtitle}\n\n`;
    md += `${mod.description}\n\n`;
    md += `### Puntos Clave\n`;
    mod.keyPoints.forEach(kp => md += `- ${kp}\n`);
    md += `\n### Evaluación\n`;
    mod.quiz.forEach((q, qIdx) => {
      md += `${qIdx + 1}. ${q.question}\n`;
      q.options.forEach(opt => md += `   - ${opt.label}) ${opt.text}\n`);
      md += `   *Respuesta Correcta: ${q.correctLabel}*\n\n`;
    });
    
    downloadFile(md, `Modulo_${moduleIndex + 1}_${mod.title.replace(/\s+/g, '_')}.md`, 'text/markdown');
  };

  const exportModuleToJson = (moduleIndex: number) => {
    const mod = course.modules[moduleIndex];
    const standaloneModule = {
      module: {
        id: mod.id,
        title: mod.title,
        subtitle: mod.subtitle,
        description: mod.description,
        keyPoints: mod.keyPoints,
        visualPrompt: mod.visualPrompt,
        quiz: mod.quiz
      },
      courseContext: {
        courseTitle: course.title,
        courseDescription: course.description,
        targetAudience: course.targetAudience,
        modulePosition: moduleIndex + 1,
        totalModules: course.modules.length
      },
      metadata: {
        exportedAt: new Date().toISOString(),
        format: "standalone-learning-object",
        version: "1.0"
      }
    };
    
    const jsonString = JSON.stringify(standaloneModule, null, 2);
    downloadFile(jsonString, `Modulo_${moduleIndex + 1}_${mod.title.replace(/\s+/g, '_')}.json`, 'application/json');
  };

  const exportToStaticSite = async () => {
    try {
      const zipBlob = await generateStaticSiteZIP(course, moduleImages);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${course.title.replace(/\s+/g, '_')}_sitio_web.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setShowStaticInstructions(true);
    } catch (error) {
      console.error('Error generando ZIP:', error);
      alert('Error al generar el paquete ZIP. Por favor, intenta de nuevo.');
    }
  };

  const exportToCanvas = async () => {
    try {
      const zipBlob = await generateCanvasZIP(course, moduleImages);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${course.title.replace(/\s+/g, '_')}_canvas.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setShowCanvasInstructions(true);
    } catch (error) {
      console.error('Error generando ZIP:', error);
      alert('Error al generar el paquete ZIP. Por favor, intenta de nuevo.');
    }
  };

  const exportModuleToHTML = (moduleIndex: number) => {
    const mod = course.modules[moduleIndex];
    const imageData = moduleImages[moduleIndex] || '';
    
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${mod.title} - Módulo de Aprendizaje</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #334155;
            background: #f8fafc;
            padding: 2rem;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            padding: 2rem;
        }
        .header h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        .header .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        .content {
            padding: 2rem;
        }
        .image-container {
            width: 100%;
            margin: 1.5rem 0;
            border-radius: 0.5rem;
            overflow: hidden;
            background: #f1f5f9;
            aspect-ratio: 16/9;
        }
        .image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .description {
            font-size: 1.1rem;
            color: #475569;
            margin-bottom: 2rem;
            line-height: 1.8;
        }
        .section {
            margin: 2rem 0;
        }
        .section h2 {
            color: #1e293b;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e2e8f0;
        }
        .key-points {
            list-style: none;
        }
        .key-points li {
            background: #f8fafc;
            padding: 1rem;
            margin: 0.75rem 0;
            border-radius: 0.5rem;
            border-left: 4px solid #10b981;
            padding-left: 1.25rem;
        }
        .quiz {
            background: #f8fafc;
            padding: 1.5rem;
            border-radius: 0.5rem;
            margin: 1rem 0;
        }
        .quiz-question {
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: #1e293b;
        }
        .quiz-options {
            list-style: none;
            margin-left: 1rem;
        }
        .quiz-options li {
            padding: 0.5rem 0;
            color: #475569;
        }
        .quiz-answer {
            margin-top: 0.5rem;
            font-size: 0.9rem;
            color: #059669;
            font-weight: 500;
        }
        .metadata {
            background: #f1f5f9;
            padding: 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            color: #64748b;
            margin-top: 2rem;
        }
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${mod.title}</h1>
            <div class="subtitle">${mod.subtitle}</div>
        </div>
        <div class="content">
            ${imageData ? `<div class="image-container"><img src="${imageData}" alt="${mod.title}" /></div>` : ''}
            <div class="description">${mod.description}</div>
            
            <div class="section">
                <h2>Puntos Clave</h2>
                <ul class="key-points">
                    ${mod.keyPoints.map(kp => `<li>${kp}</li>`).join('')}
                </ul>
            </div>
            
            <div class="section">
                <h2>Evaluación del Módulo</h2>
                ${mod.quiz.map((q, idx) => `
                    <div class="quiz">
                        <div class="quiz-question">${idx + 1}. ${q.question}</div>
                        <ul class="quiz-options">
                            ${q.options.map(opt => `<li>${opt.label}) ${opt.text}</li>`).join('')}
                        </ul>
                        <div class="quiz-answer">✓ Respuesta Correcta: ${q.correctLabel}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="metadata">
                <strong>Contexto del Curso:</strong> ${course.title}<br>
                <strong>Módulo:</strong> ${moduleIndex + 1} de ${course.modules.length}<br>
                <strong>Exportado:</strong> ${new Date().toLocaleString('es-ES')}
            </div>
        </div>
    </div>
</body>
</html>`;
    
    downloadFile(html, `Modulo_${moduleIndex + 1}_${mod.title.replace(/\s+/g, '_')}.html`, 'text/html');
  };

  return (
    <>
      {/* Static Site Instructions Modal */}
      {showStaticInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-6 h-6 text-indigo-500" />
                Cómo desplegar el sitio web estático
              </h3>
              <button
                onClick={() => setShowStaticInstructions(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-sm text-slate-700">
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <p className="font-semibold text-indigo-900 mb-2">Opción 1: GitHub Pages (Recomendado)</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Crea un nuevo repositorio en GitHub</li>
                  <li>Sube el archivo HTML descargado</li>
                  <li>Ve a Settings → Pages</li>
                  <li>Selecciona la rama main y carpeta / (root)</li>
                  <li>Tu sitio estará en: <code className="bg-white px-1 rounded">tu-usuario.github.io/nombre-repo</code></li>
                </ol>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="font-semibold text-purple-900 mb-2">Opción 2: Netlify</p>
                <p>Ve a <a href="https://netlify.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">netlify.com</a> y arrastra el archivo HTML a la zona de deploy. Tu sitio estará disponible inmediatamente.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="font-semibold text-slate-900 mb-2">Opción 3: Vercel</p>
                <p>Instala Vercel CLI: <code className="bg-white px-1 rounded">npm i -g vercel</code> y ejecuta <code className="bg-white px-1 rounded">vercel</code> en la carpeta con el archivo.</p>
              </div>
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-800">
                  <strong>Ventaja:</strong> El sitio es completamente autónomo. No requiere servidor ni base de datos. 
                  Puedes compartir el enlace directamente con estudiantes.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowStaticInstructions(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Instructions Modal */}
      {showCanvasInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-purple-500" />
                Cómo importar a Canvas LMS
              </h3>
              <button
                onClick={() => setShowCanvasInstructions(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-sm text-slate-700">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="font-semibold text-purple-900 mb-2">Paso 1: Abre el archivo descargado</p>
                <p>El archivo HTML se ha descargado. Ábrelo con un editor de texto o navegador para ver el contenido.</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <p className="font-semibold text-indigo-900 mb-2">Paso 2: En Canvas, crea una nueva página</p>
                <p>Ve a tu curso en Canvas → Páginas → + Página. Dale un nombre (ej: "Taller de Curaduría").</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="font-semibold text-slate-900 mb-2">Paso 3: Usa el editor HTML</p>
                <p>En el editor de Canvas, haz clic en el botón "HTML Editor" (código fuente). Copia TODO el contenido del archivo HTML descargado y pégalo en el editor.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="font-semibold text-green-900 mb-2">Paso 4: Guarda y publica</p>
                <p>Guarda la página y publícala. El contenido aparecerá formateado con todos los módulos y evaluaciones.</p>
              </div>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                  <strong>Tip:</strong> Si prefieres dividir el curso en múltiples páginas, puedes exportar módulos individuales desde el menú de exportación.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowCanvasInstructions(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Export Button - Always Visible */}
      <div className="fixed top-20 right-4 z-50">
        <div className="relative">
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            Exportar Curso
            <ChevronDown className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
          </button>
          
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-[60] py-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                Publicación Web
              </div>
              <button 
                onClick={() => {
                  exportToStaticSite();
                  setShowExportMenu(false);
                }} 
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 flex items-center gap-3 group"
              >
                <Globe className="w-4 h-4 text-indigo-500" />
                <div className="flex-1">
                  <div className="font-medium">Exportar como sitio web</div>
                  <div className="text-xs text-slate-500">ZIP con HTML completo y módulos</div>
                </div>
              </button>
              
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 mt-1 mb-1">
                Canvas LMS
              </div>
              <button 
                onClick={() => {
                  exportToCanvas();
                  setShowExportMenu(false);
                }} 
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 flex items-center gap-3 group"
              >
                <GraduationCap className="w-4 h-4 text-purple-500" />
                <div className="flex-1">
                  <div className="font-medium">Exportar para Canvas</div>
                  <div className="text-xs text-slate-500">ZIP con módulos listos para Canvas</div>
                </div>
              </button>
              
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 mt-1 mb-1">
                Formatos de Datos
              </div>
              <button 
                onClick={() => {
                  exportToJson();
                  setShowExportMenu(false);
                }} 
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
              >
                <FileJson className="w-4 h-4 text-orange-500" />
                <div className="flex-1">
                  <div className="font-medium">JSON (.json)</div>
                  <div className="text-xs text-slate-500">Datos estructurados del curso</div>
                </div>
              </button>
              <button 
                onClick={() => {
                  exportToMarkdown();
                  setShowExportMenu(false);
                }} 
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <div className="flex-1">
                  <div className="font-medium">Markdown (.md)</div>
                  <div className="text-xs text-slate-500">Documentación y versionado</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6 mt-6">
        <button 
          onClick={onBack}
          className="flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver a Variaciones
        </button>
        <h1 className="text-3xl font-bold text-slate-900 mb-4 pr-32">{course.title}</h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">{course.description}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">
              Estructura del Curso
            </div>
            <nav className="flex flex-col p-2 gap-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Visión General
              </button>
              {course.modules.map((mod, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-start ${
                    activeTab === idx 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="opacity-50 mr-2 min-w-[1.2rem]">{idx + 1}.</span>
                  <span className="line-clamp-2">{mod.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {activeTab === 'overview' ? (
            <OverviewTab 
              course={course} 
              onExportClick={() => setShowExportMenu(true)} 
            />
          ) : (
            <ModuleTab 
              module={course.modules[activeTab as number]} 
              imageUrl={moduleImages[activeTab as number]}
              isLoadingImage={loadingImages[activeTab as number]}
              onExport={() => exportModuleToMarkdown(activeTab as number)}
            />
          )}
        </div>
      </div>
      
      {/* Credits Footer */}
      <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
        <p className="font-semibold text-slate-700 mb-1">{APP_ATTRIBUTION}</p>
        <p>{APP_CREDITS}</p>
      </footer>
      </div>
    </>
  );
};

const OverviewTab: React.FC<{ course: Course; onExportClick: () => void }> = ({ course, onExportClick }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* Export Button - Prominent at top */}
    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-indigo-900 mb-1">¿Listo para exportar tu curso?</h3>
        <p className="text-sm text-indigo-700">Descarga el curso completo para Canvas, sitio web estático, o formato JSON</p>
      </div>
      <button
        onClick={onExportClick}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md whitespace-nowrap"
      >
        <Download className="w-5 h-5" />
        Exportar Curso
      </button>
    </div>
    
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="flex items-center text-lg font-semibold text-slate-800 mb-4">
        <Target className="w-5 h-5 mr-2 text-indigo-600" />
        Público Objetivo
      </h3>
      <p className="text-slate-600">{course.targetAudience}</p>
    </div>

    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="flex items-center text-lg font-semibold text-slate-800 mb-4">
        <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
        Objetivos de Aprendizaje
      </h3>
      <ul className="space-y-2">
        {course.learningObjectives.map((obj, i) => (
          <li key={i} className="flex items-start text-slate-600">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0" />
            {obj}
          </li>
        ))}
      </ul>
    </div>

    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="flex items-center text-lg font-semibold text-slate-800 mb-4">
        <Palette className="w-5 h-5 mr-2 text-indigo-600" />
        Estética Sugerida
      </h3>
      <p className="text-slate-600 italic border-l-4 border-indigo-200 pl-4 py-1">
        "{course.colorPalette}"
      </p>
    </div>

    {/* Modules Grid */}
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="flex items-center text-lg font-semibold text-slate-800 mb-6">
        <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
        Módulos del Curso
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {course.modules.map((mod, idx) => (
          <div
            key={idx}
            className="p-5 border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all bg-white"
          >
            <h4 className="font-bold text-slate-900 mb-2">{mod.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{mod.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ModuleTab: React.FC<{ module: CourseModule; imageUrl?: string; isLoadingImage?: boolean; onExport: () => void }> = ({ module, imageUrl, isLoadingImage, onExport }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Content Block */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">{module.title}</h2>
            <p className="text-indigo-100 text-sm mt-1">{module.subtitle}</p>
          </div>
          <button 
            onClick={onExport}
            className="p-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg text-white transition-colors"
            title="Exportar módulo"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-8 overflow-hidden rounded-xl border border-slate-100 shadow-inner bg-slate-50 aspect-video relative group">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={module.title} 
                className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                {isLoadingImage ? (
                  <>
                    <Loader2 className="w-10 h-10 animate-spin mb-3 text-indigo-400" />
                    <span className="text-sm font-medium animate-pulse">Generando ilustración personalizada...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                    <span className="text-sm">Ilustración en camino...</span>
                  </>
                )}
              </div>
            )}
            
            {imageUrl && (
               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs italic line-clamp-2">Prompt: {module.visualPrompt}</p>
               </div>
            )}
          </div>

          <p className="text-slate-600 mb-6 text-lg">{module.description}</p>
          
          <h4 className="font-semibold text-slate-900 mb-3 uppercase text-xs tracking-wider">Puntos Clave</h4>
          <ul className="space-y-3 mb-8">
            {module.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start text-slate-700 bg-slate-50 p-3 rounded-lg">
                <div className="bg-white p-1 rounded-full shadow-sm mr-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quiz Block */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6 border-b pb-2">Evaluación del Módulo</h3>
        <div className="space-y-8">
          {module.quiz.map((q, idx) => (
            <QuizItem key={idx} question={q} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

const QuizItem: React.FC<{ question: QuizQuestion; index: number }> = ({ question, index }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);

    const isCorrect = selected === question.correctLabel;

    return (
        <div>
            <p className="font-medium text-slate-900 mb-3">{index + 1}. {question.question}</p>
            <div className="space-y-2">
                {question.options.map((opt) => (
                    <button
                        key={opt.label}
                        disabled={showResult}
                        onClick={() => {
                            setSelected(opt.label);
                            setShowResult(true);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex justify-between items-center ${
                            showResult
                                ? opt.label === question.correctLabel
                                    ? 'bg-green-50 border-green-200 text-green-800'
                                    : opt.label === selected
                                        ? 'bg-red-50 border-red-200 text-red-800'
                                        : 'bg-white border-slate-200 text-slate-400'
                                : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                        }`}
                    >
                        <span className="flex items-center">
                            <span className="w-6 font-semibold uppercase text-xs opacity-60">{opt.label})</span>
                            {opt.text}
                        </span>
                        {showResult && opt.label === question.correctLabel && <CheckCircle className="w-4 h-4 text-green-600" />}
                        {showResult && opt.label === selected && opt.label !== question.correctLabel && <XCircle className="w-4 h-4 text-red-500" />}
                    </button>
                ))}
            </div>
        </div>
    )
}
