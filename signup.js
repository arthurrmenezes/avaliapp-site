import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-app.js";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAgKrFLZlWF-fE-GDuPnPBIXJLKO0uVuZ0",
    authDomain: "avaliapp-bb2e1.firebaseapp.com",
    databaseURL: "https://avaliapp-bb2e1-default-rtdb.firebaseio.com",
    projectId: "avaliapp-bb2e1",
    storageBucket: "avaliapp-bb2e1.appspot.com",
    messagingSenderId: "923470973444",
    appId: "1:923470973444:web:2d480ecbabf731a8294351"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const realtimeDB = getDatabase(firebaseApp);

// Função para registrar o usuário
document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const permission = document.getElementById('role').value;
    const cargo = document.getElementById('position').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const hierarchy = document.getElementById('hierarchy').value;
    const errorMessage = document.getElementById('error-message');

    // Limpar mensagem de erro anterior
    errorMessage.textContent = '';

    if (!fullName || !email || !permission || !cargo || !password || !confirmPassword || !hierarchy) {
        errorMessage.textContent = "Todos os campos são obrigatórios!";
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = "As senhas não são iguais!";
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            set(ref(realtimeDB, 'users/' + user.uid), {
                fullName: fullName,
                email: user.email,
                permission: permission,
                cargo: cargo,
                hierarchy: hierarchy,
                createdAt: new Date().toISOString()
            })
                .then(() => {
                    console.log("Dados salvos no Realtime Database com sucesso");

                    document.getElementById('signup-form').reset();

                    const successMessage = document.createElement('p');
                    successMessage.textContent = "Cadastrado com sucesso!";
                    successMessage.style.color = "green";
                    errorMessage.appendChild(successMessage);
                })
                .catch((error) => {
                    console.error("Erro ao salvar no Realtime Database:", error);
                });

            console.log("Usuário cadastrado:", user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessageText = error.message;
            errorMessage.textContent = errorMessageText;
            console.error("Erro ao cadastrar:", errorCode, errorMessageText);
        });
});

// Função para realizar login
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const loginEmail = document.getElementById('login-email').value;
    const loginPassword = document.getElementById('login-password').value;
    const loginErrorMessage = document.getElementById('login-error-message');

    loginErrorMessage.textContent = '';

    if (!loginEmail || !loginPassword) {
        loginErrorMessage.textContent = "E-mail e senha são obrigatórios!";
        return;
    }

    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Login bem-sucedido:", user);

            // Redirecionar para perfil.html após login bem-sucedido
            window.location.href = "perfil.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessageText = error.message;
            loginErrorMessage.textContent = errorMessageText;
            console.error("Erro ao fazer login:", errorCode, errorMessageText);
        });
});
