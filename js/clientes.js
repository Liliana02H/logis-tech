// ==================================================
// LOGIS-TECH - GESTIÓN DE CLIENTES
// Guardado permanente en el navegador
// ==================================================

const botonNuevo = document.querySelector(".btn-nuevo");
const buscador = document.querySelector(".buscador");
const filtro = document.querySelector(".filtro");
const tabla = document.querySelector("tbody");

const CLAVE_CLIENTES = "logisTechClientesV2";

// ==================================================
// CARGAR Y CONSERVAR LOS CLIENTES
// ==================================================

function cargarClientes() {
    const clientesGuardados = localStorage.getItem(CLAVE_CLIENTES);

    if (clientesGuardados !== null) {
        tabla.innerHTML = clientesGuardados;
    } else {
        // Guardar los tres clientes iniciales
        guardarClientes();
    }

    actualizarEstadisticas();
}

function guardarClientes() {
    localStorage.setItem(CLAVE_CLIENTES, tabla.innerHTML);
}

// ==================================================
// ACTUALIZAR ESTADÍSTICAS
// ==================================================

function actualizarEstadisticas() {
    const filas = [...tabla.querySelectorAll("tr")];

    const total = filas.length;

    const activos = filas.filter(fila =>
        fila.cells[3].textContent.trim().toLowerCase() === "activo"
    ).length;

    const pendientes = filas.filter(fila =>
        fila.cells[3].textContent.trim().toLowerCase() === "pendiente"
    ).length;

    const numeros = document.querySelectorAll(".numero");

    numeros[0].textContent = total;
    numeros[1].textContent = activos;
    numeros[2].textContent = pendientes;
}

// ==================================================
// BUSCAR Y FILTRAR CLIENTES
// ==================================================

function filtrarClientes() {
    const texto = buscador.value.toLowerCase().trim();
    const estado = filtro.value.toLowerCase();

    tabla.querySelectorAll("tr").forEach(fila => {
        const contenido = fila.textContent.toLowerCase();
        const estadoCliente = fila.cells[3].textContent
            .trim()
            .toLowerCase();

        const coincideTexto = contenido.includes(texto);

        const coincideEstado =
            estado === "todos" ||
            estadoCliente === estado.replace(/s$/, "");

        fila.style.display =
            coincideTexto && coincideEstado ? "" : "none";
    });
}

buscador.addEventListener("input", filtrarClientes);
filtro.addEventListener("change", filtrarClientes);

// ==================================================
// REGISTRAR NUEVO CLIENTE
// ==================================================

botonNuevo.addEventListener("click", function() {

    const nombre = prompt("Nombre completo del cliente:");
    if (!nombre || !nombre.trim()) return;

    const correo = prompt("Correo electrónico:");
    if (!correo || !correo.trim()) return;

    const telefono = prompt("Número de teléfono:");
    if (!telefono || !telefono.trim()) return;

    const fila = document.createElement("tr");

    const celdaNombre = document.createElement("td");

    const contenedor = document.createElement("div");
    contenedor.className = "cliente-fila";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = "👤";

    const nombreTexto = document.createElement("span");
    nombreTexto.textContent = nombre.trim();

    contenedor.append(avatar, nombreTexto);
    celdaNombre.appendChild(contenedor);

    const celdaCorreo = document.createElement("td");
    celdaCorreo.textContent = correo.trim();

    const celdaTelefono = document.createElement("td");
    celdaTelefono.textContent = telefono.trim();

    const celdaEstado = document.createElement("td");

    const badge = document.createElement("span");
    badge.className = "badge badge-activo";
    badge.textContent = "Activo";

    celdaEstado.appendChild(badge);

    const celdaAcciones = document.createElement("td");
    celdaAcciones.className = "acciones";

    ["👁️", "✏️", "🗑️"].forEach((icono, indice) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = icono;

        if (indice === 2) {
            boton.className = "btn-eliminar";
        }

        celdaAcciones.appendChild(boton);
    });

    fila.append(
        celdaNombre,
        celdaCorreo,
        celdaTelefono,
        celdaEstado,
        celdaAcciones
    );

    tabla.appendChild(fila);

    guardarClientes();
    actualizarEstadisticas();
    filtrarClientes();

    alert("Cliente registrado y guardado correctamente.");
});

// ==================================================
// VER, EDITAR Y ELIMINAR CLIENTES
// ==================================================

tabla.addEventListener("click", function(evento) {

    const boton = evento.target.closest("button");

    if (!boton) return;

    const fila = boton.closest("tr");

    if (!fila) return;

    const botones = [...fila.querySelectorAll("button")];
    const numero = botones.indexOf(boton);

    // VER CLIENTE
    if (numero === 0) {
        alert(
            "CLIENTE: " + fila.cells[0].innerText +
            "\nCORREO: " + fila.cells[1].textContent +
            "\nTELÉFONO: " + fila.cells[2].textContent +
            "\nESTADO: " + fila.cells[3].textContent
        );
    }

    // EDITAR CLIENTE
    else if (numero === 1) {

        const nombreActual = fila.cells[0].querySelector("span");

        const nuevoNombre = prompt(
            "Nuevo nombre del cliente:",
            nombreActual.textContent.trim()
        );

        if (nuevoNombre && nuevoNombre.trim()) {
            nombreActual.textContent = nuevoNombre.trim();

            guardarClientes();
            alert("Cliente actualizado correctamente.");
        }
    }

    // ELIMINAR CLIENTE
    else if (numero === 2) {

        if (confirm("¿Deseas eliminar este cliente?")) {

            fila.remove();

            guardarClientes();
            actualizarEstadisticas();
            filtrarClientes();

            alert("Cliente eliminado correctamente.");
        }
    }

});

// ==================================================
// INICIAR SISTEMA
// ==================================================

cargarClientes();