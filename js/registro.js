document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario

    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const registerMessage = document.getElementById('registerMessage');

    if (newUsername && newPassword) {
        // Guardar usuario y contraseña en localStorage
        localStorage.setItem('username', newUsername);
        localStorage.setItem('password', newPassword);

        registerMessage.style.color = 'green';
        registerMessage.textContent = 'Registro exitoso. ¡Ahora puedes iniciar sesión!';
    } else {
        registerMessage.style.color = 'red';
        registerMessage.textContent = 'Por favor, completa todos los campos.';
    }
});