// ========================================
// LOGIS-TECH - GESTIÓN DE USUARIOS
// ========================================

const botonNuevo = document.querySelector(".btn-nuevo");
const buscadorUsuarios = document.querySelector(".buscador");
const filtroUsuarios = document.querySelector(".filtro");
const tablaUsuarios = document.querySelector("tbody");

// Buscar usuarios
buscadorUsuarios.addEventListener("input", filtrarUsuarios);

// Filtrar por estado
filtroUsuarios.addEventListener("change", filtrarUsuarios);

function filtrarUsuarios() {
    const texto = buscadorUsuarios.value.toLowerCase();
    const estado = filtroUsuarios.value.toLowerCase();

    document.querySelectorAll("tbody tr").forEach(fila => {
        const contenido = fila.textContent.toLowerCase();
        const estadoUsuario = fila.cells[3].textContent.toLowerCase();

        const coincideTexto = contenido.includes(texto);
        const coincideEstado =
            estado === "todos" || estadoUsuario === estado.slice(0, -1);

        fila.style.display =
            coincideTexto && coincideEstado ? "" : "none";
    });
}

// Registrar nuevo usuario
botonNuevo.addEventListener("click", function () {
    const nombre = prompt("Nombre completo del usuario:");
    if (!nombre || !nombre.trim()) return;

    const correo = prompt("Correo electrónico:");
    if (!correo || !correo.trim()) return;

    const rol = prompt("Rol: Administrador, Empleado o Supervisor:");
    if (!rol || !rol.trim()) return;

    const fila = document.createElement("tr");

    const celdaUsuario = document.createElement("td");
    const usuario = document.createElement("div");
    usuario.className = "usuario-fila";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = "👤";

    const nombreUsuario = document.createElement("span");
    nombreUsuario.textContent = nombre.trim();

    usuario.append(avatar, nombreUsuario);
    celdaUsuario.appendChild(usuario);

    const celdaCorreo = document.createElement("td");
    celdaCorreo.textContent = correo.trim();

    const celdaRol = document.createElement("td");
    celdaRol.textContent = rol.trim();

    const celdaEstado = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "badge badge-activo";
    badge.textContent = "Activo";
    celdaEstado.appendChild(badge);

    const celdaAcciones = document.createElement("td");
    celdaAcciones.className = "acciones";

    ["👁️", "✏️", "🗑️"].forEach(icono => {
        const boton = document.createElement("button");
        boton.textContent = icono;
        if (icono === "🗑️") boton.className = "btn-eliminar";
        celdaAcciones.appendChild(boton);
    });

    fila.append(
        celdaUsuario,
        celdaCorreo,
        celdaRol,
        celdaEstado,
        celdaAcciones
    );

    tablaUsuarios.appendChild(fila);
    actualizarEstadisticas();

    alert("Usuario registrado correctamente.");
});

// Acciones de la tabla
tablaUsuarios.addEventListener("click", function (evento) {
    const boton = evento.target.closest("button");
    if (!boton) return;

    const fila = boton.closest("tr");
    const numeroBoton = [...fila.querySelectorAll("button")].indexOf(boton);

    if (numeroBoton === 0) {
        alert("Usuario: " + fila.cells[0].innerText +
              "\nCorreo: " + fila.cells[1].innerText +
              "\nRol: " + fila.cells[2].innerText);
    }

    if (numeroBoton === 1) {
        const nombre = prompt(
            "Nuevo nombre:",
            fila.querySelector(".usuario-fila span").textContent
        );

        if (nombre && nombre.trim()) {
            fila.querySelector(".usuario-fila span").textContent =
                nombre.trim();
        }
    }

    if (numeroBoton === 2) {
        if (confirm("¿Deseas eliminar este usuario?")) {
            fila.remove();
            actualizarEstadisticas();
        }
    }
});

// Actualizar estadísticas
function actualizarEstadisticas() {
    const filas = [...tablaUsuarios.querySelectorAll("tr")];

    document.querySelectorAll(".numero")[0].textContent = filas.length;

    document.querySelectorAll(".numero")[1].textContent =
        filas.filter(f => f.cells[3].textContent.trim() === "Activo").length;

    document.querySelectorAll(".numero")[2].textContent =
        filas.filter(f => f.cells[3].textContent.trim() === "Pendiente").length;
}

actualizarEstadisticas();