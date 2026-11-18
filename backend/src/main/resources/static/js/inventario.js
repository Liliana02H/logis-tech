document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.querySelector("tbody");
    const buscador = document.querySelector(".buscador");
    const filas = () => Array.from(tabla.querySelectorAll("tr"));

    const pestanas = document.querySelectorAll(".pestaña");
    const botonDetalles = document.querySelectorAll(".tabla-acciones-superior .btn-accion")[0];
    const botonEliminar = document.querySelectorAll(".tabla-acciones-superior .btn-accion")[1];

    let filaSeleccionada = null;

    // BUSCAR PRODUCTOS
    buscador.addEventListener("input", () => {
        const texto = buscador.value.toLowerCase();

        filas().forEach(fila => {
            fila.style.display = fila.textContent.toLowerCase().includes(texto)
                ? ""
                : "none";
        });
    });

    // PESTAÑAS
    pestanas.forEach(pestana => {
        pestana.addEventListener("click", () => {
            pestanas.forEach(item => item.classList.remove("activa"));
            pestana.classList.add("activa");

            const nombre = pestana.textContent.trim();

            if (nombre === "Información") {
                alert("Estás consultando la información general del inventario.");
            } else if (nombre === "Movimientos") {
                alert("Aquí podrás consultar las entradas y salidas de productos.");
            } else if (nombre === "Historial") {
                alert("Aquí podrás consultar el historial de cambios del inventario.");
            }
        });
    });

    // SELECCIONAR FILA Y EJECUTAR ACCIONES
    tabla.addEventListener("click", (evento) => {
        const boton = evento.target.closest("button");

        if (!boton) return;

        const fila = boton.closest("tr");
        if (!fila) return;

        filaSeleccionada = fila;

        const botones = Array.from(fila.querySelectorAll("button"));
        const posicion = botones.indexOf(boton);

        const producto = fila.cells[1].textContent;

        // VER INFORMACIÓN
        if (posicion === 0) {
            alert(
                "Información del producto\n\n" +
                "ID: " + fila.cells[0].textContent + "\n" +
                "Producto: " + producto + "\n" +
                "Categoría: " + fila.cells[2].textContent + "\n" +
                "Precio: " + fila.cells[3].textContent + "\n" +
                "Estado: " + fila.cells[4].textContent
            );
        }

        // VER DETALLES
        if (posicion === 1) {
            alert("Producto seleccionado: " + producto);
        }

        // EDITAR
        if (posicion === 2) {
            const nuevoNombre = prompt("Nombre del producto:", producto);
            if (nuevoNombre === null || nuevoNombre.trim() === "") return;

            const nuevaCategoria = prompt("Categoría:", fila.cells[2].textContent);
            if (nuevaCategoria === null || nuevaCategoria.trim() === "") return;

            const nuevoPrecio = prompt("Precio:", fila.cells[3].textContent);
            if (nuevoPrecio === null || nuevoPrecio.trim() === "") return;

            fila.cells[1].textContent = nuevoNombre.trim();
            fila.cells[2].textContent = nuevaCategoria.trim();
            fila.cells[3].textContent = nuevoPrecio.trim();

            alert("Producto actualizado correctamente.");
        }

        // ELIMINAR
        if (posicion === 3) {
            if (confirm("¿Deseas eliminar el producto " + producto + "?")) {
                fila.remove();
                filaSeleccionada = null;
                alert("Producto eliminado correctamente.");
            }
        }
    });

    // BOTÓN SUPERIOR: DETALLES
    botonDetalles.addEventListener("click", () => {
        if (!filaSeleccionada || !tabla.contains(filaSeleccionada)) {
            alert("Primero selecciona un producto usando uno de sus botones.");
            return;
        }

        alert("Detalles del producto: " + filaSeleccionada.cells[1].textContent);
    });

    // BOTÓN SUPERIOR: ELIMINAR
    botonEliminar.addEventListener("click", () => {
        if (!filaSeleccionada || !tabla.contains(filaSeleccionada)) {
            alert("Primero selecciona un producto usando uno de sus botones.");
            return;
        }

        const producto = filaSeleccionada.cells[1].textContent;

        if (confirm("¿Seguro que deseas eliminar " + producto + "?")) {
            filaSeleccionada.remove();
            filaSeleccionada = null;
            alert("Producto eliminado correctamente.");
        }
    });
});