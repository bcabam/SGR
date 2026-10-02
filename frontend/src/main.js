import "./style.css";
import Swal from "sweetalert2";
import {
  createIcons,
  House,
  Building2,
  Users,
  ClipboardList,
  Image,
  CircleCheck,
  ChartNoAxesColumnIncreasing,
  FileText,
  Settings,
  LogOut,
  User,
  Lock,
  Pencil,
  Trash2,
  ChevronLeft,
  Search
} from "lucide";

/* =========================================================
   DATOS TEMPORALES / ESTADO GLOBAL
   ========================================================= */

let delegaciones = [];
let editandoId = null;

const API_DELEGACIONES = "http://localhost/SGR/backend/api/delegaciones";

/* =========================================================
   ICONOS
   ========================================================= */

const iconos = {
  inicio: "house",
  delegaciones: "building-2",
  integrantes: "users",
  actividades: "clipboard-list",
  evidencias: "image",
  validaciones: "circle-check",
  indicadores: "chart-no-axes-column-increasing",
  reportes: "file-text",
  configuracion: "settings",
  usuario: "user",
  candado: "lock",
  cerrar: "log-out",
  editar: "pencil",
  eliminar: "trash-2",
  colapsar: "chevron-left"
};

function actualizarIconos() {
  createIcons({
    icons: {
      House,
      Building2,
      Users,
      ClipboardList,
      Image,
      CircleCheck,
      ChartNoAxesColumnIncreasing,
      FileText,
      Settings,
      LogOut,
      User,
      Lock,
      Pencil,
      Trash2,
      ChevronLeft,
      Search
    }
  });
}

/* =========================================================
   LOGIN
   ========================================================= */

function mostrarLogin() {
  document.querySelector("#app").innerHTML = `
    <main class="login-container">
      <section class="login-card">
        <div class="login-header">
          <h2>SGR</h2>
          <p class="login-subtitle">Sistema de Gestión de Resultados</p>
          <span class="login-institution">Ilustre Municipalidad de La Serena</span>
        </div>
        
        <form id="login-form">
          <div class="form-group">
            <label for="usuario">Usuario</label>
            <div class="input-with-icon">
              <i data-lucide="${iconos.usuario}"></i>
              <input type="text" id="usuario" name="usuario" placeholder="Ingrese su usuario" autocomplete="username" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="input-with-icon">
              <i data-lucide="${iconos.candado}"></i>
              <input type="password" id="password" name="password" placeholder="Ingrese su contraseña" autocomplete="current-risk" required>
            </div>
          </div>

          <p id="login-error" class="error-message" hidden></p>
          
          <button type="submit" id="login-button" class="primary-button login-btn">
            <span>Iniciar sesión</span>
          </button>
        </form>
      </section>
    </main>
  `;

  actualizarIconos();
  document.querySelector("#login-form").addEventListener("submit", iniciarSesion);
}
/* =========================================================
   INICIO DE SESIÓN
   ========================================================= */

