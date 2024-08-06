document.addEventListener('DOMContentLoaded', () => {
    const historialReservasContainer = document.getElementById('historialReservasContainer');

    const historialReservas = JSON.parse(localStorage.getItem('historialReservas')) || [];

    if (historialReservas.length < 1) {
        Toastify({
            text: "No hay reservas registradas",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#FF0000",
            stopOnFocus: true,
        }).showToast();
         return;
    }

    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', "text-center");

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const thFecha = document.createElement('th');
    thFecha.textContent = 'Fecha';
    const thHorario = document.createElement('th');
    thHorario.textContent = 'Horario';
    const thCancha = document.createElement('th');
    thCancha.textContent = 'Cancha';

    headerRow.appendChild(thFecha);
    headerRow.appendChild(thHorario);
    headerRow.appendChild(thCancha);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    historialReservas.forEach(reserva => {
        const tr = document.createElement('tr');

        const tdFecha = document.createElement('td');
        tdFecha.textContent = reserva.fecha;

        const tdHorario = document.createElement('td');
        tdHorario.textContent = reserva.horario;

        const tdCancha = document.createElement('td');
        tdCancha.textContent = reserva.opcionCancha;

        tr.appendChild(tdFecha);
        tr.appendChild(tdHorario);
        tr.appendChild(tdCancha);
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    historialReservasContainer.appendChild(table);
});
