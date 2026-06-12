# Sistema Web de Turismo Local

Sistema web full-stack para la promoción de turismo local mediante códigos QR, autenticación con Google SSO, visualización de lugares turísticos, mapa interactivo y panel administrativo.

## Descripción del proyecto

Sistema Web de Turismo Local es una aplicación desarrollada para el curso de Programación IV de la Universidad Nacional. El proyecto nace como una Prueba de Concepto y evoluciona hacia un producto funcional completo, orientado a facilitar el acceso digital a información turística de pueblos locales.

El sistema permite que un usuario escanee un código QR físico asociado a un pueblo turístico, ingrese a una pantalla pública del destino, inicie sesión con Google y consulte una lista de lugares turísticos recomendados. Además, la aplicación cuenta con un mapa interactivo, filtros de búsqueda, sistema multi-pueblo y un panel administrativo protegido por roles.

La solución implementa una arquitectura cliente-servidor desacoplada, utilizando React en el frontend y Spring Boot en el backend. La información se almacena en PostgreSQL y el sistema se encuentra desplegado en la nube mediante Vercel, Render y GitHub Actions.

## Flujo principal del sistema

1. El usuario escanea un código QR físico.
2. El QR abre la pantalla pública del pueblo turístico.
3. El usuario inicia sesión con Google SSO.
4. El frontend recibe un Google ID Token.
5. El frontend envía el Google ID Token al backend.
6. El backend valida el token con Google.
7. El backend registra o actualiza el usuario.
8. El backend genera un JWT propio del sistema.
9. El frontend guarda el JWT y los datos del usuario.
10. El usuario accede a la lista de lugares turísticos del pueblo.
11. El usuario puede consultar el mapa interactivo y aplicar filtros.
12. Si el usuario tiene rol ADMIN, puede acceder al panel administrativo.

## URLs de producción

### Frontend

https://turismo-local-poc.vercel.app

### Backend

https://turismo-local-backend.onrender.com

### Ruta principal de ejemplo

https://turismo-local-poc.vercel.app/p/playas-del-coco

## Tecnologías utilizadas

### Frontend

* React
* Vite
* Bootstrap
* React Router
* Axios
* Google OAuth Provider
* Google Maps con `@vis.gl/react-google-maps`
* Vitest
* Testing Library

### Backend

* Spring Boot
* Java 17
* Spring Security
* JWT
* Google ID Token Validation
* API REST JSON
* PostgreSQL
* H2 para pruebas
* JUnit
* Mockito
* JaCoCo

### Infraestructura y DevOps

* GitHub
* GitHub Actions
* Vercel
* Render
* PostgreSQL en Render
* SonarCloud

## Estructura del repositorio

```txt
turismo-local-poc/
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   ├── src/
│   │   ├── main/java/com/turismo/backend/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── config/
│   │   │   ├── place/
│   │   │   ├── qr/
│   │   │   ├── security/
│   │   │   ├── town/
│   │   │   └── user/
│   │   │
│   │   └── test/java/com/turismo/backend/
│   │
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── test/
│   │
│   ├── package.json
│   └── vercel.json
│
├── sonar-project.properties
└── README.md
```

## Módulos principales

### Módulos del frontend

* Pantalla pública del pueblo.
* Inicio de sesión con Google.
* Lista de lugares turísticos.
* Búsqueda por nombre o descripción.
* Filtro por categoría.
* Ordenamiento de resultados.
* Vista de mapa interactivo.
* Marcadores geolocalizados.
* Generación y descarga de códigos QR.
* Panel administrativo.
* Gestión de pueblos.
* Gestión de lugares turísticos.
* Gestión de usuarios registrados.
* Página de error personalizada.

### Módulos del backend

* Autenticación con Google.
* Validación de Google ID Token.
* Generación y validación de JWT.
* API REST para pueblos.
* API REST para lugares turísticos.
* API REST para códigos QR.
* API REST para usuarios.
* API REST para administración.
* Seguridad basada en roles.
* Persistencia con PostgreSQL.
* Pruebas unitarias e integración.

## Funcionalidades implementadas

* Autenticación con Google SSO.
* Validación del token de Google en backend.
* Generación de JWT propio.
* Persistencia de usuarios reales.
* Acceso protegido mediante JWT.
* Sistema de roles CLIENT y ADMIN.
* Vista pública por pueblo turístico.
* Sistema multi-pueblo.
* Lista de lugares turísticos por pueblo.
* Mapa interactivo con marcadores.
* Filtros por categoría.
* Búsqueda de lugares.
* Panel administrativo.
* CRUD de pueblos.
* CRUD de lugares turísticos.
* Consulta de usuarios registrados.
* Generación de códigos QR.
* Despliegue público del frontend.
* Despliegue público del backend.
* Pipeline CI/CD con GitHub Actions.

