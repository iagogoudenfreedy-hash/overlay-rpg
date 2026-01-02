import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Configurações do seu projeto
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

// Identifica o personagem pelo link (ex: ?id=leonor)
const params = new URLSearchParams(window.location.search);
const charId = params.get('id') || 'leonor';
const charRef = ref(db, 'personagens/' + charId);

let vidaAnterior = null;

onValue(charRef, (snapshot) => {
    const dados = snapshot.val();
    if (!dados) return;

    const vidaAtual = dados.vidaAtual || 0;
    const vidaMax = dados.vidaMax || 0;
    const vidaElement = document.getElementById("vida");
    const fotoElement = document.getElementById("foto");

    // Lógica de Efeitos Visuais
    if (vidaAnterior !== null && vidaAnterior !== vidaAtual) {
        
        // Remove classes para poder reiniciar a animação
        fotoElement.classList.remove("shake-effect");
        vidaElement.classList.remove("flash-red", "flash-green");
        
        // Truque para resetar animação CSS
        void fotoElement.offsetWidth; 
        void vidaElement.offsetWidth;

        if (vidaAtual < vidaAnterior) {
            // Sofreu Dano
            fotoElement.classList.add("shake-effect");
            vidaElement.classList.add("flash-red");
        } else {
            // Recebeu Cura
            vidaElement.classList.add("flash-green");
        }

        // Limpa o brilho após o efeito
        setTimeout(() => {
            vidaElement.classList.remove("flash-red", "flash-green");
            fotoElement.classList.remove("shake-effect");
        }, 450);
    }

    vidaAnterior = vidaAtual;

    // Atualiza Textos
    document.getElementById("nome").innerText = dados.nome || "---";
    vidaElement.innerText = `${vidaAtual}/${vidaMax}`;
    document.getElementById("pd").innerText = dados.pd || 0;
    
    // Atualiza Imagem
    if (dados.imagem && fotoElement.getAttribute('src') !== dados.imagem) {
        fotoElement.src = dados.imagem;
    }
});
