document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("form");

    const empresa = formulario.querySelector('input[type="text"]');
    const selects = formulario.querySelectorAll("select");

    const notificacionCorreo = document.querySelector("#notif1");
    const alertaStock = document.querySelector("#notif2");
    const resumenDiario = document.querySelector("#notif3");

    const botonGuardar = formulario.querySelector("button");

    // CARGAR CONFIGURACIÓN GUARDADA
    function cargarConfiguracion() {
        const datos = localStorage.getItem("configuracionLogisTech");

        if (datos) {
            const configuracion = JSON.parse(datos);

            empresa.value = configuracion.empresa;
            selects[0].value = configuracion.moneda;
            selects[1].value = configuracion.zonaHoraria;

            notificacionCorreo.checked = configuracion.notificacionCorreo;
            alertaStock.checked = configuracion.alertaStock;
            resumenDiario.checked = configuracion.resumenDiario;
        }
    }

    // GUARDAR CONFIGURACIÓN
    botonGuardar.addEventListener("click", () => {
        if (empresa.value.trim() === "") {
            alert("Escribe el nombre de la empresa.");
            empresa.focus();
            return;
        }

        const configuracion = {
            empresa: empresa.value.trim(),
            moneda: selects[0].value,
            zonaHoraria: selects[1].value,
            notificacionCorreo: notificacionCorreo.checked,
            alertaStock: alertaStock.checked,
            resumenDiario: resumenDiario.checked
        };

        localStorage.setItem(
            "configuracionLogisTech",
            JSON.stringify(configuracion)
        );

        alert("¡Configuración guardada correctamente!");
    });

    cargarConfiguracion();
});