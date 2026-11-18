// ========================================
// LOGIS-TECH - GESTIÓN DE CLIENTES
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const botonNuevo = document.querySelector(".btn-nuevo");
    const buscador = document.querySelector(".buscador");
    const filtro = document.querySelector(".filtro");
    const tabla = document.querySelector("tbody");
    const numeros = document.querySelectorAll(".numero");

    const CLAVE = "logisTechClientes_v2";

    // Clientes iniciales: solo se guardan la primera vez
    let clientes = JSON.parse(localStorage.getItem(CLAVE));

    if (!clientes) {
        clientes = [
            {
                id: 1,
                nombre: "Juan Pérez",
                correo: "juan@gmail.com",
                telefono: "3001234567",
                estado: "Activo",
                avatar: "👨"
            },
            {
                id: 2,
                nombre: "Laura Gómez",
                correo: "laura@gmail.com",
                telefono: "3101234567",
                estado: "Pendiente",
                avatar: "👩"
            },
            {
                id: 3,
                nombre: "Carlos Ruiz",
                correo: "carlos@gmail.com",
                telefono: "3201235788",
                estado: "Activo",
                avatar: "👨"
            }
        ];

        guardarClientes();
    }

    function guardarClientes() {
        localStorage.setItem(CLAVE, JSON.stringify(clientes));
    }

    // ========================================
    // MOSTRAR CLIENTES
    // ========================================

    function mostrarClientes() {

        tabla.innerHTML = "";

        const texto = buscador.value.toLowerCase();
        const estadoFiltro = filtro.value.toLowerCase();

        clientes.forEach(cliente => {

            const coincideTexto =
                cliente.nombre.toLowerCase().includes(texto) ||
                cliente.correo.toLowerCase().includes(texto) ||
                cliente.telefono.includes(texto);

            const coincideEstado =
                estadoFiltro === "todos" ||
                cliente.estado.toLowerCase() ===
                estadoFiltro.replace(/s$/, "");

            if (!coincideTexto || !coincideEstado) return;

            const fila = document.createElement("tr");

            const celdaNombre = document.createElement("td");
            const contenedor = document.createElement("div");
            contenedor.className = "cliente-fila";

            const avatar = document.createElement("div");
            avatar.className = "avatar";
            avatar.textContent = cliente.avatar;

            const nombre = document.createElement("span");
            nombre.textContent = cliente.nombre;

            contenedor.append(avatar, nombre);
            celdaNombre.appendChild(contenedor);

            const correo = document.createElement("td");
            correo.textContent = cliente.correo;

            const telefono = document.createElement("td");
            telefono.textContent = cliente.telefono;

            const celdaEstado = document.createElement("td");
            const badge = document.createElement("span");

            badge.className = cliente.estado === "Activo"
                ? "badge badge-activo"
                : "badge badge-pendiente";

            badge.textContent = cliente.estado;
            celdaEstado.appendChild(badge);

            const acciones = document.createElement("td");
            acciones.className = "acciones";

            [
                ["👁️", "ver"],
                ["✏️", "editar"],
                ["🗑️", "eliminar"]
            ].forEach(([icono, accion]) => {

                const boton = document.createElement("button");
                boton.type = "button";
                boton.textContent = icono;
                boton.dataset.accion = accion;
                boton.dataset.id = cliente.id;

                if (accion === "eliminar") {
                    boton.className = "btn-eliminar";
                }

                acciones.appendChild(boton);
            });

            fila.append(
                celdaNombre,
                correo,
                telefono,
                celdaEstado,
                acciones
            );

            tabla.appendChild(fila);
        });

        actualizarEstadisticas();
    }

    // ========================================
    // ACTUALIZAR ESTADÍSTICAS
    // ========================================

    function actualizarEstadisticas() {

        const total = clientes.length;

        const activos = clientes.filter(
            cliente => cliente.estado === "Activo"
        ).length;

        const pendientes = clientes.filter(
            cliente => cliente.estado === "Pendiente"
        ).length;

        numeros[0].textContent = total;
        numeros[1].textContent = activos;
        numeros[2].textContent = pendientes;
    }

    // ========================================
    // AGREGAR CLIENTE
    // ========================================

    botonNuevo.addEventListener("click", function () {

        const nombre = prompt("Nombre completo del cliente:");
        if (!nombre || !nombre.trim()) return;

        const correo = prompt("Correo electrónico:");
        if (!correo || !correo.trim()) return;

        const telefono = prompt("Número de teléfono:");
        if (!telefono || !telefono.trim()) return;

        const nuevoCliente = {
            id: Date.now(),
            nombre: nombre.trim(),
            correo: correo.trim(),
            telefono: telefono.trim(),
            estado: "Activo",
            avatar: "👤"
        };

        clientes.push(nuevoCliente);

        guardarClientes();
        mostrarClientes();

        alert("Cliente registrado correctamente.");
    });

    // ========================================
    // VER, EDITAR Y ELIMINAR
    // ========================================

    tabla.addEventListener("click", function (evento) {

        const boton = evento.target.closest("button");
        if (!boton) return;

        const id = Number(boton.dataset.id);
        const accion = boton.dataset.accion;

        const cliente = clientes.find(c => c.id === id);
        if (!cliente) return;

        if (accion === "ver") {

            alert(
                "Cliente: " + cliente.nombre +
                "\nCorreo: " + cliente.correo +
                "\nTeléfono: " + cliente.telefono +
                "\nEstado: " + cliente.estado
            );

        } else if (accion === "editar") {

            const nombre = prompt(
                "Nuevo nombre:",
                cliente.nombre
            );

            if (nombre === null || !nombre.trim()) return;

            const correo = prompt(
                "Nuevo correo:",
                cliente.correo
            );

            if (correo === null || !correo.trim()) return;

            const telefono = prompt(
                "Nuevo teléfono:",
                cliente.telefono
            );

            if (telefono === null || !telefono.trim()) return;

            cliente.nombre = nombre.trim();
            cliente.correo = correo.trim();
            cliente.telefono = telefono.trim();

            guardarClientes();
            mostrarClientes();

            alert("Cliente actualizado correctamente.");

        } else if (accion === "eliminar") {

            if (confirm("¿Deseas eliminar este cliente?")) {

                clientes = clientes.filter(c => c.id !== id);

                guardarClientes();
                mostrarClientes();

                alert("Cliente eliminado correctamente.");
            }
        }
    });

    // ========================================
    // BUSCAR Y FILTRAR
    // ========================================

    buscador.addEventListener("input", mostrarClientes);
    filtro.addEventListener("change", mostrarClientes);

    // ========================================
    // INICIAR SISTEMA
    // ========================================

    mostrarClientes();

});