# Características de Exportación

Este documento describe las características de exportación disponibles en CursoAPP.

## 📤 Formatos de Exportación Disponibles

### 1. Sitio Web Estático (.html)

**Descripción**: Genera un sitio web completo, autónomo y responsive con todo el contenido del curso.

**Características**:
- ✅ Navegación entre módulos con scroll suave
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Estilos CSS integrados (no requiere archivos externos)
- ✅ Imágenes integradas (si están disponibles)
- ✅ Listo para desplegar en cualquier servidor web
- ✅ Compatible con impresión

**Uso**:
1. Abre el curso en la aplicación
2. Haz clic en "Exportar" → "Sitio Web Estático (.html)"
3. Descarga el archivo HTML
4. Despliega en GitHub Pages, Netlify, Vercel, o cualquier servidor

**Estructura Generada**:
- Header con título y descripción del curso
- Sección de metadatos (audiencia, objetivos, estética)
- Navegación sticky
- Módulos completos con:
  - Título y subtítulo
  - Imagen (si disponible)
  - Descripción
  - Puntos clave
  - Evaluación con respuestas correctas marcadas

### 2. Canvas LMS (.html)

**Descripción**: Genera HTML compatible con Canvas Learning Management System.

**Características**:
- ✅ Formato compatible con editor HTML de Canvas
- ✅ Estilos inline y embebidos
- ✅ Estructura clara y organizada
- ✅ Fácil de copiar y pegar en Canvas

**Uso**:
1. Haz clic en "Exportar" → "Canvas LMS (.html)"
2. Descarga el archivo HTML
3. En Canvas:
   - Crea una nueva página
   - Abre el editor HTML (código fuente)
   - Copia y pega el contenido del archivo exportado
   - Guarda la página

**Formato**:
- Header con información del curso
- Módulos separados con `<hr>`
- Preguntas de quiz con respuestas correctas marcadas
- Estilos compatibles con Canvas

### 3. Markdown (.md)

**Descripción**: Exporta el curso en formato Markdown para documentación y versionado.

**Características**:
- ✅ Formato estándar Markdown
- ✅ Compatible con Git y control de versiones
- ✅ Fácil de editar con cualquier editor de texto
- ✅ Puede convertirse a otros formatos (PDF, HTML, etc.)

**Uso**:
- Ideal para documentación
- Versionado con Git
- Conversión a otros formatos con herramientas como Pandoc

### 4. JSON (.json)

**Descripción**: Exporta los datos estructurados del curso en formato JSON.

**Características**:
- ✅ Datos estructurados y parseables
- ✅ Ideal para integración con otras herramientas
- ✅ Análisis programático
- ✅ Preservación de datos

**Uso**:
- Integración con otras aplicaciones
- Análisis de datos
- Backup y preservación
- Importación en otras herramientas

## 🎨 Personalización de Exportaciones

### Modificar Estilos

Los estilos están definidos en `services/exportService.ts`. Puedes modificar:

- Colores: Variables CSS en `:root`
- Fuentes: Familia de fuentes en `body`
- Espaciado: Valores de padding y margin
- Diseño: Grid y flexbox layouts

### Agregar Nuevos Formatos

Para agregar un nuevo formato de exportación:

1. Crea una función en `services/exportService.ts`:
```typescript
export const generateNewFormat = (course: Course): string => {
  // Tu lógica aquí
  return htmlString;
};
```

2. Agrega el botón en `components/CourseView.tsx`:
```typescript
const exportToNewFormat = () => {
  const content = generateNewFormat(course);
  downloadFile(content, 'filename.ext', 'mime/type');
};
```

3. Agrega el botón al menú de exportación

## 📋 Comparación de Formatos

| Formato | Uso Principal | Ventajas | Limitaciones |
|---------|---------------|----------|--------------|
| **Sitio Estático** | Despliegue web independiente | Autónomo, responsive, completo | Archivo grande si hay muchas imágenes |
| **Canvas LMS** | Integración con Canvas | Compatible con LMS, fácil de usar | Limitado por formato Canvas |
| **Markdown** | Documentación, versionado | Texto plano, fácil de editar | Requiere conversión para visualización |
| **JSON** | Datos, integración | Estructurado, parseable | No es visual por sí mismo |

## 🚀 Mejores Prácticas

### Para Sitios Estáticos

1. **Despliegue**: Usa GitHub Pages, Netlify, o Vercel para hosting gratuito
2. **Dominio**: Puedes usar un dominio personalizado
3. **CDN**: Considera usar un CDN para imágenes si el sitio es grande
4. **SEO**: Agrega meta tags adicionales si es necesario

### Para Canvas

1. **Prueba primero**: Prueba con un módulo antes de exportar todo el curso
2. **Revisa formato**: Verifica que el HTML se vea bien en Canvas
3. **Imágenes**: Si hay imágenes, asegúrate de que estén accesibles
4. **Edición**: Puedes editar el HTML después de importarlo en Canvas

### Para Markdown/JSON

1. **Versionado**: Usa Git para rastrear cambios
2. **Backup**: Guarda copias de los archivos exportados
3. **Conversión**: Usa herramientas como Pandoc para convertir Markdown a otros formatos

## 🔧 Solución de Problemas

### El sitio estático no se ve bien

- Verifica que el archivo HTML esté completo
- Abre la consola del navegador para ver errores
- Asegúrate de que las imágenes estén accesibles

### Canvas no muestra el contenido correctamente

- Verifica que estés usando el editor HTML (código fuente)
- Revisa que no haya caracteres especiales que Canvas no soporte
- Prueba con un módulo pequeño primero

### Las imágenes no aparecen

- Las imágenes se integran como base64 en el HTML
- Si las imágenes son muy grandes, el archivo puede ser pesado
- Considera usar URLs externas para imágenes grandes

## 📚 Recursos Adicionales

- Ver `README.md` para información general
- Ver `TEMPLATE_GUIDE.md` para personalización
- Ver `ACADEMIC_LANGUAGE.md` para uso académico

---

**Nota**: Todos los formatos de exportación preservan el contenido completo del curso. Elige el formato según tu caso de uso específico.

