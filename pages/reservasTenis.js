// Establece el input fecha en el dia actual poara no poder seleccionar fechas anteriores
//FECHA
// ---------------------------------------------------------------------------------------  
const inputFecha = document.getElementById('fecha');

const fechaActual = new Date().toISOString().split('T')[0];

inputFecha.setAttribute('min', fechaActual);


//HORARIO
// ---------------------------------------------------------------------------------------  
document.addEventListener('DOMContentLoaded', () => {
    const fechaInput = document.getElementById('fecha');
    const horarioSeleccionado = document.getElementById('horario');
    
    const opcionesHorarios = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const horaMinima = currentHour + 3 < 15 ? 15 : currentHour + 3; //if ternario (siempre suma uno para no reservar tan sobre la hora, y la horaMinima se pone para que sea horario mas temprano)
        const horaMaxima = 23;

        const fechaSeleccionada = new Date(fechaInput.value);
        const hoy = new Date(now.toISOString().split('T')[0]);

        let options = '<option value="">Seleccione un horario</option>';
        for (let hora = 15; hora <= horaMaxima; hora++) {
            if (fechaSeleccionada.getTime() === hoy.getTime() && hora < horaMinima) {
                continue;
            }
            options += `<option value="${hora.toString().padStart(2, '0')}:00">${hora}:00</option>`;
        }
        horarioSeleccionado.innerHTML = options;
    };

    fechaInput.addEventListener('change', opcionesHorarios);

    // usamos el evento blur (el input pierde el foco) para que se ejecute el estilo del borde del input y ademas lo usamos para setear el storage
    fechaInput.addEventListener('blur', () => {
        fechaInput.style.borderColor = fechaInput.value ? 'green' : 'red';
        localStorage.setItem('fecha', fechaInput.value);
    });

    horarioSeleccionado.addEventListener('blur', () => {
        horarioSeleccionado.style.borderColor = horarioSeleccionado.value ? 'green' : 'red';
        localStorage.setItem('horario', horarioSeleccionado.value);
    });

    // restauramos los  valores del localStorage si existen (getItem)
    const llamarFecha = localStorage.getItem('fecha');
    if (llamarFecha) {
        fechaInput.value = llamarFecha;
        opcionesHorarios(); // llama de nuevo a la funcion por si cuando obtiene del storage un horario con menos de 3 horas hacia adelante se actualicen las opciones de horario
    }
    
    const llamarHorario = localStorage.getItem('horario');
    if (llamarHorario) {
        horarioSeleccionado.value = llamarHorario;
    }
});


// FETCH para las canchas y las pelotas
const cargarCanchasDB = () => {
    return fetch('../data/canchas.json')
        .then(response => response.json())
        .catch(error => {
            console.error('Error al cargar canchas:', error);
            return [];
        });
};

const cargarPelotasDB = () => {
    return fetch('../data/pelotas.json')
        .then(response => response.json())
        .catch(error => {
            console.error('Error al cargar las pelotas:', error);
            return [];
        });
};
    

// FUNCIONES
// --------------------------------------------------------------------------------------- 
const cargarCanchas = (canchas) => {
    const selectCancha = document.getElementById('cancha');
    let opciones = '<option value="" disabled selected>Seleccionar Cancha</option>';

    canchas.forEach((cancha) => {
        opciones += `<option value="${cancha.precio}">${cancha.superficie} - $${cancha.precio}</option>`;
    });

    selectCancha.innerHTML = opciones;

    // Restauramos la selección de la cancha si existe en localStorage
    const guardarCancha = localStorage.getItem('cancha');
    if (guardarCancha) {
        selectCancha.value = guardarCancha;
    }

    selectCancha.addEventListener('change', () => {
        localStorage.setItem('cancha', selectCancha.value);
    });
}


// Función para obtener el precio de la cancha seleccionada (optimizada con Operadores avanzados)
const obtenerPrecioSeleccionado = () => {
    const selectCancha = document.getElementById('cancha');
    // Operador logico OR ||: Se usa para asignar 0 a precioSeleccionado si parseInt(selectCancha?.value) es un valor falsy (como NaN, undefined, null, etc.). Sino, nos da el value de selectCancha.
    const precioSeleccionado = parseInt(selectCancha?.value) || 0; 

    selectCancha.addEventListener('focus', () => {
        selectCancha.style.borderColor = '';
    });

    selectCancha.addEventListener('blur', () => {
        selectCancha.style.borderColor = selectCancha.value ? 'green' : 'red';
    });

    return precioSeleccionado;
}

// Función para obtener el valor del descuento ingresado en el input en caso de que exista en en la base de datos (optimizada con Operadores avanzados)
const obtenerDescuento = () => {
    const inputCodigoDescuento = document.getElementById('codigoDescuento');

    // Aseguramos que inputCodigoDescuento no sea null antes de intentar acceder a su propiedad value.
    const codigoDescuento = inputCodigoDescuento?.value.trim(); 

    const descuentoEncontrado = descuentos.find(d => d.codigo === codigoDescuento);

    // NO FUNCIONA - Cambia el borde del input a verde si se encuentra el descuento, sino a rojo.
    inputCodigoDescuento.style.borderColor = descuentoEncontrado ? 'green' : 'red';

    //Devuelve el value del descuento encontrado o 0 si no se encuentra ningún descuento.
    return descuentoEncontrado?.valor || 0;
}


