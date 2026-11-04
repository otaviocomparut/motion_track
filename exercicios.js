import { db } from "./firebase.js";

import {
collection,
query,
where,
getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
getAuth
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

auth.onAuthStateChanged(
async (user)=>{

if(!user){

window.location.href =
"login.html";

return;

}

const lista =
document.getElementById(
"listaExercicios"
);

const consulta =
query(
collection(
db,
"exercicios"
),
where(
"pacienteEmail",
"==",
user.email
)
);

const snapshot =
await getDocs(
consulta
);

lista.innerHTML = "";

snapshot.forEach(
(doc)=>{

const exercicio =
doc.data();

const li =
document.createElement(
"li"
);

li.innerHTML = `
    ${exercicio.tipo} - ${exercicio.status}

    <button
        onclick="abrirUpload('${exercicio.tipo}')">
        Enviar Vídeo
    </button>
`;
lista.appendChild(
li
);

});

});
window.abrirUpload =
function(tipoExercicio){

    window.location.href =
    `upload-video.html?exercicio=${tipoExercicio}`;

};