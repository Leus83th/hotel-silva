// ==========================================
// 1. EL GUARDIA DE SEGURIDAD
// ==========================================
if (localStorage.getItem('adminLogueado') !== 'true') {
    window.location.href = 'login.html';
}

// ==========================================
// 2. LÓGICA AL CARGAR LA PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Si estamos en la página de la tabla, cargamos los clientes de inmediato
    if (document.getElementById('tablaClientesBody')) {
        cargarClientes();
    }

    // Si estamos en la página del formulario, activamos el evento de registro
    const formRegistro = document.getElementById('formRegistroCliente');
    if (formRegistro) {
        formRegistro.addEventListener('submit', registrarCliente);
    }
});

// ==========================================
// 3. FUNCIÓN PARA OBTENER Y PINTAR CLIENTES (READ)
// ==========================================
async function cargarClientes() {
    const tablaBody = document.getElementById('tablaClientesBody');

    try {
        // Pedimos la lista de clientes al backend
        const response = await fetch('http://localhost:3001/api/clientes');
        const clientes = await response.json();

        // Limpiamos la tabla por si tenía algo antes
        tablaBody.innerHTML = "";

        // Si no hay clientes registrados aún
        if (clientes.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay clientes registrados.</td></tr>`;
            return;
        }

        // Recorremos cada cliente que vino de la base de datos y creamos su fila
        clientes.forEach(cliente => {
            const fila = document.createElement('tr');
            
            fila.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.correo}</td>
                <td>${cliente.telefono}</td>
                <td>
                    <button class="btn-editar" onclick="prepararEditar(${cliente.id})">Editar</button>
                    <button class="btn-eliminar" onclick="confirmarEliminar(${cliente.id})">Eliminar</button>
                </td>
            `;
            
            tablaBody.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar los clientes:", error);
    }
}

// ==========================================
// 4. FUNCIÓN PARA REGISTRAR CLIENTE (CREATE)
// ==========================================
async function registrarCliente(e) {
    e.preventDefault();

    // Aplicamos .toLowerCase().trim() para normalizar el correo al guardar
    const clienteData = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        correo: document.getElementById('correo').value.toLowerCase().trim(),
        telefono: document.getElementById('telefono').value
    };

    try {
        const response = await fetch('http://localhost:3001/api/clientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clienteData)
        });

        const data = await response.json();

        if (data.registrado) {
            Swal.fire({
                icon: 'success',
                title: '¡Registro Exitoso!',
                text: data.mensaje,
                background: '#1a1a1a',
                color: '#fff',
                confirmButtonColor: '#d4af37'
            });
            document.getElementById('formRegistroCliente').reset();
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: data.error,
                background: '#1a1a1a',
                color: '#fff',
                confirmButtonColor: '#d4af37'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de red',
            text: 'No se pudo conectar con el servidor.',
            background: '#1a1a1a',
            color: '#fff',
            confirmButtonColor: '#d4af37'
        });
    }
}

// ==========================================
// 5. FUNCIÓN PARA ELIMINAR CON ADVERTENCIA (DELETE)
// ==========================================
function confirmarEliminar(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer. Se borrará al cliente del sistema.",
        icon: 'warning',
        showCancelButton: true,
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#d4af37',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3001/api/clientes/${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();

                if (data.eliminado) {
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: data.mensaje,
                        icon: 'success',
                        background: '#1a1a1a',
                        color: '#fff',
                        confirmButtonColor: '#d4af37'
                    });
                    cargarClientes(); 
                }
            } catch (error) {
                console.error("Error al eliminar:", error);
            }
        }
    });
}

// ==========================================
// 6. FUNCIÓN PARA EDITAR EN VENTANA FLOTANTE (UPDATE)
// ==========================================
async function prepararEditar(id) {
    try {
        const response = await fetch('http://localhost:3001/api/clientes');
        const clientes = await response.json();
        const cliente = clientes.find(c => c.id === id);

        Swal.fire({
            title: 'Actualizar Datos del Cliente',
            background: '#1a1a1a',
            color: '#fff',
            confirmButtonColor: '#d4af37',
            showCancelButton: true,
            cancelButtonColor: '#333',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Guardar Cambios',
            html: `
                <input id="swal-nombre" class="swal2-input" style="color:black;" value="${cliente.nombre}" placeholder="Nombre">
                <input id="swal-apellido" class="swal2-input" style="color:black;" value="${cliente.apellido}" placeholder="Apellido">
                <input id="swal-correo" class="swal2-input" style="color:black;" value="${cliente.correo}" placeholder="Correo">
                <input id="swal-telefono" class="swal2-input" style="color:black;" value="${cliente.telefono}" placeholder="Teléfono">
            `,
            // Al capturar la edición, también pasamos el correo a minúsculas
            preConfirm: () => {
                return {
                    nombre: document.getElementById('swal-nombre').value,
                    apellido: document.getElementById('swal-apellido').value,
                    correo: document.getElementById('swal-correo').value.toLowerCase().trim(),
                    telefono: document.getElementById('swal-telefono').value
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const datosActualizados = result.value;

                try {
                    const resPut = await fetch(`http://localhost:3001/api/clientes/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(datosActualizados)
                    });
                    const data = await resPut.json();

                    if (data.actualizado) {
                        Swal.fire({
                            title: '¡Actualizado!',
                            text: data.mensaje,
                            icon: 'success',
                            background: '#1a1a1a',
                            color: '#fff',
                            confirmButtonColor: '#d4af37'
                        });
                        cargarClientes();
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: data.error,
                            icon: 'error',
                            background: '#1a1a1a',
                            color: '#fff',
                            confirmButtonColor: '#d4af37'
                        });
                    }
                } catch (error) {
                    console.error("Error al actualizar:", error);
                }
            }
        });

    } catch (error) {
        console.error("Error al preparar la edición:", error);
    }
}