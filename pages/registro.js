const obtenerProvincias = () => {
    return fetch('https://apis.datos.gob.ar/georef/api/provincias')
        .then(response => response.json())
        .then(data => {
            console.log(data.provincias); // mostramos en la consola el array de provincias
            return data.provincias;
        })
        .catch(error => {
            console.error('Error al obtener las provincias:', error);
            return [];
        });
}

const cargarProvincias = (provincias) => {
    const selectProvincia = document.getElementById('cont-provincias');
    let opciones = '<option value="" disabled selected>Seleccionar Provincia</option>';

    provincias.forEach((provincia) => {
        opciones += `<option value="${provincia.id}">${provincia.nombre}</option>`;
    });

    selectProvincia.innerHTML = opciones;
}

const inicializarProvincias = () => {
    obtenerProvincias().then(provincias => {
        cargarProvincias(provincias);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const dni = document.getElementById('dni');
    const correo = document.getElementById('correo');
    const selectProvincia = document.getElementById('cont-provincias');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // evita el envio del formulario para realizar las acciones que ponemos en la funcion

        // Verificamos si alguno de los campos esta incompleto
        if (!nombre.value.trim() || !apellido.value.trim() || !dni.value.trim() || !correo.value.trim() || !selectProvincia.value) {
            Toastify({
                text: "Complete todos los campos por favor.",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#FF0000",
                stopOnFocus: true,
            }).showToast();
        } else {
            // Si estan los datos completos se abre mensaje de exito
            Toastify({
                text: "Usuario registrado correctamente",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#4CAF50",
                stopOnFocus: true,
            }).showToast();

            // Reseteamos el formulario luego de apretar Enviar
            form.reset();
        }
    });
});


// Inicializamos la carga de provincias al cargar la página
document.addEventListener('DOMContentLoaded', inicializarProvincias);
