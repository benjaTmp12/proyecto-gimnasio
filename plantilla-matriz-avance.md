# Matriz de Avance - Hito 1

| GEN-01: Estructura del repo y README | Desarrollado | Estructura base, README y .gitignore listos
| GEN-02: Variables de entorno | Desarrollado | .env.example listo y documentado en README
| GEN-03: Conexión BD y migraciones | Desarrollado | Conectado a MySQL, migraciones creadas 
| rq-01: Modelo Socio | Desarrollado | Modelo y migración listos
| rq-02: Modelo Membresía | Desarrollado | Modelo y migración listos 

# Matriz de Avance - Hito 2
| **GEN-04: Registro de usuarios** | Implementado | Se creó el modelo `Usuario` y el controlador para la ruta `POST /api/auth/registro`. Las contraseñas son encriptadas utilizando `bcryptjs` antes de persistir en MySQL, y se valida la unicidad del correo electrónico. |
| **GEN-05: Login y emisión JWT** | Implementado | Se desarrolló la ruta `POST /api/auth/login`. El sistema verifica el hash de la contraseña y, si es correcto, emite un token JWT (JSON Web Token) válido por 8 horas, devolviéndolo al cliente para su almacenamiento. |
| **GEN-06: Middleware de autenticación** | Implementado | Se creó el interceptor `authMiddleware.js`. Este middleware exige la presencia de un token válido en la cabecera `Authorization` (formato Bearer) para permitir el acceso a las rutas de negocio. Devuelve un error 401 si no hay token o expiró. |
| **rq-03: CRUD Gestión de gimnasio** | Implementado | Se implementaron las rutas REST y los controladores completos para la entidad `Socio` (GET, POST, PUT, DELETE). Estas rutas están protegidas globalmente por el middleware de autenticación del GEN-06. |
| **rq-08: Panel o listado principal** | Implementado | Se construyó una Single Page Application (SPA) utilizando Vue 3 y Vite. El frontend cuenta con componentes separados (`Login.vue` y `PanelSocios.vue`), almacena el JWT de forma local, y consume las rutas protegidas de la API para visualizar y gestionar a los socios de forma reactiva. |