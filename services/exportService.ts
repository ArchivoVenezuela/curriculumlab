import { Course, CourseModule } from "../types";
import { APP_ATTRIBUTION, APP_CREDITS } from "../src/constants/metadata";

/**
 * Export Service for Course Content
 * 
 * Provides multiple export formats:
 * - Static Site: Full standalone HTML website
 * - Canvas LMS: Canvas-compatible HTML pages
 * - Markdown: Documentation format
 * - JSON: Structured data format
 */

/**
 * Generate a complete static site HTML for the course
 * Includes navigation, responsive design, and all modules
 */
export const generateStaticSite = (course: Course, moduleImages: Record<number, string> = {}): string => {
  const sanitizeId = (str: string) => str.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  // Generate overview page with links to individual modules
  const modulesList = course.modules.map((mod, idx) => {
    const moduleNum = String(idx + 1).padStart(2, '0');
    return `
      <div class="module-card">
        <a href="module-${moduleNum}.html" class="module-link">
          <span class="module-number">Módulo ${idx + 1}</span>
          <h3>${escapeHtml(mod.title)}</h3>
          <p class="module-subtitle">${escapeHtml(mod.subtitle)}</p>
        </a>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(course.description)}">
  <meta name="author" content="CurriculumLab">
  <title>${escapeHtml(course.title)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --primary-color: #4f46e5;
      --primary-dark: #4338ca;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --bg-primary: #ffffff;
      --bg-secondary: #f8fafc;
      --border-color: #e2e8f0;
      --success-color: #10b981;
      --spacing-unit: 1rem;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: var(--text-primary);
      background: var(--bg-secondary);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    header {
      background: linear-gradient(135deg, var(--primary-color) 0%, #7c3aed 100%);
      color: white;
      padding: 3rem 2rem;
      margin-bottom: 2rem;
      border-radius: 0 0 1rem 1rem;
    }
    
    header h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    header .description {
      font-size: 1.1rem;
      opacity: 0.95;
      max-width: 800px;
    }
    
    .course-meta {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 1.5rem;
    }
    
    .meta-item h3 {
      color: var(--primary-color);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }
    
    .meta-item p, .meta-item ul {
      color: var(--text-secondary);
    }
    
    .meta-item ul {
      list-style: none;
      padding-left: 0;
    }
    
    .meta-item li {
      padding: 0.25rem 0;
      position: relative;
      padding-left: 1.5rem;
    }
    
    .meta-item li:before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--primary-color);
    }
    
    .modules-list {
      margin-top: 2rem;
    }
    
    .module-card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      border: 1px solid var(--border-color);
      transition: all 0.2s;
    }
    
    .module-card:hover {
      border-color: var(--primary-color);
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.1);
    }
    
    .module-link {
      text-decoration: none;
      color: inherit;
      display: block;
    }
    
    .module-link .module-number {
      display: inline-block;
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .module-link h3 {
      color: var(--text-primary);
      margin: 0.5rem 0;
      font-size: 1.25rem;
    }
    
    .module-link .module-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin: 0;
    }
    
    .module-section {
      background: white;
      padding: 3rem;
      border-radius: 1rem;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .module-header {
      border-bottom: 3px solid var(--primary-color);
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }
    
    .module-number {
      display: inline-block;
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .module-header h2 {
      font-size: 2rem;
      margin: 0.5rem 0;
      color: var(--text-primary);
    }
    
    .module-subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
      font-style: italic;
    }
    
    .module-image {
      margin: 2rem 0;
      border-radius: 0.5rem;
      overflow: hidden;
      background: var(--bg-secondary);
    }
    
    .module-image img {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .image-caption {
      padding: 1rem;
      background: var(--bg-secondary);
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-style: italic;
      margin: 0;
    }
    
    .module-content {
      margin-top: 2rem;
    }
    
    .description {
      font-size: 1.1rem;
      line-height: 1.8;
      color: var(--text-primary);
      margin-bottom: 2rem;
    }
    
    .key-points {
      background: var(--bg-secondary);
      padding: 2rem;
      border-radius: 0.5rem;
      margin: 2rem 0;
      border-left: 4px solid var(--success-color);
    }
    
    .key-points h3 {
      color: var(--text-primary);
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }
    
    .key-points ul {
      list-style: none;
      padding-left: 0;
    }
    
    .key-points li {
      padding: 0.75rem 0;
      padding-left: 2rem;
      position: relative;
    }
    
    .key-points li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: var(--success-color);
      font-weight: bold;
    }
    
    .quiz-section {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 2px solid var(--border-color);
    }
    
    .quiz-section h3 {
      color: var(--text-primary);
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }
    
    .quiz-item {
      background: var(--bg-secondary);
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }
    
    .quiz-item .question {
      font-weight: 600;
      font-size: 1.1rem;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }
    
    .quiz-options {
      list-style: none;
      padding-left: 0;
    }
    
    .quiz-options li {
      padding: 0.75rem 1rem;
      margin: 0.5rem 0;
      background: white;
      border-radius: 0.25rem;
      border: 1px solid var(--border-color);
    }
    
    .quiz-options li.correct {
      border-color: var(--success-color);
      background: #f0fdf4;
    }
    
    .correct-badge {
      color: var(--success-color);
      font-weight: 600;
      margin-left: 0.5rem;
    }
    
    footer {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-top: 4rem;
      border-top: 2px solid var(--border-color);
    }
    
    .credits {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }
    
    .credits-meta {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      header {
        padding: 2rem 1rem;
      }
      
      header h1 {
        font-size: 1.75rem;
      }
      
      .module-section {
        padding: 1.5rem;
      }
      
      .nav-list {
        flex-direction: column;
      }
    }
    
    @media print {
      .navigation {
        display: none;
      }
      
      .module-section {
        page-break-inside: avoid;
        margin-bottom: 1rem;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>${escapeHtml(course.title)}</h1>
      <p class="description">${escapeHtml(course.description)}</p>
    </div>
  </header>
  
  <div class="container">
    <div class="course-meta">
      <div class="meta-grid">
        <div class="meta-item">
          <h3>Público Objetivo</h3>
          <p>${escapeHtml(course.targetAudience)}</p>
        </div>
        <div class="meta-item">
          <h3>Objetivos de Aprendizaje</h3>
          <ul>
            ${course.learningObjectives.map(obj => `<li>${escapeHtml(obj)}</li>`).join('')}
          </ul>
        </div>
        <div class="meta-item">
          <h3>Estética Sugerida</h3>
          <p>${escapeHtml(course.colorPalette)}</p>
        </div>
      </div>
    </div>
    
    <div class="course-overview">
      <div class="modules-list">
        <h2 style="margin-top: 2rem; margin-bottom: 1.5rem; color: var(--text-primary); font-size: 1.75rem;">Módulos del Curso</h2>
        ${modulesList}
      </div>
    </div>
  </div>
  
  <footer>
    <p class="credits">${APP_ATTRIBUTION}</p>
    <p class="credits-meta">${APP_CREDITS}</p>
  </footer>
</body>
</html>`;
};

/**
 * Generate Canvas LMS-compatible HTML
 * Canvas requires specific formatting and structure
 * Optimized for Canvas module pages and content structure
 */
export const generateCanvasHTML = (course: Course, moduleImages: Record<number, string> = {}): string => {
  const sanitizeId = (str: string) => str.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  // Canvas-compatible module HTML
  // Each module is structured for easy copy-paste into Canvas pages
  const canvasModules = course.modules.map((mod, idx) => {
    const imageData = moduleImages[mod.id] || moduleImages[idx] || '';
    
    return `
      <!-- Módulo ${idx + 1}: ${escapeHtml(mod.title)} -->
      <div class="canvas-module" style="margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 2px solid #ddd;">
        <h2 style="color: #2d3b45; font-size: 1.75rem; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 3px solid #2d3b45;">
          Módulo ${idx + 1}: ${escapeHtml(mod.title)}
        </h2>
        <p class="canvas-subtitle" style="color: #666; font-style: italic; font-size: 1.1rem; margin-bottom: 1.5rem;">
          ${escapeHtml(mod.subtitle)}
        </p>
        
        ${imageData ? `
        <div style="margin: 1.5rem 0; text-align: center;">
          <img src="${imageData}" alt="${escapeHtml(mod.title)}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
        </div>
        ` : ''}
        
        <div class="canvas-content">
          <h3 style="color: #2d3b45; font-size: 1.3rem; margin-top: 2rem; margin-bottom: 1rem;">Descripción</h3>
          <div style="line-height: 1.8; color: #333; margin-bottom: 2rem;">
            ${escapeHtml(mod.description).split('\n').map(p => p.trim()).filter(p => p).map(p => `<p style="margin-bottom: 1rem;">${p}</p>`).join('')}
          </div>
          
          <h3 style="color: #2d3b45; font-size: 1.3rem; margin-top: 2rem; margin-bottom: 1rem;">Puntos Clave</h3>
          <ul style="line-height: 1.8; color: #333; margin-bottom: 2rem; padding-left: 1.5rem;">
            ${mod.keyPoints.map(kp => `<li style="margin-bottom: 0.75rem;">${escapeHtml(kp)}</li>`).join('')}
          </ul>
          
          <h3 style="color: #2d3b45; font-size: 1.3rem; margin-top: 2rem; margin-bottom: 1rem;">Evaluación del Módulo</h3>
          ${mod.quiz.map((q, qIdx) => `
            <div class="canvas-quiz" style="background-color: #f9f9f9; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #2d3b45; border-radius: 4px;">
              <p style="font-weight: 600; font-size: 1.1rem; color: #2d3b45; margin-bottom: 1rem;">
                Pregunta ${qIdx + 1}: ${escapeHtml(q.question)}
              </p>
              <ul style="list-style: none; padding-left: 0; margin: 0;">
                ${q.options.map(opt => `
                  <li style="padding: 0.75rem 1rem; margin: 0.5rem 0; background: white; border-radius: 4px; border: 1px solid #ddd; ${opt.label === q.correctLabel ? 'border-color: #10b981; background-color: #f0fdf4;' : ''}">
                    <strong>${opt.label})</strong> ${escapeHtml(opt.text)}${opt.label === q.correctLabel ? ' <span style="color: #10b981; font-weight: 600;">(Respuesta Correcta)</span>' : ''}
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(course.title)} - Canvas</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .canvas-header {
      background-color: #2d3b45;
      color: white;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 30px;
    }
    .canvas-header h1 {
      margin: 0 0 10px 0;
    }
    .canvas-meta {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 30px;
    }
    .canvas-meta h2 {
      margin-top: 0;
      color: #2d3b45;
      font-size: 1.2em;
    }
    .canvas-module {
      margin-bottom: 40px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .canvas-module h2 {
      color: #2d3b45;
      border-bottom: 2px solid #2d3b45;
      padding-bottom: 10px;
    }
    .canvas-subtitle {
      color: #666;
      font-style: italic;
      margin-bottom: 15px;
    }
    .canvas-content h3 {
      color: #2d3b45;
      margin-top: 20px;
    }
    .canvas-quiz {
      background-color: #f9f9f9;
      padding: 15px;
      margin: 15px 0;
      border-left: 4px solid #2d3b45;
    }
    hr {
      border: none;
      border-top: 2px solid #ddd;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="canvas-header">
    <h1>${escapeHtml(course.title)}</h1>
    <p>${escapeHtml(course.description)}</p>
  </div>
  
  <div class="canvas-meta">
    <h2>Información del Curso</h2>
    <p><strong>Público Objetivo:</strong> ${escapeHtml(course.targetAudience)}</p>
    <p><strong>Objetivos de Aprendizaje:</strong></p>
    <ul>
      ${course.learningObjectives.map(obj => `<li>${escapeHtml(obj)}</li>`).join('')}
    </ul>
    <p><strong>Estética Sugerida:</strong> ${escapeHtml(course.colorPalette)}</p>
  </div>
  
  ${canvasModules}
  
  <div style="text-align: center; margin-top: 40px; padding: 20px; border-top: 2px solid #ddd; color: #666; font-size: 0.9em;">
    <p style="margin-bottom: 0.5rem;"><strong>${APP_ATTRIBUTION}</strong></p>
    <p style="font-size: 0.85em;">${APP_CREDITS}</p>
  </div>
</body>
</html>`;
};

/**
 * Generate a ZIP-ready structure for static site export
 * Returns an object with file paths and contents
 */
export const generateStaticSitePackage = (
  course: Course, 
  moduleImages: Record<number, string> = {}
): { [filename: string]: string } => {
  const sanitizeId = (str: string) => str.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const courseId = sanitizeId(course.title);
  
  const files: { [filename: string]: string } = {
    'index.html': generateStaticSite(course, moduleImages),
    'README.md': generateSiteReadme(course),
    'canvas.html': generateCanvasHTML(course, moduleImages),
  };
  
  // Add individual module pages if needed
  course.modules.forEach((mod, idx) => {
    const moduleId = sanitizeId(mod.title);
    files[`module-${mod.id}-${moduleId}.html`] = generateModulePage(mod, course, idx, moduleImages[mod.id] || moduleImages[idx] || '');
  });
  
  return files;
};

/**
 * Generate a standalone module page
 */
const generateModulePage = (
  module: CourseModule,
  course: Course,
  index: number,
  imageData: string
): string => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(module.title)} - ${escapeHtml(course.title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
      background: #f8fafc;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 2rem;
      border-radius: 1rem;
      margin-bottom: 2rem;
    }
    .content {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    ${imageData ? `
    .module-image {
      width: 100%;
      margin: 1.5rem 0;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    .module-image img {
      width: 100%;
      height: auto;
    }
    ` : ''}
  </style>
</head>
<body>
  <div class="header">
    <a href="index.html" style="color: white; text-decoration: none;">← Volver al curso</a>
    <h1>${escapeHtml(module.title)}</h1>
    <p><em>${escapeHtml(module.subtitle)}</em></p>
    <p>Módulo ${index + 1} de ${course.modules.length}</p>
  </div>
  
  <div class="content">
    ${imageData ? `
    <div class="module-image">
      <img src="${imageData}" alt="${escapeHtml(module.title)}" />
    </div>
    ` : ''}
    
    <div class="description">
      ${escapeHtml(module.description).split('\n').map(p => `<p>${p}</p>`).join('')}
    </div>
    
    <h3>Puntos Clave</h3>
    <ul>
      ${module.keyPoints.map(kp => `<li>${escapeHtml(kp)}</li>`).join('')}
    </ul>
    
    <h3>Evaluación</h3>
    ${module.quiz.map((q, qIdx) => `
      <div style="margin: 1.5rem 0; padding: 1rem; background: #f8fafc; border-radius: 0.5rem;">
        <p><strong>${qIdx + 1}. ${escapeHtml(q.question)}</strong></p>
        <ul>
          ${q.options.map(opt => `
            <li>${opt.label}) ${escapeHtml(opt.text)}${opt.label === q.correctLabel ? ' <strong style="color: #10b981;">(Correcta)</strong>' : ''}</li>
          `).join('')}
        </ul>
      </div>
    `).join('')}
  </div>
</body>
</html>`;
};

/**
 * Generate README for exported static site
 */
const generateSiteReadme = (course: Course): string => {
  return `# ${course.title}

## Descripción

${course.description}

## Instrucciones de Despliegue

### Opción 1: GitHub Pages

1. Crea un nuevo repositorio en GitHub
2. Sube todos los archivos de esta carpeta
3. Ve a Settings > Pages
4. Selecciona la rama main y la carpeta / (root)
5. Tu sitio estará disponible en: \`https://tu-usuario.github.io/nombre-repo/\`

### Opción 2: Netlify

1. Ve a [Netlify](https://netlify.com)
2. Arrastra esta carpeta a la zona de deploy
3. Tu sitio estará disponible inmediatamente

### Opción 3: Vercel

1. Instala Vercel CLI: \`npm i -g vercel\`
2. Ejecuta \`vercel\` en esta carpeta
3. Sigue las instrucciones

### Opción 4: Servidor Web Local

Simplemente abre \`index.html\` en un navegador o sirve la carpeta con cualquier servidor web.

## Estructura de Archivos

- \`index.html\` - Página principal del curso
- \`canvas.html\` - Versión compatible con Canvas LMS
- \`module-*.html\` - Páginas individuales de módulos
- \`README.md\` - Este archivo

## Personalización

Puedes editar los archivos HTML directamente para personalizar colores, fuentes, o estructura.

## Licencia

${APP_ATTRIBUTION}

${APP_CREDITS}
`;
};

/**
 * Generate individual module HTML for static site
 */
const generateModuleHTML = (
  module: CourseModule,
  course: Course,
  index: number,
  imageData: string = ''
): string => {
  const sanitizeId = (str: string) => str.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const moduleId = sanitizeId(module.title);
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(module.title)} - ${escapeHtml(course.title)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1e293b;
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
    .header a {
      color: white;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 1rem;
    }
    .header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .header .subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      font-style: italic;
    }
    .content {
      padding: 2rem;
    }
    .module-image {
      width: 100%;
      margin: 1.5rem 0;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    .module-image img {
      width: 100%;
      height: auto;
      display: block;
    }
    .key-points {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin: 1.5rem 0;
      border-left: 4px solid #10b981;
    }
    .key-points ul {
      list-style: none;
      padding-left: 0;
    }
    .key-points li {
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
    }
    .key-points li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #10b981;
      font-weight: bold;
    }
    .quiz-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid #e2e8f0;
    }
    .quiz-item {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin: 1rem 0;
    }
    .quiz-item .question {
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .quiz-item ul {
      list-style: none;
      padding-left: 0;
    }
    .quiz-item li {
      padding: 0.5rem 0;
    }
    footer {
      text-align: center;
      padding: 2rem;
      border-top: 2px solid #e2e8f0;
      color: #64748b;
      font-size: 0.875rem;
    }
    .credits {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #1e293b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="index.html">← Volver al curso</a>
      <h1>${escapeHtml(module.title)}</h1>
      <p class="subtitle">${escapeHtml(module.subtitle)}</p>
      <p style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.8;">Módulo ${index + 1} de ${course.modules.length}</p>
    </div>
    
    <div class="content">
      ${imageData ? `
      <div class="module-image">
        <img src="${imageData}" alt="${escapeHtml(module.title)}" />
      </div>
      ` : ''}
      
      <div class="description">
        ${escapeHtml(module.description).split('\n').map(p => p.trim()).filter(p => p).map(p => `<p>${p}</p>`).join('')}
      </div>
      
      <div class="key-points">
        <h3>Puntos Clave</h3>
        <ul>
          ${module.keyPoints.map(kp => `<li>${escapeHtml(kp)}</li>`).join('')}
        </ul>
      </div>
      
      <div class="quiz-section">
        <h3>Evaluación del Módulo</h3>
        ${module.quiz.map((q, qIdx) => `
          <div class="quiz-item">
            <p class="question">${qIdx + 1}. ${escapeHtml(q.question)}</p>
            <ul>
              ${q.options.map(opt => `
                <li>${opt.label}) ${escapeHtml(opt.text)}${opt.label === q.correctLabel ? ' <strong style="color: #10b981;">(Respuesta Correcta)</strong>' : ''}</li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>
    
    <footer>
      <p class="credits">${APP_ATTRIBUTION}</p>
      <p>${APP_CREDITS}</p>
    </footer>
  </div>
</body>
</html>`;
};

/**
 * Generate Canvas-compatible module HTML
 */
const generateCanvasModuleHTML = (
  module: CourseModule,
  course: Course,
  index: number,
  imageData: string = ''
): string => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Módulo ${index + 1}: ${escapeHtml(module.title)}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .module-header {
      background-color: #2d3b45;
      color: white;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .module-header h2 {
      margin: 0 0 10px 0;
    }
    .module-subtitle {
      color: #ccc;
      font-style: italic;
    }
    .module-content {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .key-points {
      background-color: white;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
      border-left: 4px solid #2d3b45;
    }
    .quiz-item {
      background-color: #f9f9f9;
      padding: 15px;
      margin: 15px 0;
      border-left: 4px solid #2d3b45;
      border-radius: 4px;
    }
    .quiz-question {
      font-weight: 600;
      margin-bottom: 10px;
    }
    .quiz-options {
      list-style: none;
      padding-left: 0;
    }
    .quiz-options li {
      padding: 5px 0;
    }
    .credits {
      text-align: center;
      margin-top: 40px;
      padding: 20px;
      border-top: 2px solid #ddd;
      color: #666;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="module-header">
    <h2>Módulo ${index + 1}: ${escapeHtml(module.title)}</h2>
    <p class="module-subtitle">${escapeHtml(module.subtitle)}</p>
  </div>
  
  <div class="module-content">
    ${imageData ? `<p><img src="${imageData}" alt="${escapeHtml(module.title)}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px;" /></p>` : ''}
    
    <div>
      <h3>Descripción</h3>
      ${escapeHtml(module.description).split('\n').map(p => p.trim()).filter(p => p).map(p => `<p>${p}</p>`).join('')}
    </div>
    
    <div class="key-points">
      <h3>Puntos Clave</h3>
      <ul>
        ${module.keyPoints.map(kp => `<li>${escapeHtml(kp)}</li>`).join('')}
      </ul>
    </div>
    
    <div>
      <h3>Evaluación del Módulo</h3>
      ${module.quiz.map((q, qIdx) => `
        <div class="quiz-item">
          <p class="quiz-question">Pregunta ${qIdx + 1}: ${escapeHtml(q.question)}</p>
          <ul class="quiz-options">
            ${q.options.map(opt => `
              <li>${opt.label}) ${escapeHtml(opt.text)}${opt.label === q.correctLabel ? ' <strong>(Respuesta Correcta)</strong>' : ''}</li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  </div>
  
  <div class="credits">
    <p><strong>${APP_ATTRIBUTION}</strong></p>
    <p>${APP_CREDITS}</p>
  </div>
</body>
</html>`;
};

/**
 * Generate static site package as ZIP
 * Returns a Promise that resolves to a Blob
 */
export const generateStaticSiteZIP = async (
  course: Course,
  moduleImages: Record<number, string> = {}
): Promise<Blob> => {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  
  const sanitizeId = (str: string) => str.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const courseId = sanitizeId(course.title);
  
  // Add main index.html
  zip.file('index.html', generateStaticSite(course, moduleImages));
  
  // Add README
  zip.file('README.md', generateSiteReadme(course));
  
  // Add individual module pages
  course.modules.forEach((mod, idx) => {
    const moduleId = sanitizeId(mod.title);
    const moduleNum = String(idx + 1).padStart(2, '0');
    const imageData = moduleImages[mod.id] || moduleImages[idx] || '';
    zip.file(`module-${moduleNum}.html`, generateModuleHTML(mod, course, idx, imageData));
  });
  
  return await zip.generateAsync({ type: 'blob' });
};

/**
 * Generate Canvas package as ZIP
 * Returns a Promise that resolves to a Blob
 */
export const generateCanvasZIP = async (
  course: Course,
  moduleImages: Record<number, string> = {}
): Promise<Blob> => {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  
  const canvasFolder = zip.folder('canvas');
  if (!canvasFolder) throw new Error('Failed to create canvas folder');
  
  // Add individual module pages
  course.modules.forEach((mod, idx) => {
    const moduleNum = String(idx + 1).padStart(2, '0');
    const imageData = moduleImages[mod.id] || moduleImages[idx] || '';
    canvasFolder.file(`module-${moduleNum}.html`, generateCanvasModuleHTML(mod, course, idx, imageData));
  });
  
  // Add optional overview/index
  canvasFolder.file('index.html', generateCanvasHTML(course, moduleImages));
  
  return await zip.generateAsync({ type: 'blob' });
};

/**
 * Utility function to escape HTML
 */
const escapeHtml = (text: string): string => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

