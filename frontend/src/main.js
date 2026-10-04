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
  Search,
  TriangleAlert
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
      Search,
      TriangleAlert
    }
  });
}

/* =========================================================
   FUNCIONES AUXILIARES UX
   ========================================================= */
function obtenerSaludo() {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return "Buenos días";
  if (hora >= 12 && hora < 20) return "Buenas tardes";
  return "Buenas noches";
}

function mostrarPantallaDespedida() {
  document.querySelector("#app").innerHTML = `
    <div class="logout-screen">
      <h2>Cerrando sesión<span class="dots"><span>.</span><span>.</span><span>.</span></span></h2>
      <p>Vuelva pronto :-)</p>
    </div>
  `;
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
          <div class="form-group" id="user-group">
            <label for="usuario">Usuario</label>
            <div class="input-with-icon">
              <i data-lucide="user"></i>
              <input type="text" id="usuario" name="usuario" placeholder="Ingrese su usuario" autocomplete="username" required>
            </div>
          </div>
          
          <div class="form-group step-hidden" id="pass-group">
            <label for="password">Contraseña</label>
            <div class="input-with-icon">
              <i data-lucide="lock"></i>
              <input type="password" id="password" name="password" placeholder="Ingrese su contraseña" autocomplete="current-password" required>
            </div>
          </div>

          <!-- Mensaje de error oculto por defecto -->
          <div id="login-error" class="error-message oculto"></div>
          
          <div class="step-hidden" id="btn-group">
            <button type="submit" id="login-button" class="primary-button login-btn">
              <span>Iniciar sesión</span>
            </button>
          </div>
        </form>
        
        <div class="login-footer">
          <p class="love">Hecho con ❤️</p>
          <p class="secret">y con lágrimas...</p>
          <p class="team">Benjamín Caba, Silvana Bastida, Jorge Pavez</p>
          <p class="role">Estudiantes de Ingeniería en Informática</p>
        </div>
      </section>
    </main>
  `;

  actualizarIconos();
  document.querySelector("#login-form").addEventListener("submit", iniciarSesion);

  const userField = document.querySelector("#usuario");
  const passField = document.querySelector("#password");
  const passGroup = document.querySelector("#pass-group");
  const btnGroup = document.querySelector("#btn-group");
  const errorElement = document.querySelector("#login-error");

  const verificarCampos = () => {
    // Si el usuario modifica los campos, ocultamos suavemente el mensaje
    if (!errorElement.classList.contains("oculto")) {
      errorElement.classList.add("oculto");
      // Vaciamos el texto 400ms después, cuando la animación ya terminó
      setTimeout(() => { errorElement.innerHTML = ""; }, 400); 
    }

    if (userField.value.trim().length > 0) {
      passGroup.classList.replace("step-hidden", "step-visible");
    } else {
      passGroup.classList.replace("step-visible", "step-hidden");
      btnGroup.classList.replace("step-visible", "step-hidden");
    }
    
    if (passField.value.trim().length > 0) {
      btnGroup.classList.replace("step-hidden", "step-visible");
    } else {
      btnGroup.classList.replace("step-visible", "step-hidden");
    }
  };

  userField.addEventListener("input", verificarCampos);
  passField.addEventListener("input", verificarCampos);
  
  setTimeout(verificarCampos, 100);
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

  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Iniciando sesión<span class="dots"><span>.</span><span>.</span><span>.</span></span>';

  try {
    const [respuesta] = await Promise.all([
      fetch("http://localhost/SGR/backend/api/auth/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ usuario, password })
      }),
      new Promise(resolve => setTimeout(resolve, 1000)) 
    ]);

    const resultado = await respuesta.json();

    if (respuesta.ok) {
      error.classList.add("oculto"); // Aseguramos que se oculte al entrar
      mostrarDashboard();
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = "Iniciar sesión";
      error.innerHTML = `<i data-lucide="triangle-alert" class="shake-icon"></i> <span>Credenciales incorrectas.</span>`;
      actualizarIconos(); 
      error.classList.remove("oculto"); // Despliega suavemente
    }
  } catch (err) {
    console.error(err);
    submitBtn.disabled = false;
    submitBtn.textContent = "Iniciar sesión";
    error.innerHTML = `<i data-lucide="triangle-alert" class="shake-icon"></i> <span>Error de conexión.</span>`;
    actualizarIconos();
    error.classList.remove("oculto"); // Despliega suavemente
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
          <a href="#" id="btn-mi-cuenta" class="user-account-link">Mi cuenta</a>
          <button id="logout-button" class="logout-button" title="Cerrar sesión">
            <i data-lucide="${iconos.cerrar}"></i>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      <!-- ESTRUCTURA PRINCIPAL -->
      <div class="dashboard-layout">
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

        <section id="dashboard-content" class="dashboard-content"></section>
      </div>
    </main>
  `;

  const sidebar = document.querySelector(".sidebar");
  const toggleButton = document.querySelector("#toggle-sidebar");
  const sidebarGuardada = localStorage.getItem("sidebarCollapsed") === "true";
  const esMovil = window.innerWidth <= 600;

  if (sidebarGuardada || esMovil) {
    sidebar.classList.add("collapsed");
  }

  toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    const estaContraida = sidebar.classList.contains("collapsed");
    localStorage.setItem("sidebarCollapsed", estaContraida);
  });

  /* ---------- Evento "Mi cuenta" ---------- */
  document.querySelector("#btn-mi-cuenta").addEventListener("click", (e) => {
    e.preventDefault();
    const btnConfig = document.querySelector('[data-module="configuracion"]');
    if(btnConfig) activarMenu(btnConfig);
    mostrarModuloEnDesarrollo("Configuración");
    if (window.innerWidth <= 600) sidebar.classList.add("collapsed");
  });

  /* ---------- Evento de Cierre de Sesión ---------- */
  document.querySelector("#logout-button").addEventListener("click", async () => {
    mostrarPantallaDespedida();
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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

      if (window.innerWidth <= 600) {
        sidebar.classList.add("collapsed");
      }
    });
  });

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
   INICIO (SINCRONIZADO Y CON SALUDO)
   ========================================================= */

