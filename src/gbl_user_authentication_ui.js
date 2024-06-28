import * as ui from './gbl_create_ui.js';
const {
    createOverlay,
    closeUI,
} = ui;

import * as clientSide from './client-side.js';

const { 
    loginUser,
    registerUser,
} = clientSide;

import * as userDropDownMenu from './gbl_user_drop_down.js';

const {
    updateUserDropdown,
} = userDropDownMenu;


import IP from '../appConfig.js';


function createLogInUI() {
    createOverlay();
    const logInUI = document.createElement('div');
    logInUI.setAttribute('class', "ui authentication-ui bg-white p-8 rounded-lg shadow-lg w-96 h-auto mx-auto my-12 relative");

    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('class', "absolute top-2 right-2 text-gray-500 hover:text-gray-700");
    closeBtn.textContent = "✖";
    closeBtn.addEventListener('click', function(){
        console.log("closing login ui");
        closeUI(logInUI);
    });
    logInUI.appendChild(closeBtn);

    const form = document.createElement('form');
    form.id = 'loginForm'; // ID of the Login form
    const h2 = document.createElement('h2');
    const emailDiv = document.createElement('div');
    const emailLabel = document.createElement('label');
    const emailInput = document.createElement('input');
    const passwordWrapper = document.createElement('div');
    const passwordDiv = document.createElement('div');
    const passwordLabel = document.createElement('label');
    const passwordInput = document.createElement('input');
    const passwordToggle = document.createElement('span');
    const submitButton = document.createElement('button');
    const noAccountLabel = document.createElement('label');

    h2.textContent = "Log In";
    h2.classList.add("text-2xl", "font-bold", "mb-6", "text-center");

    emailLabel.textContent = "Email";
    emailLabel.classList.add("block", "text-gray-700", "text-sm", "font-bold", "mb-2");
    emailInput.classList.add("shadow", "appearance-none", "border", "rounded", "w-full", "py-2", "px-3", "text-gray-700", "mb-3", "leading-tight", "focus:outline-none", "focus:shadow-outline");
    emailInput.setAttribute("type", "email");
    emailInput.setAttribute("placeholder", "Enter your email");
    emailInput.setAttribute("name", "email");

    passwordLabel.textContent = "Password";
    passwordLabel.classList.add("block", "text-gray-700", "text-sm", "font-bold", "mb-2");
    passwordInput.classList.add("shadow", "appearance-none", "border", "rounded", "w-full", "py-2", "px-3", "text-gray-700", "mb-3", "leading-tight", "focus:outline-none", "focus:shadow-outline");
    passwordInput.setAttribute("type", "password");
    passwordInput.setAttribute("placeholder", "Enter your password");
    passwordInput.setAttribute("name", "password");

    passwordToggle.innerHTML = '<i class="fas fa-eye"></i>';
    passwordToggle.classList.add("absolute", "right-3", "top-1/2", "-translate-y-3/4", "cursor-pointer");
    passwordToggle.addEventListener('click', function(){
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
    });

    passwordWrapper.classList.add("relative", "mb-3");
    passwordWrapper.appendChild(passwordInput);
    passwordWrapper.appendChild(passwordToggle);

    submitButton.textContent = "Log In";
    submitButton.setAttribute('class', "bg-blue-600 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full");
    submitButton.setAttribute("type", "submit");

    noAccountLabel.textContent = "Don't have an account? Sign up";
    noAccountLabel.setAttribute('class', "block text-center text-blue-700 text-sm font-bold mt-4 cursor-pointer hover:text-blue-400");
    noAccountLabel.addEventListener("click", function() {
        closeUI(logInUI);
        createRegisterUI();
    });

    emailDiv.appendChild(emailLabel);
    emailDiv.appendChild(emailInput);

    passwordDiv.appendChild(passwordLabel);
    passwordDiv.appendChild(passwordWrapper);

    form.appendChild(h2);
    form.appendChild(emailDiv);
    form.appendChild(passwordDiv);
    form.appendChild(submitButton);
    form.appendChild(noAccountLabel);

    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.id = 'loginErrorMessage';
    errorMessage.style.display = 'none';
    errorMessage.style.color = 'red';
    errorMessage.style.textAlign = 'center';
    errorMessage.style.marginTop = '10px';
    form.appendChild(errorMessage);

    logInUI.appendChild(form);
    document.body.appendChild(logInUI);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Login Form Submitted');
        const formData = new FormData(form);

        // Clear any existing error message
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';

        const emailValue = formData.get('email');
        const passwordValue = formData.get('password');

        // Validate that both inputs are filled
        if (!emailValue || !passwordValue) {
            errorMessage.textContent = 'Fill both inputs';
            errorMessage.style.display = 'block';
            return;
        }

        // Proceed with login if inputs are valid
        loginUser(formData)
            .then(data => {
                // Handle successful login
                console.log('Login successful:', data);
                const userProfile = data.userProfile;
                updateUserDropdown(true, userProfile);
                closeUI(logInUI);
                location.reload(); // page reload
                console.log(userProfile);
                // Optionally redirect or update UI after successful login
            })
            .catch(error => {
                console.error('Error:', error);
                // Update error message dynamically based on the error received
                if (error.message.includes('User not found')) {
                    errorMessage.textContent = 'User not found';
                } else {
                    errorMessage.textContent = 'Failed to log in user';
                }
                errorMessage.style.display = 'block';
            });
    });
}


