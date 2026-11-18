document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.querySelector("tbody");
    const botonNuevo = document.querySelector(".cabecera .btn-accion");
    const tarjetas = document.querySelectorAll(".tarjeta h3");
// FILTRAR PEDIDOS AL HACER CLIC EN LAS TARJETAS
const tarjetasContenedor = document.querySelectorAll(".tarjeta");

tarjetasContenedor.forEach((tarjeta, indice) => {
    tarjeta.style.cursor = "pointer";

    tarjeta.addEventListener("click", () => {
        const filas = tabla.querySelectorAll("tr");

        filas.forEach(fila => {
            const estado = fila.cells[5].textContent.toLowerCase();

            if (indice === 0) {
                // Todos los pedidos
                fila.style.display = "";
            } else if (indice === 1) {
                // Pendientes
                fila.style.display =
                    estado.includes("proceso") ||
                    estado.includes("pendiente") ? "" : "none";
            } else if (indice === 2) {
                // Completados
                fila.style.display =
                    estado.includes("entregado") ||
                    estado.includes("completado") ? "" : "none";
            } else if (indice === 3) {
                // Cancelados
                fila.style.display =
                    estado.includes("cancelado") ? "" : "none";
            }
        });
    });
});
    // ACTUALIZAR LAS TARJETAS
    function actualizarEstadisticas() {
        const filas = Array.from(tabla.querySelectorAll("tr"));

        const total = filas.length;
        const pendientes = filas.filter(fila =>
            fila.cells[5].textContent.toLowerCase().includes("proceso") ||
            fila.cells[5].textContent.toLowerCase().includes("pendiente")
        ).length;

        const completados = filas.filter(fila =>
            fila.cells[5].textContent.toLowerCase().includes("entregado") ||
            fila.cells[5].textContent.toLowerCase().includes("completado")
        ).length;

        const cancelados = filas.filter(fila =>
            fila.cells[5].textContent.toLowerCase().includes("cancelado")
        ).length;

        tarjetas[0].textContent = total;
        tarjetas[1].textContent = pendientes;
        tarjetas[2].textContent = completados;
        tarjetas[3].textContent = cancelados;
    }

    // CREAR NUEVO PEDIDO
    botonNuevo.addEventListener("click", () => {
        const cliente = prompt("Nombre del cliente:");
        if (cliente === null || cliente.trim() === "") return;

        const producto = prompt("Nombre del producto:");
        if (producto === null || producto.trim() === "") return;

        const total = prompt("Valor total del pedido:");
        if (total === null || total.trim() === "") return;

        const fecha = prompt("Fecha del pedido (DD/MM/AAAA):",
            new Date().toLocaleDateString("es-CO")
        );
        if (fecha === null || fecha.trim() === "") return;

        const estado = prompt(
            "Escribe el estado del pedido:\nEntregado\nEn proceso\nCancelado",
            "En proceso"
        );

        if (estado === null || estado.trim() === "") return;

        const estadosValidos = ["entregado", "en proceso", "cancelado"];

        if (!estadosValidos.includes(estado.trim().toLowerCase())) {
            alert("Estado no válido. Usa Entregado, En proceso o Cancelado.");
            return;
        }

        const numero = String(tabla.querySelectorAll("tr").length + 1).padStart(3, "0");

        const fila = document.createElement("tr");

        const datos = [
            "#" + numero,
            cliente.trim(),
            producto.trim(),
            total.trim(),
            fecha.trim()
        ];

        datos.forEach(dato => {
            const celda = document.createElement("td");
            celda.textContent = dato;
            fila.appendChild(celda);
        });

        const celdaEstado = document.createElement("td");
        const etiqueta = document.createElement("span");

        etiqueta.textContent = estado.trim();

        if (estado.trim().toLowerCase() === "entregado") {
            etiqueta.className = "badge badge-exito";
        } else if (estado.trim().toLowerCase() === "cancelado") {
            etiqueta.className = "badge badge-peligro";
        } else {
            etiqueta.className = "badge badge-pendiente";
        }

        celdaEstado.appendChild(etiqueta);
        fila.appendChild(celdaEstado);

        const celdaAcciones = document.createElement("td");
        celdaAcciones.className = "acciones";
        celdaAcciones.innerHTML = '<button>👁️</button><button>✏️</button>';

        fila.appendChild(celdaAcciones);
        tabla.appendChild(fila);

        actualizarEstadisticas();
        alert("Pedido creado correctamente.");
    });

    // CONSULTAR Y EDITAR PEDIDOS
    tabla.addEventListener("click", (evento) => {
        const boton = evento.target.closest("button");

        if (!boton) return;

        const fila = boton.closest("tr");
        if (!fila) return;

        const botones = Array.from(fila.querySelectorAll("button"));
        const posicion = botones.indexOf(boton);

        // VER PEDIDO
        if (posicion === 0) {
            alert(
                "INFORMACIÓN DEL PEDIDO\n\n" +
                "Número: " + fila.cells[0].textContent + "\n" +
                "Cliente: " + fila.cells[1].textContent + "\n" +
                "Productos: " + fila.cells[2].textContent + "\n" +
                "Total: " + fila.cells[3].textContent + "\n" +
                "Fecha: " + fila.cells[4].textContent + "\n" +
                "Estado: " + fila.cells[5].textContent
            );
        }

        // EDITAR PEDIDO
        if (posicion === 1) {
            const cliente = prompt("Nombre del cliente:", fila.cells[1].textContent);
            if (cliente === null || cliente.trim() === "") return;

            const producto = prompt("Productos:", fila.cells[2].textContent);
            if (producto === null || producto.trim() === "") return;

            const total = prompt("Total:", fila.cells[3].textContent);
            if (total === null || total.trim() === "") return;

            const fecha = prompt("Fecha:", fila.cells[4].textContent);
            if (fecha === null || fecha.trim() === "") return;

            const estado = prompt(
                "Estado: Entregado, En proceso o Cancelado",
                fila.cells[5].textContent
            );

            if (estado === null || estado.trim() === "") return;

            const estadosValidos = ["entregado", "en proceso", "cancelado"];

            if (!estadosValidos.includes(estado.trim().toLowerCase())) {
                alert("Estado no válido.");
                return;
            }

            fila.cells[1].textContent = cliente.trim();
            fila.cells[2].textContent = producto.trim();
            fila.cells[3].textContent = total.trim();
            fila.cells[4].textContent = fecha.trim();

            const etiqueta = fila.cells[5].querySelector("span");
            etiqueta.textContent = estado.trim();

            if (estado.trim().toLowerCase() === "entregado") {
                etiqueta.className = "badge badge-exito";
            } else if (estado.trim().toLowerCase() === "cancelado") {
                etiqueta.className = "badge badge-peligro";
            } else {
                etiqueta.className = "badge badge-pendiente";
            }

            actualizarEstadisticas();
            alert("Pedido actualizado correctamente.");
        }
    });

    actualizarEstadisticas();
});