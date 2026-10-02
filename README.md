# SGR — Sistema de Gestión de Resultados
**Proyecto de Ingeniería de Software — Municipalidad de La Serena**

## 1. Descripción del proyecto

El Sistema de Gestión de Resultados (SGR) es un prototipo web desarrollado para gestionar información relacionada con las delegaciones municipales.

El proyecto utiliza PHP, MySQL, HTML, CSS y JavaScript, y se ejecuta en un entorno local mediante WAMP.

## 2. Tecnologías utilizadas

- **Backend:** PHP
- **Base de datos:** MySQL
- **Frontend:** HTML, CSS y JavaScript
- **Entorno de desarrollo:** WAMP
- **Gestor de base de datos:** phpMyAdmin
- **Control de versiones:** Git y GitHub

## 3. Requisitos previos

Antes de ejecutar el proyecto, se debe contar con:

- WAMP instalado y funcionando.
- Apache y MySQL iniciados.
- Un navegador web.
- Git, si se desea clonar el repositorio.

## 4. Instalación del proyecto

### 4.1. Descargar el repositorio

Clonar el repositorio desde una terminal:

```bash
git clone URL_DEL_REPOSITORIO
```

También se puede descargar el proyecto mediante el botón **Code → Download ZIP** de GitHub.

### 4.2. Ubicar el proyecto

Copiar o extraer la carpeta del proyecto dentro del directorio `www` de WAMP.

La ruta debe quedar de la siguiente manera:

```text
C:\wamp64\www\SGR\
```

### 4.3. Importar la base de datos

1. Iniciar WAMP y verificar que MySQL esté funcionando.
2. Abrir phpMyAdmin desde el navegador:

   http://localhost/phpmyadmin/

3. Crear una base de datos con el nombre que utiliza la configuración del proyecto.
4. Seleccionar la base de datos creada.
5. Entrar en la pestaña **Importar**.
6. Seleccionar el archivo SQL incluido en el repositorio:

   `database/sgr.sql`

7. Mantener el formato SQL y pulsar **Importar** o **Continuar**.
8. Verificar que las tablas y los registros se hayan cargado correctamente.

**Nota:** si el archivo SQL crea automáticamente la base de datos, no es necesario crearla previamente. Si aparece un error, comprobar las instrucciones iniciales del archivo SQL y el nombre configurado en la conexión PHP.

## 5. Configuración de la conexión a MySQL

Abrir el archivo de configuración de la conexión:

`backend/config/database.php`

Verificar que los parámetros correspondan a la instalación local de WAMP:

- **Servidor:** `localhost`
- **Usuario:** el usuario de MySQL configurado localmente.
- **Contraseña:** la contraseña de ese usuario.
- **Base de datos:** el nombre de la base de datos importada.

Si los parámetros de conexión son diferentes en cada computador, deberán ajustarse localmente sin subir contraseñas personales al repositorio.

## 6. Ejecución del sistema

Con Apache y MySQL iniciados en WAMP, abrir el navegador y acceder a:

http://localhost/SGR/

Si el proyecto utiliza una ruta específica para el inicio de sesión, acceder a la dirección correspondiente dentro del proyecto.

## 7. Estructura general del proyecto

```text
SGR/
├── backend/
│   ├── api/
│   │   ├── auth/
│   │   └── delegaciones/
│   └── config/
│       └── database.php
├── frontend/
├── database/
│   └── sgr.sql
└── README.md
```

La estructura anterior es referencial y puede variar según la versión actual del repositorio.

## 8. Consideraciones

- La base de datos se ejecuta localmente; no está alojada en GitHub.
- El archivo SQL permite restaurar la estructura y los datos de prueba.
- Los datos incluidos en el respaldo son ficticios y se utilizan con fines académicos.
- Cada integrante debe verificar su configuración local de MySQL.
- No se deben subir contraseñas reales ni credenciales privadas al repositorio.

## 9. Equipo de desarrollo

Proyecto desarrollado en el contexto de la asignatura Ingeniería de Software, correspondiente al Sistema de Gestión de Resultados para las Delegaciones Municipales de La Serena.
