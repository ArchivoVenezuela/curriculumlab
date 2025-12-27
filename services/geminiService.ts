import { GoogleGenAI, Type } from "@google/genai";
import { Pillar, Variation, Course } from "../types";

let ai: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GEMINI_API_KEY environment variable is not set. Please create a .env file with your Gemini API key.");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey
    });
  }
  return ai;
};

const SYSTEM_INSTRUCTION = `
Eres CursoAPP, un mentor experto en creación de cursos online.
Tu objetivo es ayudar al usuario a estructurar contenido educativo de alta calidad.
Responde SIEMPRE en español.
Sé directo, profesional y estructurado.
`;

// --- Step 1: Generate Pillars ---

export const generatePillars = async (topic: string): Promise<Pillar[]> => {
  const model = "gemini-3-flash-preview";

  const response = await getAI().models.generateContent({
    model,
    contents: `El usuario quiere crear una estrategia de contenido sobre el tema central: "${topic}".`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["id", "title", "description"],
        },
      },
    },
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(response.text) as Pillar[];
};

// --- Step 2: Generate Variations ---

export const generateVariations = async (pillar: Pillar): Promise<Variation[]> => {
  const model = "gemini-3-flash-preview";

  const response = await getAI().models.generateContent({
    model,
    contents: `El usuario ha elegido el Tema Pilar: "${pillar.title}".`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            title: { type: Type.STRING },
            focus: { type: Type.STRING },
          },
          required: ["id", "title", "focus"],
        },
      },
    },
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(response.text) as Variation[];
};

// --- Step 3: Generate Generic Course ---

export const generateCourse = async (
  variation: Variation,
  pillar: Pillar
): Promise<Course> => {
  // Use flash model for better quota limits (gemini-1.5-flash has better free tier limits)
  const model = "gemini-1.5-flash";

  const prompt = `
El usuario ha elegido la variación "${variation.title}" (${variation.focus})
basada en el pilar "${pillar.title}".

Genera un curso completo con 4 a 6 módulos.
`;

  const response = await getAI().models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          targetAudience: { type: Type.STRING },
          learningObjectives: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          colorPalette: { type: Type.STRING },
          modules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                description: { type: Type.STRING },
                keyPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                visualPrompt: { type: Type.STRING },
                quiz: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            text: { type: Type.STRING },
                            label: { type: Type.STRING }
                          },
                          required: ["text", "label"]
                        }
                      },
                      correctLabel: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctLabel"]
                  }
                }
              },
              required: ["id", "title", "subtitle", "description", "keyPoints", "quiz"]
            }
          }
        },
        required: ["title", "description", "modules"]
      }
    }
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(response.text) as Course;
};

// --- Step 4: Generate Curaduría Workshop Course ---

