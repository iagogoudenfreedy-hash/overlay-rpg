// Importando via CDN para funcionar direto no navegador/OBS
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// SUAS CONFIGURAÇÕES REAIS (Copiadas da imagem)
const firebaseConfig = {
  apiKey: "AIzaSyCWRP5BsWjumVk2ocmOkLdYRPEqGMYhKag",
  authDomain: "overlay-eec76.firebaseapp.com",
  databaseURL: "https://overlay-eec76-default-rtdb.firebaseio.com",
  projectId: "overlay-eec76",
  storageBucket: "overlay-eec76.firebasestorage.app",
  messagingSenderId: "385076082002",
  appId: "1:385076082002:web:3fd19771e36575e61cf68b"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Pega o ID da URL (ex: index.html?id=leonor)
const params = new URLSearchParams(window.location.search);
const charId = params.get('id') || 'padrao';

const charRef = ref(db, 'personagens/' + charId);
console.log(`Conectado ao personagem: ${charId}`);

// Escuta as mudanças em TEMPO REAL
onValue(charRef, (snapshot) => {
    const dados = snapshot.val();

    if (dados) {
        // Atualiza Nome e textos com fallback seguro
        document.getElementById("nome").innerText = dados.nome || "Sem Nome";
        
        const vidaAtual = dados.vidaAtual !== undefined ? dados.vidaAtual : 0;
        const vidaMax = dados.vidaMax !== undefined ? dados.vidaMax : 0;
        document.getElementById("vida").innerText = `${vidaAtual}/${vidaMax}`;
        
        document.getElementById("pd").innerText = dados.pd !== undefined ? dados.pd : 0;

        // Atualiza Imagem apenas se mudar (evita piscar)
        const fotoElement = document.getElementById("foto");
        const novaImagem = dados.imagem || "Armature_IDLE_00.png";
        
        if (fotoElement.getAttribute('src') !== novaImagem) {
            fotoElement.src = novaImagem;
        }
    } else {
        console.log("Nenhum dado encontrado. Painel deve criar os dados.");
    }
});