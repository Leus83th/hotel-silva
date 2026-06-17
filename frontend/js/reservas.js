// EL GUARDIA DE SEGURIDAD
if (localStorage.getItem('adminLogueado') !== 'true') {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tablaHabitacionesBody')) {
        cargarHabitaciones();
    }
    if (document.getElementById('tablaReservasBody')) {
        cargarReservas();
    }
});

// ==========================================
// VISTAS DE TABLAS (READ)
// ==========================================
async function cargarHabitaciones() {
    const tbody = document.getElementById('tablaHabitacionesBody');
    try {
        const res = await fetch('http://localhost:3001/api/habitaciones');
        const habitaciones = await res.json();
        tbody.innerHTML = "";
        habitaciones.forEach(h => {
            tbody.innerHTML += `
                <tr>
                    <td>${h.id}</td>
                    <td>${h.numero}</td>
                    <td>${h.tipo_habitacion}</td>
                    <td>$${h.precio_noche}</td>
                </tr>`;
        });
    } catch (error) { console.error(error); }
}

async function cargarReservas() {
    const tbody = document.getElementById('tablaReservasBody');
    try {
        const res = await fetch('http://localhost:3001/api/reservas');
        const reservas = await res.json();
        tbody.innerHTML = "";
        if (reservas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay reservas registradas.</td></tr>`;
            return;
        }
        reservas.forEach(r => {
            tbody.innerHTML += `
                <tr>
                    <td>${r.id}</td>
                    <td>${r.nombre_cliente}</td>
                    <td>Habitación ${r.numero_habitacion}</td>
                    <td>${r.fecha_inicio}</td>
                    <td>${r.fecha_fin}</td>
                    <td><span style="font-weight:bold; color:#d4af37;">${r.estado}</span></td>
                </tr>`;
        });
    } catch (error) { console.error(error); }
}

// ==========================================
// FORMULARIO EMERGENTE: HABITACIONES (CREATE)
// ==========================================
function abrirModalHabitacion() {
    Swal.fire({
        title: 'Agregar Nueva Habitación',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#d4af37',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar',
        html: `
            <input id="h-numero" class="swal2-input" style="color:black;" placeholder="Número (Ej: 303)">
            <select id="h-tipo" class="swal2-input" style="color:black; width: inherit;">
                <option value="1">Simple</option>
                <option value="2">Doble</option>
                <option value="3">Matrimonial</option>
                <option value="4">Suite</option>
            </select>
            <input id="h-precio" type="number" class="swal2-input" style="color:black;" placeholder="Precio por noche">
        `,
        preConfirm: () => {
            return {
                numero: document.getElementById('h-numero').value,
                tipo_id: document.getElementById('h-tipo').value,
                precio_noche: document.getElementById('h-precio').value
            }
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const { numero, tipo_id, precio_noche } = result.value;
            if(!numero || !precio_noche) return Swal.fire('Error', 'Campos vacíos', 'error');

            const response = await fetch('http://localhost:3001/api/habitaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numero, tipo_id, precio_noche })
            });
            const data = await response.json();
            
            if(data.creado) {
                Swal.fire({ icon: 'success', title: data.mensaje, background: '#1a1a1a', color: '#fff' });
                cargarHabitaciones();
            } else {
                Swal.fire({ icon: 'error', title: data.error, background: '#1a1a1a', color: '#fff' });
            }
        }
    });
}

// ==========================================
// FORMULARIO EMERGENTE: RESERVAS CON ENLACE (CREATE)
// ==========================================
async function abrirModalReserva() {
    try {
        // Jalamos los clientes y habitaciones actuales de la BD para armar el menú dinámico
        const resClientes = await fetch('http://localhost:3001/api/clientes');
        const clientes = await resClientes.json();
        
        const resHabitaciones = await fetch('http://localhost:3001/api/habitaciones');
        const habitaciones = await resHabitaciones.json();

        // Generamos las opciones HTML para los selects
        let opcionesClientes = clientes.map(c => `<option value="${c.id}">${c.apellido}, ${c.nombre}</option>`).join('');
        let opcionesHabitaciones = habitaciones.map(h => `<option value="${h.id}">Habitación ${h.numero} (${h.tipo_habitacion})</option>`).join('');

        Swal.fire({
            title: 'Crear Nueva Reserva',
            background: '#1a1a1a',
            color: '#fff',
            confirmButtonColor: '#d4af37',
            showCancelButton: true,
            confirmButtonText: 'Reservar',
            cancelButtonText: 'Cancelar',
            html: `
                <label style="display:block; margin-top:10px;">Seleccione el Cliente:</label>
                <select id="res-cliente" class="swal2-input" style="color:black; width: inherit;">${opcionesClientes}</select>
                
                <label style="display:block; margin-top:10px;">Seleccione la Habitación:</label>
                <select id="res-habitacion" class="swal2-input" style="color:black; width: inherit;">${opcionesHabitaciones}</select>
                
                <label style="display:block; margin-top:10px;">Fecha de Entrada:</label>
                <input id="res-inicio" type="date" class="swal2-input" style="color:black;">
                
                <label style="display:block; margin-top:10px;">Fecha de Salida:</label>
                <input id="res-fin" type="date" class="swal2-input" style="color:black;">
            `,
            preConfirm: () => {
                return {
                    cliente_id: document.getElementById('res-cliente').value,
                    habitacion_id: document.getElementById('res-habitacion').value,
                    fecha_inicio: document.getElementById('res-inicio').value,
                    fecha_fin: document.getElementById('res-fin').value,
                    estado_id: 1 // 1 significa 'Pendiente' por defecto en nuestra BD
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const reservaData = result.value;
                if(!reservaData.fecha_inicio || !reservaData.fecha_fin) return Swal.fire('Error', 'Faltan las fechas', 'error');

                const response = await fetch('http://localhost:3001/api/reservas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reservaData)
                });
                const data = await response.json();

                if(data.creado) {
                    Swal.fire({ icon: 'success', title: data.mensaje, background: '#1a1a1a', color: '#fff' });
                    cargarReservas(); // Recarga la tabla de inmediato
                }
            }
        });

    } catch (error) { console.error("Error al abrir formulario de reservas: ", error); }
}