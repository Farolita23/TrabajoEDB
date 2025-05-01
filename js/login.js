document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Obtener datos del registro desde localStorage
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    // Validación
    if (username === storedUsername && password === storedPassword) {
        alert('Inicio de sesión exitoso. ¡Bienvenido!');
        errorMessage.textContent = '';
        window.location.href = 'inicio.html'; // Redirige a la página de inicio
    } else {
        errorMessage.textContent = 'Usuario o contraseña incorrectos.';
    }
});