## Endpoints principales

### Endpoints públicos

| Método | Endpoint                   | Descripción                                      |
| ------ | -------------------------- | ------------------------------------------------ |
| POST   | `/api/auth/google`         | Valida el Google ID Token y genera un JWT        |
| GET    | `/api/towns/{slug}`        | Obtiene los datos públicos de un pueblo          |
| GET    | `/api/towns/{slug}/places` | Lista los lugares turísticos de un pueblo        |
| GET    | `/api/towns/{slug}/qr`     | Obtiene la información del QR asociado al pueblo |

### Endpoints para usuario autenticado

| Método | Endpoint        | Descripción                                    |
| ------ | --------------- | ---------------------------------------------- |
| GET    | `/api/users/me` | Obtiene la información del usuario autenticado |

### Endpoints administrativos

| Método | Endpoint                               | Descripción                           |
| ------ | -------------------------------------- | ------------------------------------- |
| GET    | `/api/admin/towns`                     | Lista los pueblos registrados         |
| GET    | `/api/admin/towns/{id}`                | Obtiene un pueblo por ID              |
| POST   | `/api/admin/towns`                     | Crea un pueblo                        |
| PUT    | `/api/admin/towns/{id}`                | Actualiza un pueblo                   |
| PATCH  | `/api/admin/towns/{id}/toggle-active`  | Activa o desactiva un pueblo          |
| DELETE | `/api/admin/towns/{id}`                | Elimina un pueblo                     |
| GET    | `/api/admin/places`                    | Lista los lugares turísticos          |
| GET    | `/api/admin/places/{id}`               | Obtiene un lugar turístico por ID     |
| POST   | `/api/admin/places`                    | Crea un lugar turístico               |
| PUT    | `/api/admin/places/{id}`               | Actualiza un lugar turístico          |
| PATCH  | `/api/admin/places/{id}/toggle-active` | Activa o desactiva un lugar turístico |
| DELETE | `/api/admin/places/{id}`               | Elimina un lugar turístico            |
| GET    | `/api/admin/users`                     | Lista los usuarios registrados        |
| PATCH  | `/api/admin/users/{id}/role`           | Actualiza el rol de un usuario        |

## Modelo de datos

### Town

Representa un pueblo turístico dentro del sistema.

Campos principales:

* `id`
* `slug`
* `name`
* `description`
* `province`
* `country`
* `active`
* `createdAt`
* `updatedAt`

### Place

Representa un lugar turístico asociado a un pueblo.

Campos principales:

* `id`
* `town`
* `name`
* `description`
* `category`
* `address`
* `imageUrl`
* `latitude`
* `longitude`
* `active`
* `createdAt`
* `updatedAt`

### User

Representa un usuario autenticado mediante Google.

Campos principales:

* `id`
* `googleId`
* `email`
* `name`
* `pictureUrl`
* `role`
* `active`
* `createdAt`
* `updatedAt`

### Role

Define los roles disponibles dentro del sistema.

Roles:

* `CLIENT`
* `ADMIN`

## Categorías de lugares turísticos

* `PLAYA`
* `MIRADOR`
* `GASTRONOMIA`
* `PASEOS`
* `CULTURA`
* `RESTAURANTE`
* `OTRO`

## Variables de entorno

### Frontend

Crear un archivo `.env` dentro de la carpeta `frontend/`.

```env
VITE_API_URL=https://turismo-local-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=TU_GOOGLE_CLIENT_ID
VITE_GOOGLE_MAPS_API_KEY=TU_GOOGLE_MAPS_API_KEY
```

### Backend

Variables configuradas en Render o en el entorno local.

```env
DATABASE_URL=jdbc:postgresql://HOST:PORT/DATABASE
DATABASE_USERNAME=USUARIO
DATABASE_PASSWORD=PASSWORD
FRONTEND_BASE_URL=https://turismo-local-poc.vercel.app
GOOGLE_CLIENT_ID=TU_GOOGLE_CLIENT_ID
JPA_DDL_AUTO=update
JPA_SHOW_SQL=false
JWT_SECRET=TU_JWT_SECRET
JWT_EXPIRATION_MS=86400000
PORT=8080
```

## Ejecución local

### Backend

Entrar a la carpeta del backend.

```bash
cd backend
```

Ejecutar la aplicación.

```bash
./mvnw spring-boot:run
```

En Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend local:

```txt
http://localhost:8080
```

