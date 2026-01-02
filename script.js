import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCWRP5BsWjumVk2ocmOkLdYRPEqGMYhKag",
  authDomain: "overlay-eec76.firebaseapp.com",
  databaseURL: "https://overlay-eec76-default-rtdb.firebaseio.com",
  projectId: "overlay-eec76",
  storageBucket: "overlay-eec76.firebasestorage.app",
  messagingSenderId: "385076082002",
  appId: "1:385076082002:web:3fd19771e36575e61cf68b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Pega o ID da URL (?id=leonor)
const params = new URLSearchParams(window.location.search);
const charId = params.get('id') || 'leonor';

const charRef = ref(db, 'personagens/' + charId);

onValue(charRef, (snapshot) => {
    const dados = snapshot.val();
    if (dados) {
        document.getElementById("nome").innerText = dados.nome || "---";
        document.getElementById("vida").innerText = `${dados.vidaAtual || 0}/${dados.vidaMax || 0}`;
        document.getElementById("pd").innerText = dados.pd || 0;
        
        const fotoElement = document.getElementById("foto");
        if (dados.imagem && fotoElement.getAttribute('src') !== dados.imagem) {
            fotoElement.src = dados.imagem;
        }
    }
});
