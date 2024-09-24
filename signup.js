import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-app.js";
import { createUserWithEmailAndPassword, getAuth } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-auth.js";
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

document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const permission = document.getElementById('role').value; // Alterado para 'permission'
    const position = document.getElementById('position').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const hierarchy = document.getElementById('hierarchy').value;

    if (!fullName || !email || !permission || !position || !password || !confirmPassword || !hierarchy) {
        document.getElementById('error-message').textContent = "Todos os campos são obrigatórios!";
        return;
    }

    if (password !== confirmPassword) {
        document.getElementById('error-message').textContent = "As senhas não são iguais!";
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            set(ref(realtimeDB, 'users/' + user.uid), {
                fullName: fullName,
                email: user.email,
                permission: permission,
                position: position,
                hierarchy: hierarchy,
                createdAt: new Date().toISOString()
            })
                .then(() => {
                    console.log("Dados salvos no Realtime Database com sucesso");

                    document.getElementById('signup-form').reset();

                    const successMessage = document.createElement('p');
                    successMessage.textContent = "Cadastrado com sucesso!";
                    successMessage.style.color = "green";
                    document.getElementById('signup').appendChild(successMessage);
                })
                .catch((error) => {
                    console.error("Erro ao salvar no Realtime Database:", error);
                });

            console.log("Usuário cadastrado:", user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            document.getElementById('error-message').textContent = errorMessage;
            console.error("Erro ao cadastrar:", errorCode, errorMessage);
        });
});
