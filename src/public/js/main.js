// Variables
const apiURL = "http://localhost:3000";
let menuOpen = false;
let selectedModalId = "";

const tabs = {
    'juego': {change: () => changeTab('juego-tab'), exec: null},
    'certificado': {change: () =>  changeTab('certificado-tab'), exec: () => getCertificado()},
    'descarga-reglas': {change: null, exec: null},
    'alumnos': {change: () => changeTab('alumnos-tab'), exec: null},
    'dashboard': {change: () => changeTab('dashboard-tab'), exec: () => getDashboardData()},
    'powerbi': {change: () => changeTab('powerbi-tab'), exec: null}
};

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
    submitBtn.innerText = 'Iniciando sesión...';
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
            emailInput.disabled = false;
            passwordInput.disabled = false;
            submitBtn.disabled = false;
            submitBtn.innerText = 'INICIAR SESIÓN';
            submitBtn.style.opacity = '1';
            return;
        }
        if (data.user.matricula.toLowerCase().startsWith('l0')) {
            window.location.href = '/maestro';
        } else {
            window.location.href = '/alumno';
        }
        localStorage.setItem('user', JSON.stringify(data.user));
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

    // Execute the selected tab.
    const tab = tabs[e.target.id];

    if (tab.exec) tab.exec();

    tab.change();

    // Highlight the selected option.
    e.target.classList.add('selected');
}

// Get the certificate.
async function getCertificado() {
    const studentData = JSON.parse(localStorage.getItem('user'));
    const message = document.querySelector('.certificado-message');
    const certificado = document.querySelector('.certificado');

    const response = await fetch(`${apiURL}/api/certificado?matricula=${studentData.matricula}`);

    try {
        const result = await response.clone().json();

        if (result.status === 'error') {
            message.style.visibility = 'visible';
            message.innerText = 'Tienes que completar el juego para obtener tu certificado.';
            message.style.color = 'red';
            return;
        }
    } catch {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        certificado.src = url;
        certificado.style.visibility = 'visible';
        message.style.visibility = 'hidden';
    }
}

// Get and download the certificate.
function downloadCertificado() {
    // Create a download link for the certificate.
    const download = document.createElement('a');
    const certificateUrl = JSON.parse(localStorage.getItem('certificates'))[selectedModalId];

    if (!certificateUrl) return;
    download.href = certificateUrl;
    download.download = `${selectedModalId}-certificado.png`;

    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
}

// Get the dashboard stats
function getDashboardData() {
    fetch(`${apiURL}/api/stats`).then(response => response.json()).then((result) => {
        const estudiantesRegistrados = document.querySelector('#registered-students');
        const completed = document.querySelector('#completed-courses');
        const inProgress = document.querySelector('#courses-in-progress');
        const averageProgress = document.querySelector('#average-progress');

        estudiantesRegistrados.innerText = result.data.registered;
        completed.innerText = result.data.completedCourses;
        inProgress.innerText = result.data.inProgressCourses;
        averageProgress.innerText = result.data.averageProgress + "%";
    }).catch((error) => {
        console.error(error);
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

// Opens a modal and displays relevant information.
async function openModal(e) {
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('#overlay');
    const progressBar = document.querySelector('.progress-bar');
    const progressPercentage = document.querySelector('.progress-percentage');
    const viewCertificate = document.querySelector('.certificado-btn');
    const downloadCertificate = document.querySelector('.download-btn');

    // Clear the container.
    const minigamesContainer = document.querySelector('.minijuegos-list');
    minigamesContainer.children[0].innerHTML = "";

    // Get the id from the event emmiter.
    const modalId = e.currentTarget.id
    selectedModalId = modalId;

    modal.classList.add('active');
    overlay.classList.add('active');

    // Get Certificate data and minigame data from local storage.
    const certificates = JSON.parse(localStorage.getItem('certificates'));
    const studentsMinigames = JSON.parse(localStorage.getItem('minigames'));

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

    viewCertificate.disabled = true;
    downloadCertificate.disabled = true;
    viewCertificate.style.opacity = '0.5';
    downloadCertificate.style.opacity = '0.5';

    // Check if the student's minigames are cached in local storage.
    if (!studentsMinigames[modalId]) {
        // Get minigame data for that student.
        fetch(`${apiURL}/api/alumno/minijuegos?matricula=${modalId}`)
        .then(response => response.json())
        .then((response) => {
            const minigames = response.minigames;
            fillMinigames(minigames);

            studentsMinigames[modalId] = minigames
            localStorage.setItem('minigames', JSON.stringify(studentsMinigames));
        })
        .catch((error) => {
            console.error(error);
        });
    } else {
        fillMinigames(studentsMinigames[modalId]);
    }

    // Check if the student's certificate is cached in local storage.
    if (!certificates[modalId]) {
        // Set the download btn for the certificate.
        const response = await fetch(`${apiURL}/api/certificado?matricula=${modalId}`);
        try {
            await response.clone().json();
            certificates[modalId] = "N/A";
            localStorage.setItem('certificates', JSON.stringify(certificates));
            return;
        } catch {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            viewCertificate.href = url;
            certificates[modalId] = url
            localStorage.setItem('certificates', JSON.stringify(certificates));
            
            viewCertificate.disabled = false;
            downloadCertificate.disabled = false;
            viewCertificate.style.opacity = '1';
            downloadCertificate.style.opacity = '1';
        }
    } else if (certificates[modalId] === "N/A"){
        return;
    }
    viewCertificate.href = certificates[modalId];

    viewCertificate.disabled = false;
    downloadCertificate.disabled = false;
    viewCertificate.style.opacity = '1';
    downloadCertificate.style.opacity = '1';
}

// Closes the active modal.
function closeModal() { 
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('#overlay');

    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function fillMinigames(minigames) {
    const minigamesContainer = document.querySelector('.minijuegos-list');

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