async function iniciarSesion(event) {
  event.preventDefault();

  const usuario = document.querySelector("#usuario").value.trim();
  const password = document.querySelector("#password").value;
  const error = document.querySelector("#login-error");
  const submitBtn = document.querySelector("#login-form button[type='submit']");

  // 1. Feedback visual de carga
  submitBtn.disabled = true;
  submitBtn.textContent = "Iniciando sesión...";

  try {
    // Ejecutamos la petición al servidor y esperamos el delay de 1 segundo en paralelo
    const [respuesta] = await Promise.all([
      fetch("http://localhost/SGR/backend/api/auth/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ usuario, password })
      }),
      new Promise(resolve => setTimeout(resolve, 1000)) //
    ]);

    const resultado = await respuesta.json();

    if (respuesta.ok) {
      error.hidden = true;
      mostrarDashboard();
    } else {
      // Si falla, restauramos el botón
      submitBtn.disabled = false;
      submitBtn.textContent = "Iniciar sesión";
      
      error.textContent = resultado.error || "Error al iniciar sesión.";
      error.hidden = false;
    }
  } catch (err) {
    console.error(err);
    // Si hay error de red, restauramos el botón
    submitBtn.disabled = false;
    submitBtn.textContent = "Iniciar sesión";
    
    error.textContent = "Error de conexión con el servidor.";
    error.hidden = false;
  }
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function mostrarDashboard() {
  document.querySelector("#app").innerHTML = `
    <main class="dashboard">
      <!-- BARRA SUPERIOR -->
      <header class="dashboard-header">
        <div class="header-brand">
          <div class="brand-logo">
            <img src="/logo-municipalidad.svg" alt="Municipalidad de La Serena">
          </div>
          <div class="brand-info">
            <strong>Sistema de Gestión de Resultados</strong>
            <span>Municipalidad de La Serena</span>
          </div>
        </div>

        <div class="header-user">
          <div class="user-icon">
            <i data-lucide="${iconos.usuario}"></i>
          </div>
          <div class="user-info">
            <strong>Administrador</strong>
            <span>Administrador del sistema</span>
          </div>
          <button id="logout-button" class="logout-button" title="Cerrar sesión">
            <i data-lucide="${iconos.cerrar}"></i>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      <!-- ESTRUCTURA PRINCIPAL -->
      <div class="dashboard-layout">
        <!-- MENÚ LATERAL -->
        <aside class="sidebar">
          
          <div class="sidebar-toggle-container">
            <button id="toggle-sidebar" class="sidebar-toggle" title="Contraer/Expandir">
              <i data-lucide="${iconos.colapsar}"></i>
            </button>
          </div>

          <nav class="sidebar-nav">
            
            <div class="menu-section">
              <span class="menu-title">PRINCIPAL</span>
              <button class="menu-item active" data-module="inicio" data-tooltip="Inicio">
                <i class="menu-icon" data-lucide="${iconos.inicio}"></i>
                <span class="menu-text">Inicio</span>
              </button>
            </div>

            <div class="menu-section">
              <span class="menu-title">GESTIÓN</span>
              <button class="menu-item" data-module="delegaciones" data-tooltip="Delegaciones">
                <i class="menu-icon" data-lucide="${iconos.delegaciones}"></i>
                <span class="menu-text">Delegaciones</span>
              </button>
              <button class="menu-item" data-module="integrantes" data-tooltip="Integrantes">
                <i class="menu-icon" data-lucide="${iconos.integrantes}"></i>
                <span class="menu-text">Integrantes</span>
              </button>
            </div>

            <div class="menu-section">
              <span class="menu-title">SEGUIMIENTO</span>
              <button class="menu-item" data-module="actividades" data-tooltip="Actividades">
                <i class="menu-icon" data-lucide="${iconos.actividades}"></i>
                <span class="menu-text">Actividades</span>
              </button>
              <button class="menu-item" data-module="evidencias" data-tooltip="Evidencias">
                <i class="menu-icon" data-lucide="${iconos.evidencias}"></i>
                <span class="menu-text">Evidencias</span>
              </button>
              <button class="menu-item" data-module="validaciones" data-tooltip="Validaciones">
                <i class="menu-icon" data-lucide="${iconos.validaciones}"></i>
                <span class="menu-text">Validaciones</span>
              </button>
            </div>

            <div class="menu-section">
              <span class="menu-title">ANÁLISIS</span>
              <button class="menu-item" data-module="indicadores" data-tooltip="Indicadores">
                <i class="menu-icon" data-lucide="${iconos.indicadores}"></i>
                <span class="menu-text">Indicadores</span>
              </button>
              <button class="menu-item" data-module="reportes" data-tooltip="Reportes">
                <i class="menu-icon" data-lucide="${iconos.reportes}"></i>
                <span class="menu-text">Reportes</span>
              </button>
            </div>

            <div class="menu-section">
              <span class="menu-title">SISTEMA</span>
              <button class="menu-item" data-module="configuracion" data-tooltip="Configuración">
                <i class="menu-icon" data-lucide="${iconos.configuracion}"></i>
                <span class="menu-text">Configuración</span>
              </button>
            </div>

          </nav>
        </aside>

        <!-- CONTENIDO -->
        <section id="dashboard-content" class="dashboard-content"></section>
      </div>
    </main>
  `;

  /* ---------- Control de la barra lateral con Memoria (localStorage) ---------- */
  const sidebar = document.querySelector(".sidebar");
  const toggleButton = document.querySelector("#toggle-sidebar");

  // 1. Al cargar, verificamos si el usuario la había dejado contraída ("true")
  const sidebarGuardada = localStorage.getItem("sidebarCollapsed") === "true";
  if (sidebarGuardada) {
    sidebar.classList.add("collapsed");
  }

  // 2. Al hacer clic, alternamos la clase, guardamos el estado y actualizamos íconos si es necesario
  toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    const estaContraida = sidebar.classList.contains("collapsed");
    localStorage.setItem("sidebarCollapsed", estaContraida);
  });

  /* ---------- Eventos generales del Dashboard ---------- */
  document.querySelector("#logout-button").addEventListener("click", async () => {
    try {
      await fetch("http://localhost/SGR/backend/api/auth/logout.php", {
        method: "POST",
        credentials: "include"
      });
    } catch (e) {
      console.error("Error al cerrar sesión en el servidor", e);
    }
    mostrarLogin();
  });

  document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", () => {
      const modulo = item.dataset.module;
      activarMenu(item);

      if (modulo === "inicio") {
        mostrarInicio();
      } else if (modulo === "delegaciones") {
        mostrarDelegaciones();
      } else {
        mostrarModuloEnDesarrollo(item.textContent.trim());
      }
    });
  });

  /* ---------- Vista inicial ---------- */
  mostrarInicio();
  
  actualizarIconos(); 
}

