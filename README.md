# CursoAPP: Herramienta de Creación de Cursos para Humanidades Digitales

<div align="center">
  <h3>Una metodología DH para la creación de cursos estructurados y exportables</h3>
</div>

## 📚 Descripción

CursoAPP es una herramienta de creación de cursos diseñada específicamente para metodologías de Humanidades Digitales (DH). Permite generar cursos estructurados con módulos, evaluaciones y contenido educativo que puede exportarse en múltiples formatos: sitios web estáticos, Canvas LMS, Markdown, y JSON.

### Características Principales

- **Modo Demo/Docencia**: Funciona sin API keys, ideal para enseñanza
- **Exportación Múltiple**: 
  - Sitios web estáticos (HTML completo)
  - Canvas LMS (formato compatible)
  - Markdown (documentación)
  - JSON (datos estructurados)
- **Estructura Modular**: Cursos organizados en módulos con evaluaciones integradas
- **Metodología DH**: Enfoque en prácticas decoloniales, críticas y situadas

## 🎯 Metodología de Humanidades Digitales

### Marco Teórico

CursoAPP se fundamenta en principios de Humanidades Digitales que priorizan:

1. **Accesibilidad y Reproducibilidad**: Los cursos generados son estáticos, no requieren servidores complejos, y pueden alojarse en GitHub Pages, Netlify, o cualquier servidor web básico.

2. **Transparencia Metodológica**: El código fuente y la estructura de datos son abiertos, permitiendo la revisión y adaptación del contenido.

3. **Descentralización**: Los cursos pueden existir independientemente de plataformas propietarias, preservando la autonomía académica.

4. **Prácticas Críticas**: La herramienta está diseñada para cursos que cuestionan estructuras de poder, priorizan perspectivas del Sur Global, y articulan conocimiento situado.

### Caso de Uso: Taller de Curaduría

El curso demo incluido ("Taller de Curaduría: Archivo, Cuerpo y Territorio") ejemplifica la aplicación de estos principios:

- **Epistemología Decolonial**: Enfoque en archivos, violencia, territorio, y visualidades subalternas
- **Pedagogía Crítica**: Cuestionamiento de la neutralidad curatorial
- **Contexto Situado**: Arte latinoamericano contemporáneo y prácticas curatoriales del Sur Global

## 🚀 Instalación y Uso

### Requisitos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
npm install
```

### Modo Demo (Recomendado para Docencia)

El modo demo funciona sin configuración adicional:

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:3000` y funcionará completamente con el curso demo incluido, sin necesidad de API keys.

### Modo con IA (Opcional)

Para usar la generación de contenido con IA:

1. Crea un archivo `.env.local`:
```env
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

2. Cambia el modo en la interfaz de "Modo Docencia" a "Modo IA"

## 📤 Exportación de Cursos

### Sitio Web Estático

1. Abre el curso en la aplicación
2. Haz clic en "Exportar" → "Sitio Web Estático (.html)"
3. Se descargará un archivo HTML completo con:
   - Navegación entre módulos
   - Diseño responsive
   - Estilos integrados
   - Listo para desplegar

**Opciones de Despliegue:**
- **GitHub Pages**: Sube el HTML a un repositorio y activa Pages
- **Netlify**: Arrastra el archivo a Netlify Drop
- **Vercel**: Usa Vercel CLI para desplegar
- **Servidor Local**: Abre directamente en el navegador

### Canvas LMS

1. Haz clic en "Exportar" → "Canvas LMS (.html)"
2. Se descargará un archivo HTML compatible con Canvas
3. En Canvas:
   - Crea una nueva página
   - Usa el editor HTML (código fuente)
   - Pega el contenido del archivo exportado

### Otros Formatos

- **Markdown**: Para documentación y versionado
- **JSON**: Para integración con otras herramientas o análisis de datos

## 🎓 Uso en Docencia

### Para Instructores

1. **Preparación del Curso**:
   - Usa el modo demo para explorar la estructura
   - Adapta el contenido según tus necesidades
   - Exporta en el formato que prefieras

2. **Distribución**:
   - Sitio estático: Comparte el enlace del sitio desplegado
   - Canvas: Importa el HTML en tu curso Canvas
   - Markdown: Comparte el archivo para que estudiantes lo lean

3. **Personalización**:
   - Los archivos HTML exportados pueden editarse directamente
   - Modifica colores, fuentes, o estructura según necesites

### Para Estudiantes

- Los cursos exportados son completamente autónomos
- No requieren conexión a internet (excepto para imágenes externas)
- Pueden imprimirse o guardarse localmente
- Compatibles con lectores de pantalla y herramientas de accesibilidad

## 🔬 Metodología de Investigación

### Aplicaciones en DH

1. **Análisis de Contenido**: Los cursos exportados en JSON pueden analizarse programáticamente
2. **Preservación Digital**: Los sitios estáticos son preservables a largo plazo
3. **Colaboración**: El formato Markdown facilita el control de versiones con Git
4. **Reproducibilidad**: La estructura modular permite reutilización y adaptación

### Consideraciones Éticas

- **Accesibilidad**: Los cursos deben ser accesibles para personas con discapacidades
- **Representación**: Considera la diversidad en ejemplos y casos de estudio
- **Licencia**: Define claramente la licencia del contenido generado
- **Datos**: Si usas IA, considera las implicaciones éticas de los datos de entrenamiento

## 📋 Estructura del Proyecto

```
CourseApp/
├── components/          # Componentes React
│   ├── CourseView.tsx   # Vista principal del curso
│   └── Loading.tsx      # Componente de carga
├── services/            # Servicios
│   ├── geminiService.ts # Servicio de IA (opcional)
│   └── exportService.ts # Servicio de exportación
├── types.ts             # Definiciones TypeScript
├── mockCourse.ts        # Curso demo
└── App.tsx              # Componente principal
```

## 🛠️ Desarrollo

### Tecnologías

- **React** + **TypeScript**: Interfaz de usuario
- **Vite**: Build tool
- **Tailwind CSS**: Estilos (si está configurado)
- **Google Gemini API**: Generación de contenido (opcional)

### Contribuir

Este proyecto está diseñado como plantilla reutilizable. Para adaptarlo:

1. Modifica `mockCourse.ts` con tu contenido
2. Ajusta los estilos en `exportService.ts`
3. Personaliza los componentes según tus necesidades

## 📄 Licencia

Este proyecto está diseñado para uso académico y educativo. Adapta la licencia según tus necesidades institucionales.

## 🙏 Créditos

Desarrollado para metodologías de Humanidades Digitales, con enfoque en prácticas críticas y decoloniales.

## 📧 Contacto y Soporte

Para preguntas sobre metodología DH, adaptación del código, o uso en investigación, consulta la documentación técnica en `/docs` o abre un issue en el repositorio.

---

## Metodología

CurriculumLab se fundamenta en una metodología de Humanidades Digitales
centrada en la agencia docente, la exportabilidad y la preservación digital.

Ver: docs/METODOLOGIA_DH.md

**Nota para Investigadores**: Ver `ACADEMIC_LANGUAGE.md` para lenguaje apropiado para propuestas de investigación, IRB, y sílabos.
