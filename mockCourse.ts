import { Course } from "./types";

export const mockCourse: Course = {
  title: "Taller de Curaduría: Archivo, Cuerpo y Territorio",
  description:
    "Curso-taller de integración orientado al diseño de una mini-curaduría desde perspectivas decoloniales y críticas en el arte latinoamericano contemporáneo.",
  targetAudience:
    "Estudiantes avanzados de arte, historia del arte, curaduría y estudios culturales",
  learningObjectives: [
    "Analizar la curaduría como práctica discursiva y política",
    "Diseñar un concepto curatorial situado",
    "Justificar criterios de selección de obras",
    "Articular narrativa visual y mediación"
  ],
  colorPalette: "tonos archivo, sobrios, memoria visual",
  modules: [
    {
      id: 1,
      title: "¿Qué es una curaduría?",
      subtitle: "Historia, rol y transformaciones",
      description:
        "Introducción a la curaduría como práctica histórica y política que produce sentido y organiza narrativas visuales.",
      keyPoints: [
        "Curaduría como mediación cultural",
        "Del museo al espacio expandido",
        "Dimensión política de la selección",
        "Crítica a la neutralidad curatorial"
      ],
      visualPrompt:
        "archivo latinoamericano, documentos, fotografías analógicas, espacio expositivo, estética sobria",
      quiz: [
        {
          question: "¿Cómo se entiende la curaduría en este curso?",
          options: [
            { label: "A", text: "Como una tarea técnica neutral" },
            { label: "B", text: "Como una práctica discursiva y política" },
            { label: "C", text: "Como montaje decorativo" },
            { label: "D", text: "Como gestión administrativa" }
          ],
          correctLabel: "B"
        }
      ]
    },
    {
      id: 2,
      title: "Concepto curatorial",
      subtitle: "De la pregunta al eje conceptual",
      description:
        "Exploración del concepto curatorial como problema que articula obras, discursos y contextos.",
      keyPoints: [
        "Del tema al problema",
        "Conceptos situados",
        "Relación entre pregunta y narrativa",
        "Ejemplos curatoriales críticos"
      ],
      visualPrompt:
        "mapas conceptuales, notas curatoriales, bocetos, archivo visual",
      quiz: [
        {
          question: "¿Qué define un concepto curatorial sólido?",
          options: [
            { label: "A", text: "La cantidad de obras" },
            { label: "B", text: "La claridad del problema que articula" },
            { label: "C", text: "La fama de los artistas" },
            { label: "D", text: "El tamaño del espacio" }
          ],
          correctLabel: "B"
        }
      ]
    }
  ]
};