async function mostrarInicio() {
  const contenido = document.querySelector("#dashboard-content");

  contenido.innerHTML = `
    <div class="page-header">
      <div>
        <span class="breadcrumb">Principal</span>
        <h2>${obtenerSaludo()}, Administrador.</h2>
        <p>Cargando información del sistema...</p>
      </div>
    </div>
  `;

  try {
    const respuesta = await fetch(`${API_DELEGACIONES}/listar.php`, {
      method: "GET",
      credentials: "include" 
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
        <h2>${obtenerSaludo()}, Administrador.</h2>
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
      credentials: "include"
    });
    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener las delegaciones.");
    }
    delegaciones = await respuesta.json();
  } catch (error) {
    console.warn("API falló, la tabla se mostrará vacía", error);
    delegaciones = [];
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
   FORMULARIO DE DELEGACIÓN (MODERNO CON PREFIJO)
   ========================================================= */

function mostrarFormularioDelegacion(delegacion = null) {
  const contenido = document.querySelector("#dashboard-content");
  editandoId = delegacion ? delegacion.id : null;
  const titulo = delegacion ? "Editar delegación" : "Nueva delegación";

  // Si editamos, quitamos la palabra "Delegación " o "Delegacion " de la interfaz para que quede limpia
  let nombreMostrado = "";
  if (delegacion) {
    nombreMostrado = delegacion.nombre.replace(/^Delegaci[oó]n\s+/i, "");
  }

  contenido.innerHTML = `
    <div class="page-header">
      <div>
        <span class="breadcrumb">Gestión / Delegaciones</span>
        <h2>${titulo}</h2>
        <p>Complete la información de la unidad organizacional.</p>
      </div>
    </div>

    <section class="form-card">
      <form id="delegacion-form" novalidate>
        
        <div class="form-group">
          <label for="nombre-delegacion">Nombre de la unidad</label>
          <div class="input-prefix-group">
            <span class="input-prefix">Delegación</span>
            <input type="text" id="nombre-delegacion" name="nombre" placeholder="Centro, Las Compañías, La Antena..." value="${nombreMostrado}" maxlength="45">
          </div>
        </div>
        
        <div class="form-group">
          <label for="responsable-delegacion">Responsable</label>
          <input type="text" id="responsable-delegacion" name="responsable" placeholder="Nombre completo del responsable" value="${delegacion ? delegacion.responsable : ""}" maxlength="60">
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

  // El usuario solo escribe el sector, ej: "Centro"
  const nombreCrudo = document.querySelector("#nombre-delegacion").value.trim();
  const responsable = document.querySelector("#responsable-delegacion").value.trim();
  const estado = document.querySelector("#estado-delegacion").value;

  if (!nombreCrudo || !responsable) {
    await Swal.fire({
      title: "Campos incompletos",
      text: "Debes ingresar el nombre y el responsable.",
      icon: "warning",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#ad0000"
    });
    return;
  }

  // Concatenamos automáticamente el prefijo para la base de datos
  const nombreFinal = "Delegación " + nombreCrudo;

  if (nombreFinal.length > 60 || responsable.length > 60) {
    await Swal.fire({
      title: "Límite excedido",
      text: "El texto introducido es demasiado largo.",
      icon: "error",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#ad0000"
    });
    return;
  }

  const regexTexto = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  if (!regexTexto.test(nombreCrudo) || !regexTexto.test(responsable)) {
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

  // --- VALIDACIÓN UX: Evitar guardar si no hubo cambios ---
  if (eraEdicion) {
    const delegacionOriginal = delegaciones.find(d => d.id === editandoId);
    if (delegacionOriginal && delegacionOriginal.nombre === nombreFinal && delegacionOriginal.responsable === responsable && delegacionOriginal.estado === estado) {
      await Swal.fire({
        title: "Sin cambios",
        text: "No has realizado ninguna modificación en el registro.",
        icon: "info",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#ad0000"
      });
      return; 
    }
  }

  try {
    let respuesta;

    if (eraEdicion) {
      respuesta = await fetch(`${API_DELEGACIONES}/editar.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: editandoId,
          nombre: nombreFinal,
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
          nombre: nombreFinal,
          responsable: responsable,
          estado: estado
        })
      });
    }

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.error || "Ocurrió un error desconocido en el servidor.");
    }

    editandoId = null;

    await Swal.fire({
      title: eraEdicion ? "Delegación modificada" : "Delegación creada",
      text: resultado.mensaje || (eraEdicion ? "La modificación se aplicó correctamente." : "El registro se guardó correctamente."),
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
      credentials: "include",
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
   VERIFICACIÓN DE SESIÓN INICIAL
   ========================================================= */

async function verificarSesionInicial() {
  try {
    const respuesta = await fetch("http://localhost/SGR/backend/api/auth/check-session.php", {
      method: "GET",
      credentials: "include" 
    });

    const resultado = await respuesta.json();

    if (respuesta.ok && resultado.autenticado) {
      mostrarDashboard();
    } else {
      mostrarLogin();
    }
  } catch (error) {
    console.error("Error al verificar la sesión:", error);
    mostrarLogin(); 
  }
}

verificarSesionInicial();