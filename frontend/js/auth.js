// ==========================================================================
// 1. CONTROL EXCLUSIVO DE LA PANTALLA DE INICIO DE SESIÓN
// ==========================================================================
const loginForm = document.getElementById('loginForm');

// Con este IF evitamos que el código se rompa en las páginas de las tablas
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const usuario = document.getElementById('usuario').value;
        const contrasena = document.getElementById('contrasena').value;

        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, contrasena })
            });

            const data = await response.json();

            if (data.loginExitoso) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Acceso Concedido!',
                    text: data.mensaje,
                    background: '#1a1a1a', 
                    color: '#fff',
                    confirmButtonColor: '#d4af37', 
                    timer: 2000, 
                    showConfirmButton: false
                });

                // Guardamos con la clave 'adminLogueado'
                localStorage.setItem('adminLogueado', 'true');

                setTimeout(() => {
                    window.location.href = 'clientes.html';
                }, 2000);

            } else {
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
}

// ==========================================================================
// 2. PROTECCIÓN DE RUTAS (Para que nadie entre escribiendo la URL)
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {
    const sesionActiva = localStorage.getItem("adminLogueado");

    // Si no está logueado y trata de ver una tabla, lo mandamos al login
    if (sesionActiva !== "true" && !window.location.pathname.includes("login.html")) {
        window.location.href = "login.html";
    }
});

// ==========================================================================
// 3. FUNCIÓN GLOBAL PARA CERRAR SESIÓN (Se limpia con la clave correcta)
// ==========================================================================
function cerrarSesion() {
    // Borramos exactamente la misma llave que creamos arriba
    localStorage.removeItem("adminLogueado"); 

    Swal.fire({
        title: 'Cerrando sesión',
        text: '¡Gracias por usar el sistema del Hotel Silva!',
        icon: 'success',
        background: '#1a1a1a',
        color: '#fff',
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        window.location.href = "login.html";
    });
}