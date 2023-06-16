function getStuddentsData() {
    // Get all users from database and store them in localStorage
    fetch('http://localhost:3000/api/alumnos').then((response) => response.json()).then((result) => {
        localStorage.setItem('estudiantesData', JSON.stringify(result.users));

        // For each user in localStorage, create a new list item
        const alumnosContainer = document.querySelector('.alumnos-container ul');
        alumnosContainer.innerHTML = "";

        // Sort by completion percentage.
        result.users.sort((a, b) => {return b.progreso - a.progreso});

        result.users.forEach((estudiante) => {
            const alumno = document.createElement('li');
            alumno.classList.add('alumno');
            alumno.setAttribute('onclick', 'openModal(event)');
            alumno.setAttribute('id', estudiante.matricula);
            // Set the state to yello if the student state is false and green if it's true
            const stateColor = estudiante.estado ? 'green' : 'orange';
            const state = estudiante.estado ? 'Completado' : 'En Progreso';

            alumno.innerHTML = `
                <p>${estudiante.nombre} ${estudiante.apellidoPaterno} ${estudiante.apellidoMaterno} | ${estudiante.matricula}</p>
                <p style="color: ${stateColor}; font-weight: bold;">${state}</p>
            `;
            alumnosContainer.appendChild(alumno);
        });
    });
}

window.onload = () => {
    localStorage.setItem('minigames', JSON.stringify({}));
    localStorage.setItem('certificates', JSON.stringify({}));
    const name = document.querySelector('.user-name');
    const studentId = document.querySelector('.user-id');

    const user = JSON.parse(localStorage.getItem('user'));

    name.innerText = `${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno}`;
    studentId.innerText = user.matricula;

    // Get all users from database and store them in localStorage
    setInterval(getStuddentsData(), 600000);
    setInterval(() => {
        localStorage.setItem('minigames', JSON.stringify({}));
        localStorage.setItem('certificates', JSON.stringify({}));
    }, 600000);
};