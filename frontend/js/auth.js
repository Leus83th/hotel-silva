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
// Abre tu js/auth.js y verifica que la función se vea así:
function cerrarSesion() {
    // 1. Borramos el token o sesión (ejemplo usando localStorage)
    localStorage.removeItem("usuarioLogueado"); 
    // O sessionStorage.clear(); dependiendo de cómo manejes tu login

    // 2. Alerta premium con SweetAlert2 antes de salir
    Swal.fire({
        title: 'Cerrando sesión',
        text: '¡Gracias por usar el sistema del Hotel Silva!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        // 3. Redirección al login
        window.location.href = "login.html";
    });
}