export const generateCuraduriaWorkshopCourse = async (): Promise<Course> => {
  const model = "gemini-1.5-flash";

  const prompt = `
Desarrolla un curso de curaduría concebido como un taller de integración y preparación para el proyecto final.

La curaduría debe ser entendida como una práctica visual, discursiva y política, no solo como una labor técnica. El curso debe articular teoría, práctica y reflexión crítica, y acompañar a las y los estudiantes en el diseño de una mini-curaduría (real o ficticia).

Marco epistemológico y conceptual del curso:
- Archivo y memoria
- Violencia y cuerpo
- Territorio
- Visualidades subalternas
- Futurismos críticos

Nivel del curso: Licenciatura avanzada / Maestría  
Idioma: Español  
Perspectiva: decolonial, feminista y situada  
Contexto: Arte contemporáneo latinoamericano y prácticas curatoriales críticas

El curso debe contener EXACTAMENTE diez (10) módulos, que funcionen de manera autónoma pero articulada como un taller progresivo orientado al proyecto final.

Los módulos deben ser los siguientes (en este orden):

1. ¿Qué es una curaduría?
2. Definición del concepto curatorial
3. Criterios para la selección de obras
4. Orden y disposición: narrativa visual
5. Redacción de textos curatoriales y cédulas
6. Curaduría desde el Sur Global
7. Diseño expositivo y montaje
8. Curaduría colaborativa y ética del trabajo grupal
9. Curaduría como mediación y experiencia del espectador
10. Planeamiento del proyecto final

Para CADA módulo incluye obligatoriamente:
- Un título claro y específico
- Un subtítulo que indique el enfoque conceptual o metodológico
- Una descripción pedagógica que explique por qué este módulo es importante dentro del proceso curatorial
- Entre 4 y 6 puntos clave que sinteticen conceptos, problemas o decisiones curatoriales
- Un visualPrompt para una ilustración conceptual (evita estereotipos; prioriza archivos, espacios expositivos, materiales, mapas, cuerpos, territorios, prácticas)
- Un ejercicio evaluativo en formato de quiz conceptual (no memorístico), con una sola respuesta correcta y distractores plausibles

El curso completo debe incluir además:
- Un título general del curso
- Una descripción general del curso
- El público objetivo
- Entre 4 y 6 objetivos de aprendizaje formulados con verbos de acción (analizar, problematizar, diseñar, articular, etc.)
- Una descripción breve de la paleta estética sugerida (ej. tonos archivo, sobrios, memoria visual, etc.)

Restricciones importantes:
- Evita enfoques eurocéntricos o universalizantes
- Prioriza ejemplos, problemas y sensibilidades del Sur Global
- No asumas conocimientos técnicos previos en museografía
- Usa un lenguaje claro, crítico y pedagógico
- No incluyas referencias a “módulos anteriores” o “este curso”; cada módulo debe ser autónomo

Devuelve EXCLUSIVAMENTE un objeto JSON que siga EXACTAMENTE esta estructura:

{
  "title": string,
  "description": string,
  "targetAudience": string,
  "learningObjectives": string[],
  "colorPalette": string,
  "modules": [
    {
      "id": number,
      "title": string,
      "subtitle": string,
      "description": string,
      "keyPoints": string[],
      "visualPrompt": string,
      "quiz": [
        {
          "question": string,
          "options": [
            { "label": "A", "text": string },
            { "label": "B", "text": string },
            { "label": "C", "text": string },
            { "label": "D", "text": string }
          ],
          "correctLabel": string
        }
      ]
    }
  ]
}

No incluyas texto fuera del JSON.
No reduzcas el número de módulos.
No agregues comentarios ni explicaciones adicionales.
`;

const response = await getAI().models.generateContent({
  model,
  contents: prompt,
  config: {
    systemInstruction: SYSTEM_INSTRUCTION,
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        targetAudience: { type: Type.STRING },
        learningObjectives: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        colorPalette: { type: Type.STRING },
        modules: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              description: { type: Type.STRING },
              keyPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              visualPrompt: { type: Type.STRING },
              quiz: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          label: { type: Type.STRING },
                          text: { type: Type.STRING }
                        },
                        required: ["label", "text"]
                      }
                    },
                    correctLabel: { type: Type.STRING }
                  },
                  required: ["question", "options", "correctLabel"]
                }
              }
            },
            required: [
              "id",
              "title",
              "subtitle",
              "description",
              "keyPoints",
              "visualPrompt",
              "quiz"
            ]
          }
        }
      },
      required: [
        "title",
        "description",
        "targetAudience",
        "learningObjectives",
        "colorPalette",
        "modules"
      ]
    }
  }
});


if (!response.text) {
  console.error("Respuesta completa de Gemini:", response);
  throw new Error("No response from Gemini");
}
  return JSON.parse(response.text) as Course;
};

// --- Step 4: Generate Image ---

export const generateImage = async (prompt: string): Promise<string> => {
  const model = "gemini-2.5-flash-image";

  const response = await getAI().models.generateContent({
    model,
    contents: {
      parts: [{ text: `Create an educational illustration: ${prompt}` }]
    }
  });

  const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (!part?.inlineData) throw new Error("No image generated");

  return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
};
