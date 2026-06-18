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
    cargarHabitaciones();
});

// ==========================================
// 3. OBTENER Y PINTAR HABITACIONES (READ)
// ==========================================
async function cargarHabitaciones() {
    const tablaBody = document.getElementById('tablaHabitacionesBody');
    if (!tablaBody) return;

    try {
        const response = await fetch('http://localhost:3001/api/reservas/habitaciones');
        const habitaciones = await response.json();

        tablaBody.innerHTML = "";

        if (!habitaciones || habitaciones.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay habitaciones dadas de alta.</td></tr>`;
            return;
        }

        habitaciones.forEach(habitacion => {
            const fila = document.createElement('tr');
            
            fila.innerHTML = `
                <td>${habitacion.id}</td>
                <td><strong>${habitacion.numero}</strong></td>
                <td>${habitacion.tipo_habitacion || 'Estándar'}</td>
                <td style="color: #d4af37; font-weight: bold;">${Number(habitacion.precio_noche).toFixed(2)} BOB</td>
                <td>
                    <button onclick="editarHabitacion(${habitacion.id}, '${habitacion.numero}', '${habitacion.precio_noche}')" class="btn-accion btn-editar" title="Editar" style="background:#d4af37; color:black; border:none; padding:5px 10px; margin-right:5px; cursor:pointer; border-radius:4px;">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onclick="eliminarHabitacion(${habitacion.id})" class="btn-accion btn-eliminar" title="Eliminar" style="background:#cc3333; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:4px;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar habitaciones:", error);
        tablaBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Error al conectar con el servidor.</td></tr>`;
    }
}

// ==========================================
// 4. CREAR HABITACIÓN VIA SWEETALERT2 (CREATE)
// ==========================================
function abrirModalHabitacion() {
    Swal.fire({
        title: 'Agregar Nueva Habitación 🔑',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#d4af37',
        showCancelButton: true,
        cancelButtonColor: '#333',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar Habitación',
        html: `
            <div style="text-align: left; margin-bottom: 5px;"><label>Número de Habitación:</label></div>
            <input type="text" id="swal-room-numero" class="swal2-input" style="color:black; margin-top:0;" placeholder="Ej: 105">

            <div style="text-align: left; margin-top: 15px; margin-bottom: 5px;"><label>Tipo de Habitación:</label></div>
            <select id="swal-room-tipo" class="swal2-input" style="color:black; margin-top:0;">
                <option value="1">Simple</option>
                <option value="2">Doble</option>
                <option value="3">Matrimonial Premium</option>
                <option value="4">Suite Presidencial</option>
            </select>

            <div style="text-align: left; margin-top: 15px; margin-bottom: 5px;"><label>Precio por Noche (BOB):</label></div>
            <input type="number" id="swal-room-precio" class="swal2-input" style="color:black; margin-top:0;" placeholder="Ej: 300">
        `,
        preConfirm: () => {
            const numero = document.getElementById('swal-room-numero').value.trim();
            const tipo_id = document.getElementById('swal-room-tipo').value;
            const precio_noche = document.getElementById('swal-room-precio').value;

            if (!numero || !precio_noche) {
                Swal.showValidationMessage('Todos los campos son obligatorios.');
                return false;
            }

            return { numero, tipo_id, precio_noche };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // CORREGIDO: Ahora apunta correctamente a /api/reservas/habitaciones
                const response = await fetch('http://localhost:3001/api/reservas/habitaciones', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(result.value)
                });
                const data = await response.json();

                if (data.creado) {
                    Swal.fire({
                        title: '¡Agregada!',
                        text: data.mensaje,
                        icon: 'success',
                        background: '#1a1a1a',
                        color: '#fff',
                        confirmButtonColor: '#d4af37'
                    });
                    cargarHabitaciones(); 
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: data.error || 'No se pudo guardar la habitación.',
                        icon: 'error',
                        background: '#1a1a1a',
                        color: '#fff'
                    });
                }
            } catch (err) {
                console.error(err);
                Swal.fire({ icon: 'error', title: 'Error de Red', text: 'Sin respuesta del servidor.', background: '#1a1a1a', color: '#fff' });
            }
        }
    });
}

// ==========================================
// 5. EDITAR HABITACIÓN (PUT)
// ==========================================
function editarHabitacion(id, numeroActual, precioActual) {
    Swal.fire({
        title: `Editar Habitación ${numeroActual} 🛠️`,
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#d4af37',
        showCancelButton: true,
        cancelButtonColor: '#333',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Actualizar',
        html: `
            <div style="text-align: left; margin-bottom: 5px;"><label>Número de Habitación:</label></div>
            <input type="text" id="swal-edit-room-numero" class="swal2-input" style="color:black; margin-top:0;" value="${numeroActual}">

            <div style="text-align: left; margin-top: 15px; margin-bottom: 5px;"><label>Precio por Noche (BOB):</label></div>
            <input type="number" id="swal-edit-room-precio" class="swal2-input" style="color:black; margin-top:0;" value="${precioActual}">
        `,
        preConfirm: () => {
            const numero = document.getElementById('swal-edit-room-numero').value.trim();
            const precio_noche = document.getElementById('swal-edit-room-precio').value;

            if (!numero || !precio_noche) {
                Swal.showValidationMessage('Todos los campos son obligatorios.');
                return false;
            }
            return { numero, precio_noche };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3001/api/reservas/habitaciones/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(result.value)
                });
                const data = await response.json();

                if (data.actualizado) {
                    Swal.fire({ title: '¡Actualizada!', text: data.mensaje, icon: 'success', background: '#1a1a1a', color: '#fff', confirmButtonColor: '#d4af37' });
                    cargarHabitaciones();
                } else {
                    Swal.fire({ title: 'Error', text: data.error || 'No se pudo actualizar.', icon: 'error', background: '#1a1a1a', color: '#fff' });
                }
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Fallo de conexión.', background: '#1a1a1a', color: '#fff' });
            }
        }
    });
}

// ==========================================
// 6. ELIMINAR HABITACIÓN (DELETE)
// ==========================================
function eliminarHabitacion(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción removerá la habitación del inventario permanente.",
        icon: 'warning',
        background: '#1a1a1a',
        color: '#fff',
        showCancelButton: true,
        confirmButtonColor: '#cc3333',
        cancelButtonColor: '#333',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3001/api/reservas/habitaciones/${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();

                if (data.eliminado) {
                    Swal.fire({ title: '¡Eliminada!', text: data.mensaje, icon: 'success', background: '#1a1a1a', color: '#fff', confirmButtonColor: '#d4af37' });
                    cargarHabitaciones();
                } else {
                    Swal.fire({ title: 'Error', text: data.error || 'No se pudo eliminar.', icon: 'error', background: '#1a1a1a', color: '#fff' });
                }
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Fallo de conexión al eliminar.', background: '#1a1a1a', color: '#fff' });
            }
        }
    });
}