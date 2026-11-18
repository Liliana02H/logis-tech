document.addEventListener("DOMContentLoaded", () => {

    const buscador = document.querySelector(".buscador");
    const botonAgregar = document.querySelector(".btn-agregar");
    const tabla = document.querySelector(".tabla-contenedor tbody");
    const tarjetas = document.querySelectorAll(".tarjeta h3");
let filtroTarjeta = "todos";

// FILTRAR AL HACER CLIC EN LAS TARJETAS
function aplicarFiltros() {
    const texto = buscador ? buscador.value.toLowerCase() : "";

    tabla.querySelectorAll("tr").forEach(fila => {
        const contenido = fila.textContent.toLowerCase();
        const estado = fila.cells[2].textContent.toLowerCase();

        const coincideTexto = contenido.includes(texto);

        let coincideEstado = true;

        if (filtroTarjeta === "agotados") {
            coincideEstado = estado.includes("agotado");
        } else if (filtroTarjeta === "completados") {
            coincideEstado = estado.includes("hecho");
        } else if (filtroTarjeta === "pendientes") {
            coincideEstado = estado.includes("pendiente");
        }

        fila.style.display =
            coincideTexto && coincideEstado ? "" : "none";
    });
}

// ACCIONES DE LAS CUATRO TARJETAS
document.querySelectorAll(".tarjeta").forEach((tarjeta, indice) => {
    tarjeta.style.cursor = "pointer";

    tarjeta.addEventListener("click", () => {
        const filtros = [
            "todos",
            "agotados",
            "completados",
            "pendientes"
        ];

        filtroTarjeta = filtros[indice];
        aplicarFiltros();
    });
});
    // ACTUALIZAR TARJETAS DEL DASHBOARD
    function actualizarTarjetas() {
        const filas = Array.from(tabla.querySelectorAll("tr"));

        const total = filas.length;

        const agotados = filas.filter(fila =>
            fila.cells[2].textContent.toLowerCase().includes("agotado")
        ).length;

        const completados = filas.filter(fila =>
            fila.cells[2].textContent.toLowerCase().includes("hecho")
        ).length;

        const pendientes = filas.filter(fila =>
            fila.cells[2].textContent.toLowerCase().includes("pendiente")
        ).length;

        tarjetas[0].textContent = total;
        tarjetas[1].textContent = agotados;
        tarjetas[2].textContent = completados;
        tarjetas[3].textContent = pendientes;
    }
// BUSCAR PRODUCTOS
if (buscador) {
    buscador.addEventListener("input", aplicarFiltros);
}
    
    // AGREGAR PRODUCTO
    if (botonAgregar) {
        botonAgregar.addEventListener("click", () => {
            const nombre = prompt("Nombre del producto:");
            if (!nombre || nombre.trim() === "") return;

            const precio = prompt("Precio del producto:");
            if (!precio || precio.trim() === "") return;

            const fila = document.createElement("tr");

            const filas = tabla.querySelectorAll("tr");
            const nuevoID = filas.length
                ? Math.max(...Array.from(filas).map(f =>
                    Number(f.cells[0].textContent) || 0
                )) + 1
                : 1;

            fila.innerHTML = `
                <td>${nuevoID}</td>
                <td>
                    <div class="producto-con-icono">
                        <span class="icono-producto">📦</span>
                        <span></span>
                    </div>
                </td>
                <td><span class="badge badge-pendiente">Pendiente</span></td>
                <td></td>
                <td class="acciones">
                    <button>👁️</button>
                    <button>✏️</button>
                    <button>🗑️</button>
                </td>
            `;

            fila.cells[1].querySelectorAll("span")[1].textContent =
                nombre.trim();

            fila.cells[3].textContent = precio.trim();

            tabla.appendChild(fila);

            actualizarTarjetas();
            alert("Producto agregado correctamente.");
        });
    }

    // ACCIONES DE LA TABLA
    tabla.addEventListener("click", evento => {
        const boton = evento.target.closest("button");
        if (!boton) return;

        const fila = boton.closest("tr");
        const botones = Array.from(fila.querySelectorAll("button"));
        const posicion = botones.indexOf(boton);

        const nombre = fila.cells[1].textContent.trim();

        // CONSULTAR
        if (posicion === 0) {
            alert(
                "INFORMACIÓN DEL PRODUCTO\n\n" +
                "ID: " + fila.cells[0].textContent + "\n" +
                "Producto: " + nombre + "\n" +
                "Estado: " + fila.cells[2].textContent + "\n" +
                "Precio: " + fila.cells[3].textContent
            );
        }

        // EDITAR
        if (posicion === 1) {
            const nombreNuevo = prompt("Nuevo nombre:", nombre);

            if (!nombreNuevo || nombreNuevo.trim() === "") return;

            fila.cells[1].querySelectorAll("span")[1].textContent =
                nombreNuevo.trim();

            const precioNuevo = prompt(
                "Nuevo precio:",
                fila.cells[3].textContent
            );

            if (precioNuevo && precioNuevo.trim() !== "") {
                fila.cells[3].textContent = precioNuevo.trim();
            }

            actualizarTarjetas();
            aplicarFiltros();
            alert("Producto actualizado correctamente.");
        }

        // ELIMINAR
        if (posicion === 2) {
            if (confirm("¿Deseas eliminar " + nombre + "?")) {
                fila.remove();
                actualizarTarjetas();
                aplicarFiltros();
                alert("Producto eliminado correctamente.");
            }
        }
    });

    // ACTUALIZAR AL ABRIR EL DASHBOARD
    actualizarTarjetas();

});