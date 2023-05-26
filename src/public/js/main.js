const loginBtn = document.querySelector('.btn');
const email = document.querySelector('input[type="email"]');

loginBtn.addEventListener('click', login);

function login() {
    const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // Validate email address.
    if (!validEmailRegex.test(email.value)) return email.parentElement.classList.add("was-validated");

    // email valid.
    email.parentElement.classList.remove("was-validated");
}