const calcularPrecioConDescuento = () => {
    const precioBase = obtenerPrecioSeleccionado();
    const descuento = obtenerDescuento();

    // If ternario para verificar si descuento es mayor que cero (calcula descuento), sino pasa el precio base, sin descuento.
    const precioConDescuento = descuento > 0 ? precioBase * (1 - descuento) : precioBase;

    return precioConDescuento;
}

// Función para gestionar la compra extra de productos (use style.display none y block para mostrar o borrar elementos de acuerdo a lo que vaya haciendo el usuario)
let productosSeleccionados = []; // Array global para almacenar los productos seleccionados

const comprarProductos = (productos) => {
    
    const productosContainer = document.getElementById('productos');
    productosContainer.innerHTML = ''; // Limpia el contenido previo

    productos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="../assets/img/${producto.imagen}" alt="${producto.nombre}">
            <p>Marca: ${producto.marca}</p>
            <p>Precio: $${producto.precio}</p>
            <button class="btn fill">Comprar</button>
        `;

        const botonComprar = card.querySelector('button');
        botonComprar.addEventListener('click', (event) => {
            event.preventDefault();
            botonComprar.style.display = 'none';

            const inputCantidad = document.createElement('input');
            inputCantidad.type = 'number';
            inputCantidad.min = 0;
            inputCantidad.value = 1;// ponemos el valor en 1 ya que si el usuario dio click en comprar va a querer comprar minimo un producto

            const botonConfirmar = document.createElement('button');
            botonConfirmar.textContent = 'Ok';
            botonConfirmar.classList.add('fill', 'confirmar-btn');

            const botonCancelar = document.createElement('button');
            botonCancelar.classList.add('btn', 'fill');
            botonCancelar.style.backgroundColor = 'red';
            botonCancelar.textContent = 'Cancelar';
            botonCancelar.style.display = 'none'

            // Se usa spreadoperator para traer todo el objeto del producto y agregarle la cantidad que se puso en el input
            botonConfirmar.addEventListener('click', () => {
                const cantidadSeleccionada = parseInt(inputCantidad.value);
                const productoSeleccionado = {
                    ...producto,
                    cantidad: cantidadSeleccionada
                };
                // aca pusheamos el producto seleccionado con su cantidad y actualizamos el precio final llamando a la funcion
                productosSeleccionados.push(productoSeleccionado);
                
                botonConfirmar.style.display = 'none';
                inputCantidad.style.display = 'none';
                botonCancelar.style.display = 'block';
            });

            botonCancelar.addEventListener('click', () => {
                productosSeleccionados = productosSeleccionados.filter(p => p.marca !== producto.marca);
            
                botonComprar.style.display = 'block';
                inputCantidad.style.display = 'none';
                botonConfirmar.style.display = 'none';
                botonCancelar.style.display = 'none';
            });

            card.appendChild(inputCantidad);
            card.appendChild(botonConfirmar);
            card.appendChild(botonCancelar);
        });

        productosContainer.appendChild(card);
    });
}


const mostrarResumen = () => {
    const fechaSeleccionada = document.getElementById('fecha').value;
    const selectCancha = document.getElementById('cancha');
    const horarioSeleccionado = document.getElementById('horario').value;

    // Usamos Toastify en lugar de alert para alertar al usuario que debe ingresar minimamente los campos de fecha, cancha y horario 
    if (!fechaSeleccionada || !selectCancha.value || !horarioSeleccionado) {
        Toastify({
            text: "Debes completar los campos de Fecha, Cancha y Horario para realizar una reserva",
            duration: 3000,
            gravity: "top", 
            position: "center", 
            backgroundColor: "#ff0000", 
            stopOnFocus: true, 
        }).showToast();
        return;
    }

    const precioConDescuento = calcularPrecioConDescuento();
    // aca utilice ayuda de chatGpt para obtener el texto que figura de la cancha seleccionada en el resumen
    const canchaSeleccionada = selectCancha.options[selectCancha.selectedIndex].text;

    let contenidoPopUp = `
        <p><strong>Fecha:</strong> ${fechaSeleccionada}</p>
        <p><strong>Horario:</strong> ${horarioSeleccionado}</p>
        <p><strong>Cancha:</strong> ${canchaSeleccionada}</p>
        <p><strong>Precio con descuento:</strong> $${precioConDescuento}</p>`;

    if (productosSeleccionados.length > 0) {
        const precioTotalProductos = productosSeleccionados.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
        contenidoPopUp += `
        <p><strong>Productos seleccionados:</strong></p>
        <ul>`;
        // el id en este forEach representa la posicion en el array, con eso indentifico cual de los productos debe quitar o restar cantidad
        productosSeleccionados.forEach((p, id) => {
            console.log(productosSeleccionados)
            contenidoPopUp += `
            <li>
                ${p.nombre} ${p.marca} x${p.cantidad} - $${p.precio * p.cantidad}
                <button class="remover-btn" onclick="removerProducto(${id})">X</button>
            </li>`;
        });
        contenidoPopUp += `</ul>
        <p><strong>Precio total de productos:</strong> $${precioTotalProductos}</p>`;

        const precioTotal = precioConDescuento + precioTotalProductos;
        contenidoPopUp += `
        <p><strong>Total a pagar:</strong> $${precioTotal}</p>`;
    } else {
        contenidoPopUp += `
        <p><strong>Total a pagar:</strong> $${precioConDescuento}</p>`;
    }

    // Aca ingresamos lo que creamos en contenidoPopUp en el resumenContenido que esta en el html
    const popupResumen = document.getElementById('popupResumen');
    const resumenContenido = document.getElementById('resumenContenido');
    resumenContenido.innerHTML = contenidoPopUp;
    popupResumen.style.display = 'block';
}

// Función para remover un producto del array productosSeleccionados
const removerProducto = (id) => {
    if (productosSeleccionados[id].cantidad > 1) {
        productosSeleccionados[id].cantidad --;
    } else {
        productosSeleccionados.splice(id, 1);
    }
    mostrarResumen(); // Actualiza el resumen después de eliminar el producto, no necesitamos actualizar los precios ya que se renderiza de nuevo el cotenido del popup
}

// Cerrar el popup con un style display 'none', si presionamos mostrar resumen nuevamente van a seguir apareciendo ademas de la reserva, los productos.
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('popupResumen').style.display = 'none';
    productosSeleccionados = []; // Resetea el array de productos seleccionados
    inicializarPelotas();
});


document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('popupResumen').style.display = 'none';
});

// Inicializadores de los fetch
const inicializarCanchas = () => {
    cargarCanchasDB().then(canchas => {
        cargarCanchas(canchas);
    });
}

const inicializarPelotas = () => {
    cargarPelotasDB().then(pelotas => {
        comprarProductos(pelotas);
    });
}

// Llamadas iniciales para que cargue las canchas y las pelotas en las funciones

document.addEventListener('DOMContentLoaded', () => {
    inicializarCanchas();
    inicializarPelotas();
});

// cargarCanchas(canchas);
// comprarProductos(pelotas);


document.addEventListener('DOMContentLoaded', () => {
    const fecha = localStorage.getItem('fecha');
    const cancha = localStorage.getItem('cancha');
    const horario = localStorage.getItem('horario');

    if (fecha) {
        document.getElementById('fecha').value = fecha;
    }
    if (cancha) {
        document.getElementById('cancha').value = cancha;
    }
    if (horario) {
        document.getElementById('horario').value = horario;
    }
});


const confirmarReserva = () => {
    const fecha = document.getElementById('fecha').value;
    const selectCancha = document.getElementById('cancha');
    const opcionCancha = selectCancha.options[selectCancha.selectedIndex].text;
    const horario = document.getElementById('horario').value;
    
    // Obtener la fecha y hora actual
    const now = new Date();
    now.setHours(now.getHours()); 

    // Formatear la fecha y hora en formato local (sin la 'Z')
    const fechaHoraConfirmacion = now.toLocaleString('es-AR', { 
        timeZone: 'America/Argentina/Buenos_Aires',
        hour12: false // Usar formato de 24 horas
    });

    const reserva = {
        fecha,
        opcionCancha,
        horario,
        fechaHoraConfirmacion // Añadimos la fecha y hora de la confirmación ajustada
    };

    let historialReservas = JSON.parse(localStorage.getItem('historialReservas')) || [];
    historialReservas.push(reserva);
    localStorage.setItem('historialReservas', JSON.stringify(historialReservas));

    // Mensaje de éxito
    Toastify({
        text: "Su reserva se ha realizado con éxito",
        duration: 4000,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        backgroundColor: "green",
    }).showToast();

    resetReserva();
};




document.getElementById('reservar').addEventListener('click', confirmarReserva);


const resetReserva = () => {
    document.getElementById('fecha').value = '';
    document.getElementById('cancha').selectedIndex = 0;
    document.getElementById('horario').innerHTML = '<option value="">Seleccione un horario</option>';
    document.getElementById('codigoDescuento').value = '';

    // Se limpian los bordes de los inputs para que no aparezcan en rojo luego de confirmar la reserva y se remueva la reserva recien confirmada del localsotrage
    document.getElementById('fecha').style.borderColor = '';
    document.getElementById('cancha').style.borderColor = '';
    document.getElementById('horario').style.borderColor = '';
    document.getElementById('codigoDescuento').style.borderColor = '';

    // Limpiamos el array de productos
    productosSeleccionados = [];
    inicializarPelotas();

    // se limpian los datos temporales del localstorage
    localStorage.removeItem('fecha');
    localStorage.removeItem('horario');
    localStorage.removeItem('cancha');

    document.getElementById('popupResumen').style.display = 'none';
}
