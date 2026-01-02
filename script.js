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

    // Aciona efeitos apenas se o valor MUDAR
    if (vidaAnterior !== null && vidaAnterior !== vidaAtual) {
        
        // Reseta as animações
        fotoElement.classList.remove("shake-effect");
        vidaElement.classList.remove("flash-red", "flash-green");
        
        // Força o navegador a reiniciar o ciclo de animação
        void fotoElement.offsetWidth; 
        void vidaElement.offsetWidth;

        if (vidaAtual < vidaAnterior) {
            // Dano detectado
            fotoElement.classList.add("shake-effect");
            vidaElement.classList.add("flash-red");
        } else {
            // Cura detectada
            vidaElement.classList.add("flash-green");
        }

        // Remove os efeitos visuais após a animação acabar
        setTimeout(() => {
            vidaElement.classList.remove("flash-red", "flash-green");
            fotoElement.classList.remove("shake-effect");
        }, 450);
    }

    vidaAnterior = vidaAtual;

    // Atualiza os elementos na tela
    document.getElementById("nome").innerText = dados.nome || "---";
    vidaElement.innerText = `${vidaAtual}/${vidaMax}`;
    document.getElementById("pd").innerText = dados.pd || 0;
    
    if (dados.imagem && fotoElement.getAttribute('src') !== dados.imagem) {
        fotoElement.src = dados.imagem;
    }
});
