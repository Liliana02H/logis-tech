document.addEventListener("DOMContentLoaded", function () {

    const tabla = document.querySelector("tbody");
    const botonNuevo = document.querySelector(".btn-accion");
    const buscador = document.querySelector(".buscador");
    const tarjetas = document.querySelectorAll(".tarjeta");

    if (!tabla || !botonNuevo || !buscador) {
        console.error("No se encontraron los elementos de Productos.");
        return;
    }

    let filtroEstado = "todos";

    // Actualizar estadísticas
    function actualizarEstadisticas() {
        const filas = [...tabla.querySelectorAll("tr")];

        let disponibles = 0;
        let agotados = 0;
        const categorias = new Set();

        filas.forEach(fila => {
            const categoria = fila.cells[2].textContent.trim();
            const stock = Number(fila.cells[4].textContent);

            categorias.add(categoria);

            if (stock > 0) {
                disponibles++;
            } else {
                agotados++;
            }
        });

        const datos = document.querySelectorAll(".tarjeta h3");

        datos[0].textContent = filas.length;
        datos[1].textContent = disponibles;
        datos[2].textContent = agotados;
        datos[3].textContent = categorias.size;
    }

    // Buscar y filtrar productos
    function aplicarFiltros() {
        const texto = buscador.value.toLowerCase().trim();

        tabla.querySelectorAll("tr").forEach(fila => {
            const contenido = fila.textContent.toLowerCase();
            const stock = Number(fila.cells[4].textContent);

            const coincideTexto = contenido.includes(texto);

            let coincideEstado = true;

            if (filtroEstado === "disponibles") {
                coincideEstado = stock > 0;
            }

            if (filtroEstado === "agotados") {
                coincideEstado = stock === 0;
            }

            fila.style.display =
                coincideTexto && coincideEstado ? "" : "none";
        });
    }

    // Buscador
    buscador.addEventListener("input", aplicarFiltros);

    // Tarjetas de estadísticas
    tarjetas[0].addEventListener("click", function () {
        filtroEstado = "todos";
        aplicarFiltros();
    });

    tarjetas[1].addEventListener("click", function () {
        filtroEstado = "disponibles";
        aplicarFiltros();
    });

    tarjetas[2].addEventListener("click", function () {
        filtroEstado = "agotados";
        aplicarFiltros();
    });

    // Registrar nuevo producto
    botonNuevo.addEventListener("click", function () {

        const nombre = prompt("Nombre del producto:");
        if (!nombre || !nombre.trim()) return;

        const categoria = prompt("Categoría del producto:");
        if (!categoria || !categoria.trim()) return;

        const precio = prompt("Precio del producto:");
        if (!precio || !precio.trim()) return;

        const stockTexto = prompt("Cantidad disponible:");
        if (stockTexto === null || stockTexto.trim() === "") return;

        const stock = Number(stockTexto);

        if (!Number.isInteger(stock) || stock < 0) {
            alert("Ingresa una cantidad válida.");
            return;
        }

        const filas = [...tabla.querySelectorAll("tr")];
        const ids = filas.map(fila => Number(fila.cells[0].textContent));
        const nuevoId = Math.max(0, ...ids) + 1;

        const fila = document.createElement("tr");

        const datos = [
            nuevoId,
            nombre.trim(),
            categoria.trim(),
            precio.trim(),
            stock
        ];

        datos.forEach(dato => {
            const celda = document.createElement("td");
            celda.textContent = dato;
            fila.appendChild(celda);
        });

        // Estado del producto
        const celdaEstado = document.createElement("td");
        const badge = document.createElement("span");

        if (stock > 0) {
            badge.className = "badge badge-exito";
            badge.textContent = "Disponible";
        } else {
            badge.className = "badge badge-peligro";
            badge.textContent = "Agotado";
        }

        celdaEstado.appendChild(badge);
        fila.appendChild(celdaEstado);

        // Acciones
        const celdaAcciones = document.createElement("td");
        celdaAcciones.className = "acciones";

        ["👁️", "✏️", "🗑️"].forEach(icono => {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.textContent = icono;
            celdaAcciones.appendChild(boton);
        });

        fila.appendChild(celdaAcciones);
        tabla.appendChild(fila);

        actualizarEstadisticas();
        aplicarFiltros();

        alert("Producto registrado correctamente.");
    });
// ACCIONES: VER, EDITAR Y ELIMINAR PRODUCTOS

tabla.addEventListener("click", function(event) {

    const boton = event.target.closest("button");

    if (!boton || !boton.closest(".acciones")) return;

    const fila = boton.closest("tr");
    const botones = [...fila.querySelectorAll(".acciones button")];
    const numero = botones.indexOf(boton);

    // VER PRODUCTO
    if (numero === 0) {
        alert(
            "DETALLES DEL PRODUCTO\n\n" +
            "ID: " + fila.cells[0].textContent +
            "\nProducto: " + fila.cells[1].textContent +
            "\nCategoría: " + fila.cells[2].textContent +
            "\nPrecio: " + fila.cells[3].textContent +
            "\nStock: " + fila.cells[4].textContent +
            "\nEstado: " + fila.cells[5].textContent
        );
    }

    // EDITAR PRODUCTO
    if (numero === 1) {

        const nombre = prompt(
            "Nuevo nombre:",
            fila.cells[1].textContent
        );

        if (nombre === null || !nombre.trim()) return;

        const categoria = prompt(
            "Nueva categoría:",
            fila.cells[2].textContent
        );

        if (categoria === null || !categoria.trim()) return;

        const precio = prompt(
            "Nuevo precio:",
            fila.cells[3].textContent
        );

        if (precio === null || !precio.trim()) return;

        const stockTexto = prompt(
            "Nueva cantidad:",
            fila.cells[4].textContent
        );

        if (stockTexto === null || stockTexto.trim() === "") return;

        const stock = Number(stockTexto);

        if (!Number.isInteger(stock) || stock < 0) {
            alert("Ingresa una cantidad válida.");
            return;
        }

        fila.cells[1].textContent = nombre.trim();
        fila.cells[2].textContent = categoria.trim();
        fila.cells[3].textContent = precio.trim();
        fila.cells[4].textContent = stock;

        const badge = fila.cells[5].querySelector("span");

        if (stock > 0) {
            badge.className = "badge badge-exito";
            badge.textContent = "Disponible";
        } else {
            badge.className = "badge badge-peligro";
            badge.textContent = "Agotado";
        }

        actualizarEstadisticas();
        aplicarFiltros();

        alert("Producto actualizado correctamente.");
    }

    // ELIMINAR PRODUCTO
    if (numero === 2) {

        const confirmar = confirm(
            "¿Deseas eliminar este producto?"
        );

        if (confirmar) {
            fila.remove();

            actualizarEstadisticas();
            aplicarFiltros();

            alert("Producto eliminado correctamente.");
        }
    }

});
    // Cargar estadísticas iniciales
    actualizarEstadisticas();

});