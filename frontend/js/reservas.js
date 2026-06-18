// ==========================================
// 1. EL GUARDIA DE SEGURIDAD
// ==========================================
if (localStorage.getItem('adminLogueado') !== 'true') {
    window.location.href = 'login.html';
}

// ==========================================
// 2. INICIO AUTOMÁTICO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    cargarReservas();
});

// ==========================================
// 3. OBTENER Y PINTAR RESERVAS (READ)
// ==========================================
async function cargarReservas() {
    const tablaBody = document.getElementById('tablaReservasBody');
    if (!tablaBody) return;

    try {
        const response = await fetch('http://localhost:3001/api/reservas');
        const reservas = await response.json();

        tablaBody.innerHTML = "";

        if (!reservas || reservas.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay reservas registradas en el sistema.</td></tr>`;
            return;
        }

        reservas.forEach(reserva => {
            const fila = document.createElement('tr');
            const reservaId = reserva.id || reserva._id;

            // Formatear fechas para que se vean limpias (DD/MM/AAAA)
            const fInicio = new Date(reserva.fechaInicio).toLocaleDateString('es-ES');
            const fFin = new Date(reserva.fechaFin).toLocaleDateString('es-ES');

            // Determinar clases de estilos según el estado de la reserva
            let claseEstado = "estado-pendiente";
            if (reserva.estado === "Confirmada") claseEstado = "estado-confirmada";
            if (reserva.estado === "Cancelada") claseEstado = "estado-cancelada";

            fila.innerHTML = `
                <td>${reservaId}</td>
                <td>${reserva.clienteNombre || reserva.clienteId || 'No asignado'}</td>
                <td>Habitación ${reserva.habitacionNumero || reserva.habitacionId || 'N/A'}</td>
                <td>${fInicio}</td>
                <td>${fFin}</td>
                <td><span class="badge-estado ${claseEstado}">${reserva.estado || 'Pendiente'}</span></td>
            `;
            tablaBody.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar las reservas:", error);
        tablaBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Error al conectar con el servidor.</td></tr>`;
    }
}

// ==========================================
// 4. VENTANA FLOTANTE DINÁMICA (CREATE)
// ==========================================
async function abrirModalReserva() {
    try {
        // Obtenemos los clientes y las habitaciones en paralelo para poblar los selectores
        const [resClientes, resHabitaciones] = await Promise.all([
            fetch('http://localhost:3001/api/clientes'),
            fetch('http://localhost:3001/api/habitaciones').catch(() => null) // por si la ruta de habs da error temporal
        ]);

        const clientes = await resClientes.json();
        // Si no tienes la API de habitaciones lista, usamos un fallback simulado para que no se rompa
        const habitaciones = resHabitaciones ? await resHabitaciones.json() : [{id: 101, numero: "101"}, {id: 102, numero: "102"}];

        // Construir opciones HTML de Clientes
        let opcionesClientes = clientes.map(c => 
            `<option value="${c.id || c._id}">${c.nombre} ${c.apellido}</option>`
        ).join('');

        // Construir opciones HTML de Habitaciones
        let opcionesHabitaciones = habitaciones.map(h => 
            `<option value="${h.id || h._id}">Habitación ${h.numero || h.id}</option>`
        ).join('');

        // Lanzar formulario flotante
        Swal.fire({
            title: 'Registrar Nueva Reserva 🏨',
            background: '#1a1a1a',
            color: '#fff',
            confirmButtonColor: '#d4af37',
            showCancelButton: true,
            cancelButtonColor: '#333',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Crear Reserva',
            html: `
                <div style="text-align: left; margin-bottom: 10px;"><label>Seleccione el Huésped:</label></div>
                <select id="swal-reserva-cliente" class="swal2-input" style="color:black; margin-top:0;">
                    ${opcionesClientes || '<option value="">No hay clientes registrados</option>'}
                </select>

                <div style="text-align: left; margin-top: 15px; margin-bottom: 10px;"><label>Seleccione la Habitación:</label></div>
                <select id="swal-reserva-habitacion" class="swal2-input" style="color:black; margin-top:0;">
                    ${opcionesHabitaciones}
                </select>

                <div style="text-align: left; margin-top: 15px; margin-bottom: 5px;"><label>Fecha de Entrada (Check-In):</label></div>
                <input type="date" id="swal-reserva-inicio" class="swal2-input" style="color:black; margin-top:0;">

                <div style="text-align: left; margin-top: 15px; margin-bottom: 5px;"><label>Fecha de Salida (Check-Out):</label></div>
                <input type="date" id="swal-reserva-fin" class="swal2-input" style="color:black; margin-top:0;">
            `,
            preConfirm: () => {
                const clienteId = document.getElementById('swal-reserva-cliente').value;
                const habitacionId = document.getElementById('swal-reserva-habitacion').value;
                const fechaInicio = document.getElementById('swal-reserva-inicio').value;
                const fechaFin = document.getElementById('swal-reserva-fin').value;

                if (!clienteId || !habitacionId || !fechaInicio || !fechaFin) {
                    Swal.showValidationMessage('Por favor complete todos los campos obligatorios.');
                    return false;
                }
                if (new Date(fechaInicio) >= new Date(fechaFin)) {
                    Swal.showValidationMessage('La fecha de salida debe ser posterior a la de entrada.');
                    return false;
                }

                return { clienteId, habitacionId, fechaInicio, fechaFin, estado: "Confirmada" };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch('http://localhost:3001/api/reservas', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(result.value)
                    });
                    const data = await response.json();

                    if (response.ok || data.registrado) {
                        Swal.fire({
                            title: '¡Reserva Creada!',
                            text: data.mensaje || 'La estancia se agendó correctamente.',
                            icon: 'success',
                            background: '#1a1a1a',
                            color: '#fff',
                            confirmButtonColor: '#d4af37'
                        });
                        cargarReservas();
                    } else {
                        Swal.fire({
                            title: 'Atención',
                            text: data.error || 'No se pudo generar la reserva.',
                            icon: 'warning',
                            background: '#1a1a1a',
                            color: '#fff',
                            confirmButtonColor: '#d4af37'
                        });
                    }
                } catch (err) {
                    console.error(err);
                    Swal.fire({ icon: 'error', title: 'Error de Red', text: 'No hubo respuesta del servidor.', background: '#1a1a1a', color: '#fff' });
                }
            }
        });

    } catch (error) {
        console.error("Error al abrir el asistente de reservas:", error);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los catálogos del hotel.', background: '#1a1a1a', color: '#fff' });
    }
}