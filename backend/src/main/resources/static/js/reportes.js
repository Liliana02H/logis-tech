document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.querySelector("tbody");
    const botonExportar = document.querySelector(
        ".cabecera .btn-accion"
    );
    const botonGenerar = document.querySelector(
        "main .btn-accion"
    );
    const selector = document.querySelector("main select");
    const filas = () => Array.from(tabla.querySelectorAll("tr"));

    // FILTRAR LOS REPORTES
    function filtrarReportes() {
        const filtro = selector.value.toLowerCase();

        filas().forEach(fila => {
            const estado = fila.cells[3].textContent.toLowerCase();

            if (filtro === "todos los productos") {
                fila.style.display = "";
            } else if (filtro === "ventas") {
                fila.style.display =
                    estado.includes("completado") ? "" : "none";
            } else if (filtro === "inventario") {
                fila.style.display =
                    fila.cells[1].textContent.trim() !== "" ? "" : "none";
            } else if (filtro === "clientes") {
                fila.style.display = "none";
            }
        });
    }

    selector.addEventListener("change", filtrarReportes);

    // GENERAR REPORTE
    botonGenerar.addEventListener("click", () => {
        const visibles = filas().filter(
            fila => fila.style.display !== "none"
        );

        if (visibles.length === 0) {
            alert("No hay registros para generar el reporte.");
            return;
        }

        let completados = 0;
        let pendientes = 0;
        let cancelados = 0;
        let suma = 0;

        visibles.forEach(fila => {
            const estado = fila.cells[3].textContent.toLowerCase();

            if (estado.includes("completado")) completados++;
            if (estado.includes("pendiente")) pendientes++;
            if (estado.includes("cancelado")) cancelados++;

            const valor = fila.cells[4].textContent
                .replace(/\$/g, "")
                .replace(/\./g, "")
                .replace(/,/g, "")
                .trim();

            suma += Number(valor) || 0;
        });

        alert(
            "REPORTE GENERADO CORRECTAMENTE\n\n" +
            "Registros: " + visibles.length + "\n" +
            "Completados: " + completados + "\n" +
            "Pendientes: " + pendientes + "\n" +
            "Cancelados: " + cancelados + "\n" +
            "Total registrado: $" + suma.toLocaleString("es-CO")
        );
    });

    // EXPORTAR A PDF
    botonExportar.addEventListener("click", () => {
        window.print();
    });

    // ACTUALIZAR LAS TARJETAS CON LOS DATOS DE LA TABLA
    const tarjetas = document.querySelectorAll(".tarjeta h3");

    function actualizarTarjetas() {
        const registros = filas();

        const completados = registros.filter(f =>
            f.cells[3].textContent.toLowerCase().includes("completado")
        ).length;

        const pendientes = registros.filter(f =>
            f.cells[3].textContent.toLowerCase().includes("pendiente")
        ).length;

        const cancelados = registros.filter(f =>
            f.cells[3].textContent.toLowerCase().includes("cancelado")
        ).length;

        tarjetas[0].textContent = registros.length;
        tarjetas[1].textContent = completados;
        tarjetas[2].textContent =
            registros.length > 0
                ? Math.round((completados / registros.length) * 100) + "%"
                : "0%";
        tarjetas[3].textContent = pendientes + cancelados;
    }

    actualizarTarjetas();
});