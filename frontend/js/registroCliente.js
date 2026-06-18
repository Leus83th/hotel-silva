document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('formRegistroCliente');
    
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const clienteData = {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apellido').value,
                correo: document.getElementById('correo').value.toLowerCase().trim(),
                telefono: document.getElementById('telefono').value
            };

            try {
                // Modificado para coincidir con tu backend modular /api/clientes
                const response = await fetch('http://localhost:3001/api/clientes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(clienteData)
                });

                const data = await response.json();

                // Busca esto dentro de registrarCliente en clientes.js y cámbialo:
                    if (data.registrado) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Registro Exitoso!',
                            text: data.mensaje,
                            background: '#1a1a1a',
                            color: '#fff',
                            confirmButtonColor: '#d4af37'
                        }).then(() => {
                            // Redirige automáticamente a la lista para ver el cliente recién creado
                            window.location.href = 'clientes.html'; 
                        });
                    } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Atención',
                        text: data.error || 'No se pudo completar el registro.',
                        background: '#1a1a1a',
                        color: '#fff',
                        confirmButtonColor: '#d4af37'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo establecer comunicación con el backend.',
                    background: '#1a1a1a',
                    color: '#fff',
                    confirmButtonColor: '#d4af37'
                });
            }
        });
    }
});