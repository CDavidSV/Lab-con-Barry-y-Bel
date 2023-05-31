const apiURL = "http://localhost:3000";

function login() {
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const error = document.querySelector('.error-msg');

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
        } else {
            window.location.href = '/alumno';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}