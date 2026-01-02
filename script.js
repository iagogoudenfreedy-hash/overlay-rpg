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

// Variável para guardar a vida anterior e comparar
let vidaAnterior = null;

onValue(charRef, (snapshot) => {
    const dados = snapshot.val();
    if (dados) {
        const vidaAtual = dados.vidaAtual || 0;
        const vidaMax = dados.vidaMax || 0;
        const vidaElement = document.getElementById("vida");
        const fotoElement = document.getElementById("foto");

        // Detecta mudança na vida para aplicar efeitos
        if (vidaAnterior !== null && vidaAnterior !== vidaAtual) {
            if (vidaAtual < vidaAnterior) {
                // EFEITO DE DANO
                fotoElement.classList.add("shake-effect");
                vidaElement.classList.add("flash-red");
            } else {
                // EFEITO DE CURA
                vidaElement.classList.add("flash-green");
            }

            // Remove os efeitos após 500ms para poderem ser usados de novo
            setTimeout(() => {
                fotoElement.classList.remove("shake-effect");
                vidaElement.classList.remove("flash-red");
                vidaElement.classList.remove("flash-green");
            }, 500);
        }

        vidaAnterior = vidaAtual; // Atualiza a referência

        // Atualização normal dos textos
        document.getElementById("nome").innerText = dados.nome || "---";
        vidaElement.innerText = `${vidaAtual}/${vidaMax}`;
        document.getElementById("pd").innerText = dados.pd || 0;
        
        if (dados.imagem && fotoElement.getAttribute('src') !== dados.imagem) {
            fotoElement.src = dados.imagem;
        }
    }
});
