// Variables
const apiURL = "http://localhost:3000";
let menuOpen = false;

function login() {
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const error = document.querySelector('.error-msg');
    const submitBtn = document.querySelector('.btn');
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

    emailInput.disabled = true;
    passwordInput.disabled = true;
    submitBtn.disabled = true;
    submitBtn.innerText = 'Iniciano sesión...';
    submitBtn.style.opacity = '0.5';
      
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
            return;
        }
        if (data.user.matricula.toLowerCase().startsWith('l0')) {
            window.location.href = '/maestro';
        } else {
            window.location.href = '/alumno';
        }
        localStorage.setItem('user', JSON.stringify(data.user));
        emailInput.disabled = false;
        passwordInput.disabled = false;
        submitBtn.disabled = false;
        submitBtn.innerText = 'INICIAR SESIÓN';
        submitBtn.style.opacity = '1';
    })
    .catch(error => {
        emailInput.disabled = false;
        passwordInput.disabled = false;
        submitBtn.disabled = false;
        submitBtn.innerText = 'INICIAR SESIÓN';
        submitBtn.style.opacity = '1';
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
            getCertificado();
            changeTab("certificado-tab");
            break;
        case "descarga-reglas":
            // Download something.
            break;
        case "alumnos":
            changeTab("alumnos-tab");
            break;
        case "dashboard":
            changeTab("dashboard-tab")
            break;
        case "powerbi":
            changeTab("powerbi-tab")
            break;
    }

    // Highlight the selected option.
    e.target.classList.add('selected');
}

function getCertificado() {
    const studentData = JSON.parse(localStorage.getItem('user'));
    fetch(`${apiURL}/api/certificado?matricula=${studentData.matricula}`).then(response => response.json()).then((result) => {
        const message = document.querySelector('.certificado-message');
        const certificado = document.querySelector('.certificado');
        if (result.status === 'error') 
            return message.style.visibility = 'visible';

        message.style.visibility = 'hidden';
        
        certificado.src = response.blob();
        certificado.srtyle.visibility = 'visible';
    });
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
    // Remove user data from local storage.
    localStorage.removeItem('user');
    localStorage.removeItem('estudiantesData');

    fetch(`${apiURL}/logout`, { method: 'GET' })
    .then(response => response.json())
    .then((response) => {
      if (response.status === 'success') {
        window.location.href = '/login'; // Redirect to the login page or desired location
      } else {
        console.error(response);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// Opens a modal and displays relevant information.
function openModal(e) {
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('#overlay');
    const progressBar = document.querySelector('.progress-bar');
    const progressPercentage = document.querySelector('.progress-percentage');

    // Get the id from the event emmiter.
    const modalId = e.currentTarget.id

    modal.classList.add('active');
    overlay.classList.add('active');

    // Display student information in the modal depending on the students id.
    const studentData = JSON.parse(localStorage.getItem('estudiantesData'));

    const student = studentData.find((student) => student.matricula === modalId);

    // Display the student information in the modal.
    const studentName = document.querySelector('.student-name');
    const studentMatricula = document.querySelector('.student-id');
    const studentState = document.querySelector('.student-state');

    studentName.innerText = student.nombre + ' ' + student.apellidoPaterno + ' ' + student.apellidoMaterno;
    studentMatricula.innerText = student.matricula;
    studentState.innerText = student.estado ? 'Compleatado' : 'En Progreso';
    studentState.style.color = student.estado ? 'green' : 'orange';

    // Display the student's progress in the modal.
    progressBar.style.width = `${student.progreso}%`;
    progressPercentage.innerText = `${student.progreso}%`;

    // Get minigame data for that student.
    fetch(`${apiURL}/api/alumno/minijuegos?matricula=${modalId}`)
    .then(response => response.json())
    .then((response) => {
        const minigames = response.minigames;
        const minigamesContainer = document.querySelector('.minijuegos-list');

        // Clear the container.
        minigamesContainer.children[0].innerHTML = '';

        // Loop over all minigames and display them.
        minigames.forEach((minigame) => {
            const minigameListItem = document.createElement('li');
            minigameListItem.setAttribute('style', 'margin-bottom: 15px;');
            minigameListItem.classList.add('minijuego');

            const minigameName = document.createElement('p');
            minigameName.innerText = minigame.Nombre;

            const minigameState = document.createElement('p');
            minigameState.setAttribute('style', 'font-weight: bold;');
            if (minigame.Completado === null) {
                minigameState.innerText = 'No iniciado';
                minigameState.style.color = 'red';
            } else if (minigame.Completado === true) {
                minigameState.innerText = 'Completado';
                minigameState.style.color = 'green';
            } else {
                minigameState.innerText = 'En Progreso';
                minigameState.style.color = 'orange';
            }

            minigameListItem.appendChild(minigameName);
            minigameListItem.appendChild(minigameState);

            minigamesContainer.children[0].appendChild(minigameListItem);
        });
    })
    .catch((error) => {
        console.error(error);
    });
}

// Closes the active modal.
function closeModal() { 
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('#overlay');

    modal.classList.remove('active');
    overlay.classList.remove('active');
}