/* =========================================================
   MENÚ ACTIVO
   ========================================================= */

function activarMenu(itemSeleccionado) {
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.remove("active");
  });
  itemSeleccionado.classList.add("active");
}

/* =========================================================
   INICIO (SINCRONIZADO)
   ========================================================= */

async function mostrarInicio() {
  const contenido = document.querySelector("#dashboard-content");

  // Indicador visual de carga
  contenido.innerHTML = `
    <div class="page-header">
      <div>
        <span class="breadcrumb">Principal</span>
        <h2>Inicio</h2>
        <p>Cargando información del sistema...</p>
      </div>
    </div>
  `;

  // Sincronizar datos con la Base de Datos para que no muestre "0"
  try {
    const respuesta = await fetch(`${API_DELEGACIONES}/listar.php`, {
      method: "GET",
      credentials: "include" // FUNDAMENTAL para sesiones PHP
    });

    if (respuesta.ok) {
      delegaciones = await respuesta.json();
    }
  } catch (error) {
    console.error("Error al sincronizar el Inicio:", error);
  }

  contenido.innerHTML = `
    <div class="page-header">
      <div>
        <span class="breadcrumb">Principal</span>
        <h2>Inicio</h2>
        <p>Resumen general del Sistema de Gestión de Resultados.</p>
      </div>
    </div>

    <div class="dashboard-cards">
      <article class="dashboard-card">
        <div class="card-icon">
          <i data-lucide="${iconos.delegaciones}"></i>
        </div>
        <div>
          <span>Delegaciones</span>
          <strong>${delegaciones.length}</strong>
        </div>
      </article>

      <article class="dashboard-card">
        <div class="card-icon">
          <i data-lucide="${iconos.integrantes}"></i>
        </div>
        <div>
          <span>Integrantes</span>
          <strong>0</strong>
        </div>
      </article>

      <article class="dashboard-card">
        <div class="card-icon">
          <i data-lucide="${iconos.actividades}"></i>
        </div>
        <div>
          <span>Actividades</span>
          <strong>0</strong>
        </div>
      </article>

      <article class="dashboard-card">
        <div class="card-icon">
          <i data-lucide="${iconos.validaciones}"></i>
        </div>
        <div>
          <span>Pendientes</span>
          <strong>0</strong>
        </div>
      </article>
    </div>

    <section class="welcome-panel">
      <h3>Bienvenido al SGR</h3>
      <p>Seleccione un módulo desde el menú lateral para comenzar a gestionar la información.</p>
    </section>
  `;

  actualizarIconos();
}

