window.onload = () => {
    const name = document.querySelector('.user-name');
    const progressPercentage = document.querySelector('.progress-percentage');
    const progressBar = document.querySelector('.progress-bar');
    const studentId = document.querySelector('.user-id');

    let user = JSON.parse(localStorage.getItem('user'));

    fetch(`${apiURL}/api/alumno?matricula=${user.matricula}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.error(data.message);
        }
        localStorage.setItem('user', JSON.stringify(data.user));
    })
    .catch(error => {
        console.error('Error:', error);
    });
    user = JSON.parse(localStorage.getItem('user'));

    name.innerText = `${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno}`;
    studentId.innerText = user.matricula;

    // Set the progress bar and percentage to the user progress
    progressPercentage.innerText = `${user.progreso}%`;
    progressBar.style.width = `${user.progreso}%`;
};