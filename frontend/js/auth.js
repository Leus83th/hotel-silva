document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;

    try {
        // Enviamos los datos al backend
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, contrasena })
        });

        const data = await response.json();

        if (data.loginExitoso) {
            // VENTANA DE ÉXITO
            Swal.fire({
                icon: 'success',
                title: '¡Acceso Concedido!',
                text: data.mensaje,
                background: '#1a1a1a', // Fondo oscuro como tu Figma
                color: '#fff',
                confirmButtonColor: '#d4af37', // Botón dorado
                timer: 2000, // Se cierra en 2 segundos solo
                showConfirmButton: false
            });

            // Guardamos la sesión en el navegador (Punto 2)
            localStorage.setItem('adminLogueado', 'true');

            // Redirigimos a la página de clientes después de 2 segundos
            setTimeout(() => {
                window.location.href = 'clientes.html';
            }, 2000);

        } else {
            // VENTANA DE ERROR / ADVERTENCIA
            Swal.fire({
                icon: 'error',
                title: 'Error de Autenticación',
                text: data.mensaje,
                background: '#1a1a1a',
                color: '#fff',
                confirmButtonColor: '#d4af37'
            });
        }

    } catch (error) {
        // En caso de que el backend esté apagado
        Swal.fire({
            icon: 'warning',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor backend.',
            background: '#1a1a1a',
            color: '#fff',
            confirmButtonColor: '#d4af37'
        });
    }
});
// ==========================================
// FUNCIÓN PARA CERRAR SESIÓN (LOGOUT)
// ==========================================
function cerrarSesion() {
    // Borramos el dato que valida al guardia de seguridad
    localStorage.removeItem('adminLogueado');
    
    // Mandamos al usuario directo al Login de vuelta
    window.location.href = 'login.html';
}