/* =========================================================
   MÓDULOS AÚN NO IMPLEMENTADOS
   ========================================================= */

function mostrarModuloEnDesarrollo(nombreModulo) {
  const contenido = document.querySelector("#dashboard-content");

  contenido.innerHTML = `
    <div class="page-header">
      <div>
        <span class="breadcrumb">Sistema</span>
        <h2>${nombreModulo}</h2>
        <p>Módulo del Sistema de Gestión de Resultados.</p>
      </div>
    </div>

    <section class="empty-module">
      <div class="empty-module-icon">
        <i data-lucide="${iconos.configuracion}"></i>
      </div>
      <h3>Módulo en desarrollo</h3>
      <p>Esta sección será implementada posteriormente.</p>
    </section>
  `;

  actualizarIconos();
}

/* =========================================================
   DELEGACIONES
   ========================================================= */

async function mostrarDelegaciones() {
  const contenido = document.querySelector("#dashboard-content");

  // Feedback inmediato al usuario
  contenido.innerHTML = `
    <div class="page-header">
      <div>
        <span class="breadcrumb">Gestión</span>
        <h2>Delegaciones</h2>
        <p>Cargando registros...</p>
      </div>
    </div>
  `;

  try {
    const respuesta = await fetch(`${API_DELEGACIONES}/listar.php`, {
      method: "GET",
      credentials: "include" // FUNDAMENTAL
    });
    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener las delegaciones.");
    }
    delegaciones = await respuesta.json();
  } catch (error) {
    console.warn("API falló, la tabla se mostrará vacía", error);
    delegaciones = []; // Forzamos a vacío para no romper la interfaz
  }

  contenido.innerHTML = `
    <div class="page-header">
      <div>
        <span class="breadcrumb">Gestión</span>
        <h2>Delegaciones</h2>
        <p>Administración de las delegaciones y unidades organizacionales.</p>
      </div>
      <button id="nueva-delegacion" class="primary-button">+ Nueva delegación</button>
    </div>

  <section class="crud-container">
    <div class="crud-header">
      <div>
        <h3>Delegaciones registradas</h3>
        <span id="contador-delegaciones">${delegaciones.length} registro(s)</span>
      </div>
    </div>

    <div class="search-container">
      <div class="search-input-wrapper">
        <i data-lucide="search"></i>
        <input
          type="text"
          id="buscar-delegacion"
          placeholder="Buscar por nombre o responsable..."
          autocomplete="off"
        >
      </div>
    </div>

    <div class="table-wrapper">
      <table class="crud-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Responsable</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${delegaciones.length > 0
            ? delegaciones.map((delegacion) => `
              <tr>
                <td><strong>${delegacion.nombre}</strong></td>
                <td>${delegacion.responsable}</td>
                <td><span class="status-badge">${delegacion.estado}</span></td>
                <td>
                  <div class="table-actions">
                    <button class="edit-button" data-id="${delegacion.id}" title="Editar delegación">
                      <i data-lucide="${iconos.editar}"></i>
                      <span>Editar</span>
                    </button>
                    <button class="delete-button" data-id="${delegacion.id}" title="Eliminar delegación">
                      <i data-lucide="${iconos.eliminar}"></i>
                      <span>Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            `).join("")
            : `
              <tr>
                <td colspan="4" class="empty-table">No existen delegaciones registradas.</td>
              </tr>
            `
          }
        </tbody>
      </table>
    </div>
  </section>
  `;

  /* ---------- Eventos CRUD ---------- */
  document.querySelector("#nueva-delegacion").addEventListener("click", () => mostrarFormularioDelegacion());

  function asignarEventosTabla() {
    document.querySelectorAll(".edit-button").forEach((button) => {
      button.addEventListener("click", () => {
        const id = Number(button.dataset.id);
        editarDelegacion(id);
      });
    });

    document.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", () => {
        const id = Number(button.dataset.id);
        eliminarDelegacion(id);
      });
    });
  }

  asignarEventosTabla();

  /* ---------- EVENTO DEL BUSCADOR ---------- */
  const buscador = document.querySelector("#buscar-delegacion");

  if(buscador) {
    buscador.addEventListener("input", () => {
      const texto = buscador.value.trim().toLowerCase();

      const resultados = delegaciones.filter((delegacion) => {
        return (
          delegacion.nombre.toLowerCase().includes(texto) ||
          delegacion.responsable.toLowerCase().includes(texto)
        );
      });

      const cuerpoTabla = document.querySelector(".crud-table tbody");

      cuerpoTabla.innerHTML = resultados.length > 0
        ? resultados.map((delegacion) => `
            <tr>
              <td><strong>${delegacion.nombre}</strong></td>
              <td>${delegacion.responsable}</td>
              <td><span class="status-badge">${delegacion.estado}</span></td>
              <td>
                <div class="table-actions">
                  <button class="edit-button" data-id="${delegacion.id}" title="Editar delegación">
                    <i data-lucide="pencil"></i>
                    <span>Editar</span>
                  </button>
                  <button class="delete-button" data-id="${delegacion.id}" title="Eliminar delegación">
                    <i data-lucide="trash-2"></i>
                    <span>Eliminar</span>
                  </button>
                </div>
              </td>
            </tr>
          `).join("")
        : `
            <tr>
              <td colspan="4" class="empty-table">No se encontraron delegaciones.</td>
            </tr>
          `;

      document.querySelector("#contador-delegaciones").textContent = `${resultados.length} registro(s)`;

      actualizarIconos();
      asignarEventosTabla();
    });
  }

  actualizarIconos();
}

