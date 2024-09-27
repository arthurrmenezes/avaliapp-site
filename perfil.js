// Importando Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-auth.js";
import { get, getDatabase, ref } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userRef = ref(db, 'users/' + user.uid);
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                document.getElementById('full-name').textContent = userData.fullName || 'N/A';
                document.getElementById('email').textContent = userData.email || 'N/A';
                document.getElementById('hierarchy').textContent = userData.hierarchy || 'N/A';
                document.getElementById('position').textContent = userData.cargo || 'N/A';
                document.getElementById('user-photo').src = userData.photoURL || 'default-photo.png';  // Foto de perfil
            } else {
                console.error("Nenhum dado encontrado.");
            }
        }).catch((error) => {
            console.error("Erro ao buscar os dados:", error);
        });
    } else {
        window.location.href = "signup.html";
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "signup.html";
    }).catch((error) => {
        console.error("Erro ao fazer logout:", error);
    });
});