### Frontend

Entrar a la carpeta del frontend.

```bash
cd frontend
```

Instalar dependencias.

```bash
npm install
```

Ejecutar la aplicación.

```bash
npm run dev
```

Frontend local:

```txt
http://localhost:5173
```

## Pruebas

### Pruebas del frontend

```bash
cd frontend
npm test
```

Para ejecutar pruebas con cobertura:

```bash
npm run test:coverage
```

Pruebas implementadas:

* `SearchBar.test.jsx`
* `CategoryFilter.test.jsx`
* `AdminStatCard.test.jsx`

### Pruebas del backend

```bash
cd backend
./mvnw test
```

En Windows PowerShell:

```powershell
.\mvnw.cmd test
```

Para ejecutar pruebas y generar reporte de cobertura:

```bash
./mvnw clean verify
```

En Windows PowerShell:

```powershell
.\mvnw.cmd clean verify
```

## CI/CD

El proyecto utiliza GitHub Actions para ejecutar automáticamente pruebas y build del frontend y backend.

El pipeline realiza las siguientes acciones:

1. Instala dependencias del frontend.
2. Ejecuta pruebas del frontend.
3. Genera build del frontend.
4. Ejecuta pruebas del backend.
5. Genera build del backend.
6. Genera reportes de cobertura.
7. Ejecuta análisis de calidad con SonarCloud.

## Calidad de código

El proyecto utiliza SonarCloud para el análisis estático de código.

Métricas esperadas:

* Cero bugs críticos.
* Cero vulnerabilidades críticas.
* Code smells controlados.
* Cobertura mínima del 70%.
* Duplicación menor o igual al 5%.

## Despliegue

### Frontend

El frontend está desplegado en Vercel.

Configuración principal:

* Root Directory: `frontend`
* Framework: Vite
* Install Command: `npm ci`
* Build Command: `npm run build`
* Output Directory: `dist`

Archivo `frontend/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/"
    }
  ]
}
```

### Backend

El backend está desplegado en Render utilizando Docker.

El servicio backend se conecta a una base de datos PostgreSQL desplegada también en Render.

## Seguridad

El sistema utiliza Spring Security con sesiones stateless y autenticación mediante JWT.

Configuración principal:

* CORS habilitado.
* CSRF desactivado.
* Sesiones stateless.
* `/api/auth/google` público.
* `/api/towns/**` público.
* `/api/admin/**` protegido para usuarios con rol ADMIN.
* Resto de endpoints protegidos mediante JWT.

El frontend envía el JWT en cada solicitud protegida mediante el header:

```http
Authorization: Bearer TOKEN
```

## Sistema multi-pueblo

El sistema soporta múltiples pueblos turísticos. Cada pueblo cuenta con su propio `slug`, información pública, lista independiente de lugares turísticos y código QR de acceso.

Pueblos de ejemplo:

* Playas del Coco
* Tamarindo
* Sámara

Rutas de ejemplo:

```txt
https://turismo-local-poc.vercel.app/p/playas-del-coco
https://turismo-local-poc.vercel.app/p/tamarindo
https://turismo-local-poc.vercel.app/p/samara
```

## Códigos QR

El sistema permite generar códigos QR asociados a cada pueblo turístico. Estos QR pueden imprimirse y colocarse físicamente en puntos estratégicos del destino.

Cada QR redirige a la pantalla pública correspondiente del pueblo.

## Documentación técnica

La documentación técnica del proyecto incluye:

* Resumen del PoC inicial.
* Evolución hacia el producto final.
* Diagrama de arquitectura.
* Modelo de datos.
* Flujo OAuth 2.0 con Google.
* Capturas de la aplicación desplegada.
* Capturas del panel administrativo.
* Capturas de GitHub Actions.
* Capturas de SonarCloud.
* Reflexión final del equipo.

## Capturas sugeridas

* Pantalla pública del pueblo.
* Login con Google.
* Lista de lugares turísticos.
* Mapa interactivo.
* Filtros y búsqueda.
* Pantalla de QR.
* Panel administrativo.
* Gestión de lugares.
* Gestión de pueblos.
* Gestión de usuarios.
* GitHub Actions en verde.
* Render backend desplegado.
* Vercel frontend desplegado.
* SonarCloud Quality Gate.

## Integrantes

* Mario Méndez Chaves
* Yazir Zúñiga Morales
* Jonathan Gómez Brenes
* Emmanuel Rodríguez Camareno

## Profesor

Darin Mauricio Gamboa

## Curso

Programación IV
Universidad Nacional
Sede Regional Chorotega, Campus Liberia
I Ciclo 2026