/* =========================================================
   FORMULARIO DE DELEGACIÓN
   ========================================================= */

function mostrarFormularioDelegacion(delegacion = null) {
  const contenido = document.querySelector("#dashboard-content");
  editandoId = delegacion ? delegacion.id : null;
  const titulo = delegacion ? "Editar delegación" : "Nueva delegación";

  contenido.innerHTML = `
    <div class="page-header">
      <div>
        <span class="breadcrumb">Gestión / Delegaciones</span>
        <h2>${titulo}</h2>
        <p>Complete la información de la delegación.</p>
      </div>
    </div>

    <section class="form-card">
      <form id="delegacion-form" novalidate>
        
        <div class="form-group">
          <label for="nombre-delegacion">Nombre de la delegación</label>
          <input type="text" id="nombre-delegacion" name="nombre" placeholder="Ej. Delegación Centro" value="${delegacion ? delegacion.nombre : ""}" maxlength="60">
        </div>
        
        <div class="form-group">
          <label for="responsable-delegacion">Responsable</label>
          <input type="text" id="responsable-delegacion" name="responsable" placeholder="Nombre del responsable" value="${delegacion ? delegacion.responsable : ""}" maxlength="60">
        </div>

        <div class="form-group">
          <label for="estado-delegacion">Estado</label>
          <select id="estado-delegacion" name="estado">
            <option value="Activa" ${delegacion?.estado === "Activa" ? "selected" : ""}>Activa</option>
            <option value="Inactiva" ${delegacion?.estado === "Inactiva" ? "selected" : ""}>Inactiva</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="primary-button">
            ${delegacion ? "Guardar cambios" : "Crear delegación"}
          </button>
          <button type="button" id="cancelar" class="secondary-button">Cancelar</button>
        </div>
      </form>
    </section>
  `;

  document.querySelector("#delegacion-form").addEventListener("submit", guardarDelegacion);
  document.querySelector("#cancelar").addEventListener("click", () => {
    editandoId = null;
    mostrarDelegaciones();
  });
}

/* =========================================================
   GUARDAR DELEGACIÓN
   ========================================================= */

