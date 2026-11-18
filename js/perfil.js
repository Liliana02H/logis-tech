document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("form");
    const campos = formulario.querySelectorAll("input");

    const campoNombre = campos[0];
    const campoTelefono = campos[1];
    const campoCorreo = campos[2];

    const nombreEncabezado = document.querySelector(".tabla-contenedor h2");
    const correoEncabezado = document.querySelector(
        ".tabla-contenedor h2 + p"
    );

    const botonGuardar = formulario.querySelector("button");

    // CARGAR LOS DATOS GUARDADOS
    function cargarPerfil() {
        const perfilGuardado = localStorage.getItem("perfilLogisTech");

        if (perfilGuardado) {
            const perfil = JSON.parse(perfilGuardado);

            campoNombre.value = perfil.nombre;
            campoTelefono.value = perfil.telefono;
            campoCorreo.value = perfil.correo;
        }

        actualizarEncabezado();
    }

    // ACTUALIZAR LA INFORMACIÓN SUPERIOR
    function actualizarEncabezado() {
        nombreEncabezado.textContent = campoNombre.value;
        correoEncabezado.textContent =
            "Administrador • " + campoCorreo.value;
    }

    // GUARDAR CAMBIOS
    botonGuardar.addEventListener("click", () => {
        const nombre = campoNombre.value.trim();
        const telefono = campoTelefono.value.trim();
        const correo = campoCorreo.value.trim();

        if (!nombre || !telefono || !correo) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        if (!campoCorreo.checkValidity()) {
            alert("Escribe un correo electrónico válido.");
            campoCorreo.focus();
            return;
        }

        const perfil = {
            nombre: nombre,
            telefono: telefono,
            correo: correo
        };

        localStorage.setItem(
            "perfilLogisTech",
            JSON.stringify(perfil)
        );

        actualizarEncabezado();

        alert("¡Perfil actualizado correctamente!");
    });

    cargarPerfil();
});