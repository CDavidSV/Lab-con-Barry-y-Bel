window.onload = () => {
    const name = document.querySelector('.user-name');
    const progressPercentage = document.querySelector('.progress-percentage');
    const progressBar = document.querySelector('.progress-bar');
    const studentId = document.querySelector('.user-id');

    const user = JSON.parse(localStorage.getItem('user'));

    name.innerText = `${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno}`;
    studentId.innerText = user.matricula;

    // Set the progress bar and percentage to the user progress
    progressPercentage.innerText = `${user.progreso}%`;
    progressBar.style.width = `${user.progreso}%`;
};