async function guardarDelegacion(event) {
  event.preventDefault();

  const nombre = document.querySelector("#nombre-delegacion").value.trim();
  const responsable = document.querySelector("#responsable-delegacion").value.trim();
  const estado = document.querySelector("#estado-delegacion").value;

  // 1. Validaciones previas en el frontend (campos vacíos, longitud, formato)
  if (!nombre || !responsable) {
    await Swal.fire({
      title: "Campos incompletos",
      text: "Debes ingresar el nombre de la delegación y el responsable.",
      icon: "warning",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#ad0000"
    });
    return;
  }

  if (nombre.length > 60 || responsable.length > 60) {
    await Swal.fire({
      title: "Límite excedido",
      text: "El nombre y el responsable no pueden tener más de 60 caracteres.",
      icon: "error",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#ad0000"
    });
    return;
  }

  const regexTexto = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  if (!regexTexto.test(nombre) || !regexTexto.test(responsable)) {
    await Swal.fire({
      title: "Formato inválido",
      text: "Los campos de texto solo pueden contener letras y espacios.",
      icon: "error",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#ad0000"
    });
    return;
  }

  const eraEdicion = editandoId !== null;

  try {
    let respuesta;

    if (eraEdicion) {
      respuesta = await fetch(`${API_DELEGACIONES}/editar.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: editandoId,
          nombre: nombre,
          responsable: responsable,
          estado: estado
        })
      });
    } else {
      respuesta = await fetch(`${API_DELEGACIONES}/crear.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nombre: nombre,
          responsable: responsable,
          estado: estado
        })
      });
    }

    // Convertimos la respuesta a JSON independientemente de si es éxito o error
    const resultado = await respuesta.json();

    // Si el servidor respondió con un código de error (400, 401, 409, 500, etc.)
    if (!respuesta.ok) {
      throw new Error(resultado.error || "Ocurrió un error desconocido en el servidor.");
    }

    editandoId = null;

    // Alerta de éxito con el mensaje del backend o uno por defecto
    await Swal.fire({
      title: eraEdicion ? "Delegación modificada" : "Delegación creada",
      text: resultado.mensaje || (eraEdicion ? "La delegación fue modificada correctamente." : "La delegación fue creada correctamente."),
      icon: "success",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#ad0000"
    });

    await mostrarDelegaciones();

  } catch (error) {
    console.error("Error al guardar:", error);


    await Swal.fire({
      title: "No se pudo guardar",
      text: error.message,
      icon: "error",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#ad0000"
    });
  }
}

/* =========================================================
   EDITAR
   ========================================================= */

function editarDelegacion(id) {
  const delegacion = delegaciones.find(
    (item) => item.id === id
  );

  if (!delegacion) return;

  mostrarFormularioDelegacion(delegacion);
}

/* =========================================================
   ELIMINAR
   ========================================================= */

async function eliminarDelegacion(id) {
  const delegacion = delegaciones.find((item) => item.id === id);
  if (!delegacion) return;

  const resultadoConfirmacion = await Swal.fire({
    title: "¿Eliminar delegación?",
    text: `Se eliminará "${delegacion.nombre}". Esta acción no se puede deshacer.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    confirmButtonColor: "#ad0000",
    cancelButtonColor: "#666666"
  });

  if (!resultadoConfirmacion.isConfirmed) return;

  try {
    const respuesta = await fetch(`${API_DELEGACIONES}/eliminar.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // FUNDAMENTAL
      body: JSON.stringify({ id: id })
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.error || "No fue posible eliminar la delegación.");
    }

    await Swal.fire({
      title: "Delegación eliminada",
      text: resultado.mensaje || "La delegación fue eliminada correctamente.",
      icon: "success",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#ad0000"
    });

    await mostrarDelegaciones();

  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Error",
      text: error.message || "Ocurrió un error al eliminar la delegación.",
      icon: "error",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#ad0000"
    });
  }
}

/* =========================================================
   VERIFICACIÓN DE SESIÓN INICIAL Y ARRANGUE DE LA APP
   ========================================================= */

async function verificarSesionInicial() {
  try {
    const respuesta = await fetch("http://localhost/SGR/backend/api/auth/check-session.php", {
      method: "GET",
      credentials: "include" // Envía la cookie de sesión para que PHP la valide
    });

    if (respuesta.ok) {
      // Si el servidor responde que la sesión es válida, entramos directo al dashboard
      mostrarDashboard();
    } else {
      // Si no hay sesión o expiró, mostramos el login
      mostrarLogin();
    }
  } catch (error) {
    console.error("Error al verificar la sesión:", error);
    mostrarLogin(); // Ante cualquier fallo de red, por seguridad mandamos al login
  }
}

// Arrancamos la aplicación verificando la sesión
verificarSesionInicial();