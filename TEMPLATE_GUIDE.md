# Guía de Plantilla: Adaptar CursoAPP para Otros Cursos

Esta guía explica cómo convertir CursoAPP en una plantilla reutilizable para cualquier curso o proyecto educativo.

## 🎯 Objetivo

Transformar CursoAPP de un curso específico (Taller de Curaduría) a una plantilla genérica que pueda usarse para cualquier materia, disciplina, o proyecto educativo.

## 📝 Pasos para Adaptar

### 1. Reemplazar el Contenido del Curso Demo

**Archivo**: `mockCourse.ts`

```typescript
// Reemplaza mockCourse con tu contenido
export const mockCourse: Course = {
  title: "Tu Título del Curso",
  description: "Descripción del curso...",
  targetAudience: "Tu audiencia objetivo",
  learningObjectives: [
    "Objetivo 1",
    "Objetivo 2",
    // ...
  ],
  colorPalette: "Tu paleta de colores",
  modules: [
    {
      id: 1,
      title: "Módulo 1",
      subtitle: "Subtítulo del módulo",
      description: "Descripción...",
      keyPoints: ["Punto 1", "Punto 2"],
      visualPrompt: "Descripción para imagen",
      quiz: [
        {
          question: "Tu pregunta",
          options: [
            { label: "A", text: "Opción A" },
            { label: "B", text: "Opción B" },
            { label: "C", text: "Opción C" },
            { label: "D", text: "Opción D" }
          ],
          correctLabel: "B"
        }
      ]
    }
    // ... más módulos
  ]
};
```

### 2. Personalizar Textos de la Interfaz

**Archivo**: `App.tsx`

Busca y reemplaza:
- "Entrar al Taller de Curaduría (Demo)" → Tu texto de botón
- "¿Sobre qué quieres aprender hoy?" → Tu pregunta inicial
- Placeholders y mensajes según tu contexto

### 3. Ajustar Estilos y Colores

**Archivo**: `services/exportService.ts`

En las funciones `generateStaticSite` y `generateCanvasHTML`, modifica:

```css
:root {
  --primary-color: #4f46e5;  /* Cambia a tus colores */
  --primary-dark: #4338ca;
  /* ... otros colores */
}
```

### 4. Personalizar Prompts de IA (Opcional)

**Archivo**: `services/geminiService.ts`

Si usas generación con IA, ajusta:
- `SYSTEM_INSTRUCTION`: Instrucciones para el modelo
- Prompts en `generatePillars`, `generateVariations`, `generateCourse`

### 5. Modificar Metadatos

**Archivo**: `index.html`

Actualiza:
- Título de la página
- Meta description
- Favicon (si tienes uno)

## 🎨 Personalización Avanzada

### Cambiar la Estructura de Módulos

Si necesitas campos adicionales en los módulos:

1. **Actualiza `types.ts`**:
```typescript
export interface CourseModule {
  // ... campos existentes
  newField?: string;  // Tu nuevo campo
}
```

2. **Actualiza los exportadores** en `exportService.ts` para incluir el nuevo campo

### Agregar Nuevos Formatos de Exportación

En `services/exportService.ts`, crea nuevas funciones:

```typescript
export const generateCustomFormat = (course: Course): string => {
  // Tu lógica de exportación
  return customHTML;
};
```

Luego agrega el botón en `components/CourseView.tsx`.

### Integrar con Otras Plataformas

Para exportar a otras plataformas (Moodle, Blackboard, etc.):

1. Investiga el formato requerido por la plataforma
2. Crea una función similar a `generateCanvasHTML`
3. Agrega el botón de exportación en la UI

## 📦 Crear una Nueva Plantilla

### Estructura Mínima

Para crear una plantilla completamente nueva:

1. **Copia el proyecto**
2. **Reemplaza `mockCourse.ts`** con contenido genérico o vacío
3. **Actualiza README.md** con instrucciones específicas
4. **Crea un archivo `COURSE_TEMPLATE.md`** con estructura vacía:

```markdown
# Plantilla de Curso

## Información Básica
- Título: [Título del Curso]
- Descripción: [Descripción]
- Audiencia: [Audiencia objetivo]

## Módulos
[Estructura de módulos a completar]
```

### Plantilla para Diferentes Disciplinas

#### Humanidades
- Enfoque en textos, análisis, interpretación
- Módulos pueden incluir: lecturas, análisis de caso, discusiones

#### Ciencias
- Enfoque en metodología, experimentos, datos
- Módulos pueden incluir: laboratorios, ejercicios prácticos, visualizaciones

#### Artes
- Enfoque en práctica, crítica, creación
- Módulos pueden incluir: proyectos, portafolios, reflexiones

## 🔄 Proceso de Reutilización

### Para un Nuevo Curso

1. **Clona o copia** el proyecto
2. **Reemplaza el contenido** en `mockCourse.ts`
3. **Personaliza textos** en `App.tsx`
4. **Ajusta estilos** si es necesario
5. **Prueba en modo demo**
6. **Exporta** en el formato deseado

### Para Múltiples Cursos

Crea una estructura de carpetas:

```
courses/
├── course-template/     # Plantilla base
├── curation-workshop/    # Curso de curaduría
├── digital-history/     # Curso de historia digital
└── data-literacy/       # Curso de alfabetización de datos
```

Cada carpeta puede ser un proyecto independiente basado en la plantilla.

## 📚 Ejemplos de Adaptación

### Ejemplo 1: Curso de Historia Digital

**Cambios principales**:
- Módulos sobre: herramientas DH, análisis de datos históricos, visualización
- Quiz sobre metodologías de investigación
- Exportación incluye datasets de ejemplo

### Ejemplo 2: Taller de Escritura

**Cambios principales**:
- Módulos sobre: géneros, técnicas, revisión
- Quiz sobre gramática y estilo
- Exportación incluye plantillas de escritura

### Ejemplo 3: Curso de Programación

**Cambios principales**:
- Módulos sobre: conceptos, ejercicios, proyectos
- Quiz sobre sintaxis y lógica
- Exportación incluye código de ejemplo

## ✅ Checklist de Adaptación

- [ ] Reemplazar contenido en `mockCourse.ts`
- [ ] Actualizar textos de interfaz en `App.tsx`
- [ ] Ajustar colores y estilos
- [ ] Personalizar metadatos (`index.html`)
- [ ] Probar modo demo
- [ ] Probar exportaciones (estático, Canvas, Markdown, JSON)
- [ ] Actualizar README.md con información del nuevo curso
- [ ] Revisar accesibilidad de contenido exportado
- [ ] Verificar que imágenes funcionen (si las hay)
- [ ] Probar en diferentes navegadores

## 🎓 Mejores Prácticas

1. **Mantén la estructura modular**: Facilita la reutilización
2. **Documenta cambios**: Anota qué personalizaste y por qué
3. **Prueba exportaciones**: Verifica que todos los formatos funcionen
4. **Considera accesibilidad**: Asegúrate de que el contenido sea accesible
5. **Versiona tu contenido**: Usa Git para rastrear cambios

## 📖 Recursos Adicionales

- Ver `README.md` para metodología DH
- Ver `ACADEMIC_LANGUAGE.md` para lenguaje académico
- Consulta la documentación de React/TypeScript para personalizaciones avanzadas

---

**Nota**: Esta plantilla está diseñada para ser flexible. No dudes en modificar la estructura según tus necesidades específicas.

