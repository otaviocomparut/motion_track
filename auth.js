import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cadastroForm =
document.getElementById(
"cadastroForm"
);

if(cadastroForm){

cadastroForm.addEventListener(
"submit",
async (e)=>{

e.preventDefault();

const nome =
document.getElementById(
"nome"
).value;

const email =
document.getElementById(
"emailCadastro"
).value;

const senha =
document.getElementById(
"senhaCadastro"
).value;

const tipo =
document.getElementById(
"tipoUsuario"
).value;

try{

const credencial =
await createUserWithEmailAndPassword(
auth,
email,
senha
);

await setDoc(
doc(
db,
"usuarios",
credencial.user.uid
),
{
nome,
email,
tipo
}
);

alert(
"Cadastro realizado!"
);

window.location.href =
"login.html";

}catch(erro){

alert(
erro.message
);

}

});
}

const loginForm =
document.getElementById(
"loginForm"
);

if(loginForm){

loginForm.addEventListener(
"submit",
async (e)=>{

e.preventDefault();

const email =
document.getElementById(
"email"
).value;

const senha =
document.getElementById(
"senha"
).value;

try{

const credencial =
await signInWithEmailAndPassword(
auth,
email,
senha
);

const docRef =
await getDoc(
doc(
db,
"usuarios",
credencial.user.uid
)
);

const usuario =
docRef.data();

if(
usuario.tipo ===
"profissional"
){

window.location.href =
"dashboard-profissional.html";

}else{

window.location.href =
"dashboard-paciente.html";

}

}catch(erro){

alert(
"Login inválido"
);

}

});
}