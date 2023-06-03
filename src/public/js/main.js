// Variables
const apiURL = "http://localhost:3000";
let menuOpen = false;

function login() {
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const error = document.querySelector('.error-msg');

    const emailValue = emailInput.value;

    // Eliminar texto después de '@' y convertir en mayúsculas
    const emailWithoutDomain = emailValue.split('@').shift().toUpperCase();

    const nombreCompleto = 'Nombre';

    localStorage.setItem('matricula', emailWithoutDomain);
    localStorage.setItem('nombreCompleto', nombreCompleto);

    const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // Validate email address.
    if (!validEmailRegex.test(emailInput.value)) return email.parentElement.classList.add("was-validated");

    // email valid.
    email.parentElement.classList.remove("was-validated");
      
    fetch(`${apiURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: emailInput.value,
            password: passwordInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            error.innerText = data.message;
        } else if (emailInput.value === "testuser@testemail.com") {
            // Email de alumno -> redirecciona al menú de alumnos
            localStorage.setItem('nombre', data.nombre);
            localStorage.setItem('apellidoPaterno', data.apellidoPaterno);
            localStorage.setItem('apellidoMaterno', data.apellidoMaterno);
            window.location.href = '/alumno';

        } else if (emailInput.value === "maestro@mail.com") {
            // Email de maestro -> redirecciona al menú de maestros
            localStorage.setItem('nombre', data.nombre);
            localStorage.setItem('apellidoPaterno', data.apellidoPaterno);
            localStorage.setItem('apellidoMaterno', data.apellidoMaterno);
            window.location.href = '/maestro';

        } else {
            // Email incorrecto.
            error.innerText = "Invalid email or password.";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Opens or closes the menu.
function handleMenu() {
    const menu = document.querySelector('.menu');

    if (!menuOpen) {
        menu.classList.add('active');
        menuOpen = true;
        return;
    }
    menu.classList.remove('active');
    menuOpen = false;
}

// Handle the selected tam in the menu.
function handleTabs(e) {
    const selectOptions = document.querySelectorAll('.menu-option');

    // unhiglight the options.
    selectOptions.forEach((option) => {
        option.classList.remove('selected');
    });

    switch (e.target.id) {
        case "juego":
            changeTab("juego-tab");
            break;
        case "certificado":
            changeTab("certificado-tab");
            break;
        case "descarga-reglas":
            // Download something.
            break;
    }

    // Highlight the selected option.
    e.target.classList.add('selected');
}

// Change the visibility of the selected tab.
function changeTab(tabId) {
    const tabs = document.querySelectorAll('.content-area-container');

    // loop over all pages and show only the matching one.
    tabs.forEach((tab) => {
        if (tab.id === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Clear session data and redirect to login page.
function logout() {
    fetch(`${apiURL}/logout`, { method: 'GET' })
    .then(response => response.json())
    .then((response) => {
      if (response.status === 'success') {
        window.location.href = '/login'; // Redirect to the login page or desired location
      } else {
        console.log(response);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// Opens a modal and displays relevant information.
function openModal(e) {
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('#overlay');

    const modalId = e.target.id;

    modal.classList.add('active');
    overlay.classList.add('active');
}

// Closes the active modal.
function closeModal() { 
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('#overlay');

    modal.classList.remove('active');
    overlay.classList.remove('active');
}