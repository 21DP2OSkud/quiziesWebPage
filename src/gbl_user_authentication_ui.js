import * as ui from './gbl_create_ui.js';
const {
    createOverlay,
    closeUI,
} = ui;


function createLogInUI() {
    createOverlay();
    const signUpUI = document.createElement('div');
    signUpUI.setAttribute('class', "ui authentication-ui bg-white p-8 rounded-lg shadow-lg w-96 h-auto mx-auto my-12 relative");

    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('class', "absolute top-2 right-2 text-gray-500 hover:text-gray-700");
    closeBtn.textContent = "✖";
    closeBtn.addEventListener('click', function(){
        console.log("closing login ui");
        closeUI(signUpUI);
    });
    signUpUI.appendChild(closeBtn);

    const form = document.createElement('form');
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

    passwordLabel.textContent = "Password";
    passwordLabel.classList.add("block", "text-gray-700", "text-sm", "font-bold", "mb-2");
    passwordInput.classList.add("shadow", "appearance-none", "border", "rounded", "w-full", "py-2", "px-3", "text-gray-700", "mb-3", "leading-tight", "focus:outline-none", "focus:shadow-outline");
    passwordInput.setAttribute("type", "password");
    passwordInput.setAttribute("placeholder", "Enter your password");

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
    submitButton.setAttribute('class', "bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-transform duration-200 transform hover:scale-105");
    submitButton.setAttribute("type", "submit");

    noAccountLabel.textContent = "Don't have an account? Sign up";
    noAccountLabel.setAttribute('class', "block text-center text-blue-700 text-sm font-bold mt-4 cursor-pointer hover:text-blue-400");
    noAccountLabel.addEventListener("click", function() {
        closeUI(signUpUI);
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
    signUpUI.appendChild(form);
    document.body.appendChild(signUpUI);
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
    
    emailLabel.textContent = "Email";
    emailLabel.classList.add("block", "text-gray-700", "text-sm", "font-bold", "mb-2");
    emailInput.classList.add("shadow", "appearance-none", "border", "rounded", "w-full", "py-2", "px-3", "text-gray-700", "mb-3", "leading-tight", "focus:outline-none", "focus:shadow-outline");
    emailInput.setAttribute("type", "email");
    emailInput.setAttribute("placeholder", "Enter your email");
    
    passwordLabel.textContent = "Password";
    passwordLabel.classList.add("block", "text-gray-700", "text-sm", "font-bold", "mb-2");
    passwordInput.classList.add("shadow", "appearance-none", "border", "rounded", "w-full", "py-2", "px-3", "text-gray-700", "mb-3", "leading-tight", "focus:outline-none", "focus:shadow-outline");
    passwordInput.setAttribute("type", "password");
    passwordInput.setAttribute("placeholder", "Enter your password");
    
    repeatPasswordLabel.textContent = "Repeat Password";
    repeatPasswordLabel.classList.add("block", "text-gray-700", "text-sm", "font-bold", "mb-2");
    repeatPasswordInput.classList.add("shadow", "appearance-none", "border", "rounded", "w-full", "py-2", "px-3", "text-gray-700", "mb-3", "leading-tight", "focus:outline-none", "focus:shadow-outline");
    repeatPasswordInput.setAttribute("type", "password");
    repeatPasswordInput.setAttribute("placeholder", "Repeat your password");
    
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
    submitButton.setAttribute('class', "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full");
    submitButton.setAttribute("type", "submit");
    
    usernameDiv.appendChild(usernameLabel);
    usernameDiv.appendChild(usernameInput);
    
    emailDiv.appendChild(emailLabel);
    emailDiv.appendChild(emailInput);
    
    passwordDiv.appendChild(passwordLabel);
    passwordWrapper1.classList.add("relative", "mb-3");
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
}


function signOut() {
    
}


export {
    createLogInUI,
    createRegisterUI,
    signOut,
}