function createRegisterUI() {
    createOverlay();
    const registerUI = document.createElement('div');
    registerUI.setAttribute('class', "ui authentication-ui bg-white p-8 rounded-lg shadow-lg w-96 h-auto mx-auto my-12");

    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('class', "absolute top-2 right-2 text-gray-500 hover:text-gray-700");
    closeBtn.textContent = "✖";
    closeBtn.addEventListener('click', function(){
        console.log("closing login ui");
        closeUI(registerUI);
    });
    registerUI.appendChild(closeBtn);

    const form = document.createElement('form');
    form.id = 'registerForm'; // Id of the Register form
    const h2 = document.createElement('h2');
    const usernameDiv = document.createElement('div');
    const usernameLabel = document.createElement('label');
    const usernameInput = document.createElement('input');
    const emailDiv = document.createElement('div');
    const emailLabel = document.createElement('label');
    const emailInput = document.createElement('input');
    const passwordWrapper1 = document.createElement('div');
    const passwordDiv = document.createElement('div');
    const passwordLabel = document.createElement('label');
    const passwordInput = document.createElement('input');
    const passwordToggle = document.createElement('span');
    const passwordWrapper2 = document.createElement('div');
    const repeatPasswordDiv = document.createElement('div');
    const repeatPasswordLabel = document.createElement('label');
    const repeatPasswordInput = document.createElement('input');
    const repeatPasswordToggle = document.createElement('span');
    const submitButton = document.createElement('button');

    h2.textContent = "Register";
    h2.classList.add("text-2xl", "font-bold", "mb-6", "text-center");

    usernameLabel.textContent = "Username";
    usernameLabel.classList.add("block", "text-gray-700", "text-sm", "font-bold", "mb-2");
    usernameInput.classList.add("shadow", "appearance-none", "border", "rounded", "w-full", "py-2", "px-3", "text-gray-700", "mb-3", "leading-tight", "focus:outline-none", "focus:shadow-outline");
    usernameInput.setAttribute("type", "text");
    usernameInput.setAttribute("placeholder", "Enter your username");
    usernameInput.setAttribute("name", "username");

    emailLabel.textContent = "Email";
    emailLabel.classList.add("block", "text-gray-700", "text-sm", "font-bold", "mb-2");
    emailInput.classList.add("shadow", "appearance-none", "border", "rounded", "w-full", "py-2", "px-3", "text-gray-700", "mb-3", "leading-tight", "focus:outline-none", "focus:shadow-outline");
    emailInput.setAttribute("type", "email");
    emailInput.setAttribute("placeholder", "Enter your email");
    emailInput.setAttribute("name", "email");

    passwordLabel.textContent = "Password";
    passwordLabel.classList.add("block", "text-gray-700", "text-sm", "font-bold", "mb-2");
    passwordInput.classList.add("shadow", "appearance-none", "border", "rounded", "w-full", "py-2", "px-3", "text-gray-700", "mb-3", "leading-tight", "focus:outline-none", "focus:shadow-outline");
    passwordInput.setAttribute("type", "password");
    passwordInput.setAttribute("placeholder", "Enter your password");
    passwordInput.setAttribute("name", "password");

    repeatPasswordLabel.textContent = "Repeat Password";
    repeatPasswordLabel.classList.add("block", "text-gray-700", "text-sm", "font-bold", "mb-2");
    repeatPasswordInput.classList.add("shadow", "appearance-none", "border", "rounded", "w-full", "py-2", "px-3", "text-gray-700", "mb-3", "leading-tight", "focus:outline-none", "focus:shadow-outline");
    repeatPasswordInput.setAttribute("type", "password");
    repeatPasswordInput.setAttribute("placeholder", "Repeat your password");
    repeatPasswordInput.setAttribute("name", "repeatPassword");

    passwordToggle.innerHTML = '<i class="fas fa-eye"></i>';
    passwordToggle.classList.add("absolute", "right-3", "top-1/2", "-translate-y-3/4", "cursor-pointer");
    passwordToggle.addEventListener('click', function(){
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
    });

    repeatPasswordToggle.innerHTML = '<i class="fas fa-eye"></i>';
    repeatPasswordToggle.classList.add("absolute", "right-3", "top-1/2", "-translate-y-3/4", "cursor-pointer");
    repeatPasswordToggle.addEventListener('click', function(){
        const type = repeatPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        repeatPasswordInput.setAttribute('type', type);
    });

    submitButton.textContent = "Register";
    submitButton.setAttribute('class', "bg-green-600 hover:bg-green-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full");
    submitButton.setAttribute("type", "submit");

    usernameDiv.appendChild(usernameLabel);
    usernameDiv.appendChild(usernameInput);

    emailDiv.appendChild(emailLabel);
    emailDiv.appendChild(emailInput);

    passwordDiv.appendChild(passwordLabel);
    passwordWrapper1.classList.add("relative");
    passwordWrapper1.appendChild(passwordInput);
    passwordWrapper1.appendChild(passwordToggle);
    passwordDiv.appendChild(passwordWrapper1);

    repeatPasswordDiv.appendChild(repeatPasswordLabel);
    passwordWrapper2.classList.add("relative", "mb-3");
    passwordWrapper2.appendChild(repeatPasswordInput);
    passwordWrapper2.appendChild(repeatPasswordToggle);
    repeatPasswordDiv.appendChild(passwordWrapper2);

    form.appendChild(h2);
    form.appendChild(usernameDiv);
    form.appendChild(emailDiv);
    form.appendChild(passwordDiv);
    form.appendChild(repeatPasswordDiv);
    form.appendChild(submitButton);

    registerUI.appendChild(form);
    document.body.appendChild(registerUI);

    // Add event listener for register form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Register Form Submitted');
        const formData = new FormData(form);
        
        // Log the form data
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        registerUser(formData);
        closeUI(registerUI);
        alert('Registrator successful!');
    });
}



function signOut() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    const email = userProfile ? userProfile.email : ''; // Get email from local storage

    fetch(`http://${IP}:3000/api/logout`, { // Ensure the URL points to the correct server endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Send email in the request body
    })
    .then(response => {
        if (response.ok) {
            // Remove user profile from local storage
            localStorage.removeItem('userProfile');
            window.location.href = 'index.html'; // Redirect to home or login page after logout
        } else {
            return response.json().then(error => {
                throw new Error(error.error);
            });
        }
    })
    .catch(error => {
        console.error('Logout failed:', error);
        // Handle logout failure (e.g., show an error message)
    });
}



export {
    createLogInUI,
    createRegisterUI,
    signOut,
}