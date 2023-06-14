window.onload = () => {
    const name = document.querySelector('.user-name');
    const progressPercentage = document.querySelector('.progress-percentage');
    const progressBar = document.querySelector('.progress-bar');
    const studentId = document.querySelector('.user-id');

    let user = JSON.parse(localStorage.getItem('user'));

    name.innerText = `${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno}`;
    studentId.innerText = user.matricula;


    fetch(`${apiURL}/api/alumno?matricula=${user.matricula}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.error(data.message);
        }
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Set the progress bar and percentage to the user progress
        progressPercentage.innerText = `${data.user.progreso}%`;
        progressBar.style.width = `${data.user.progreso}%`;
    })
    .catch(error => {
        console.error('Error:', error);
    });

};