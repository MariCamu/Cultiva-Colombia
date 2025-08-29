# Arquitectura Recomendada de la Base de Datos en Firestore

Este documento sirve como guía para estructurar los datos de las hojas de Excel en la base de datos de Firestore. La elección entre una **colección** y **datos anidados** dentro de un documento se basa en la eficiencia de las consultas y la relación entre los datos.

---

### 1. Colección: `fichas_tecnicas_cultivos`

Esta es la colección principal para toda la información sobre los cultivos. Cada documento representa una planta específica.

-   **ID del Documento:** Usa un `slug` único (ej: `tomate-cherry`, `lechuga`).
-   **Contenido:** Cada documento contendrá toda la información intrínseca de ese cultivo. Esto es eficiente porque con una sola lectura se obtiene toda la ficha técnica.

**Campos del Documento (Ejemplo: `lechuga`):**

-   `nombre` (string): "Lechuga"
-   `nombreCientifico` (string): "Lactuca sativa"
-   `descripcion` (string): "La lechuga es una planta..."
-   `tags` (array de strings): `["maceta_pequena", "frio", "Andina"]`
-   `dificultad` (number): 2
-   `clima` (map): `{ clase: ["frio", "templado"] }`
-   `region` (map): `{ principal: ["Andina"], nota: "Andina (óptimo)..." }`
-   `compatibilidades` (array de strings): `["cilantro", "fresa", ...]`
-   `incompatibilidades` (array de strings): `["perejil"]`
-   `posicion` (geopoint o map): `{ lat: 4.816, lng: -74.350 }`
-   `imagenes` (array de mapas): `[{ url: "...", attribution: { text: "...", link: "..." } }]`
-   `articulos_relacionados_ids` (array de strings): `["arranque_P_casero", ...]`

-   **`metodos_cultivo` (Array de Mapas - Datos Anidados):**
    -   Cada objeto en el array representa un método de cultivo de esa planta.
    -   **Estructura:**
        ```json
        [
          {
            "nombre": "Siembra en Semillero",
            "pasos": [
              { "descripcion": "Paso 1: Llenar el semillero con sustrato..." },
              { "descripcion": "Paso 2: Colocar 2-3 semillas por celda..." }
            ]
          }
        ]
        ```

-   **`ciclo_vida` (Array de Mapas - Datos Anidados):**
    -   Cada objeto en el array representa una fase del ciclo de vida.
    -   **Estructura:**
        ```json
        [
          { "etapa": "Germinación", "duracion": "5-10 días", "descripcion": "La semilla brota..." },
          { "etapa": "Crecimiento Vegetativo", "duracion": "30-40 días", "descripcion": "Desarrollo de hojas..." }
        ]
        ```

---

### 2. Colección: `plagas_y_enfermedades`

Esta colección centraliza la información sobre plagas para evitar duplicidad.

-   **ID del Documento:** Usa un `slug` único (ej: `pulgon`, `mosca-blanca`).
-   **Contenido:** Cada documento describe una plaga y a qué cultivos afecta.

**Campos del Documento (Ejemplo: `pulgon`):**

-   `nombre` (string): "Pulgón"
-   `descripcion` (string): "Insectos pequeños que succionan la savia..."
-   `tratamiento_organico` (string): "Aplicar jabón potásico..."
-   **`cultivosAfectados` (Array de Strings):**
    -   Contiene los IDs (`slugs`) de los documentos en la colección `fichas_tecnicas_cultivos`.
    -   **Ejemplo:** `["lechuga", "fresa", "tomate-cherry"]`

---

### 3. Colección: `guias_educativas`

Colección para el contenido de las guías, separado de los cultivos.

-   **ID del Documento:** Un ID único (ej: `guia-compostaje`, `actividades-escolares`).
-   **Contenido:** Cada documento es una guía.

**Campos del Documento:**

-   `titulo` (string): "Guía Completa de Compostaje Casero"
-   `contenido` (string): "El compost es el resultado de..."
-   `categoria` (string): "Sostenibilidad"

---

### 4. Colección: `glosario`

Colección para los términos del glosario.

-   **ID del Documento:** Un ID único (ej: `termino-compost`).
-   **Contenido:** Cada documento es una definición.

**Campos del Documento:**

-   `termino` (string): "Compost"
-   `definicion` (string): "Proceso natural de descomposición..."
-   `categoria` (string): "Conceptos Básicos"

---

### 5. Colección de Usuarios y Subcolecciones

Como se discutió previamente, los datos específicos de cada usuario se manejan en subcolecciones para garantizar la escalabilidad.

-   **Colección:** `usuarios`
    -   **Documento:** `{userId}`
        -   **Campos:** `nombre`, `email`, `harvestedCropsCount`, etc.
        -   **Subcolección:** `cultivos_del_usuario`
            -   **Documento:** `{userCropId}` (cada cultivo que el usuario está siguiendo).
        -   **Subcolección:** `alertas`
            -   **Documento:** `{alertId}` (cada alerta generada para el usuario).
