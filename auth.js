const cadastroForm =
document.getElementById("cadastroForm");

if(cadastroForm){

cadastroForm.addEventListener(
"submit",
function(e){

e.preventDefault();

const usuario = {

nome:
document.getElementById("nome").value,

email:
document.getElementById("emailCadastro").value,

senha:
document.getElementById("senhaCadastro").value,

tipo:
document.getElementById("tipoUsuario").value

};

localStorage.setItem(
usuario.email,
JSON.stringify(usuario)
);

alert("Conta criada com sucesso!");

window.location.href =
"login.html";

});

}

const loginForm =
document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener(
"submit",
function(e){

e.preventDefault();

const email =
document.getElementById("email").value;

const senha =
document.getElementById("senha").value;

const usuario =
JSON.parse(
localStorage.getItem(email)
);

if(!usuario){

alert("Usuário não encontrado!");

return;

}

if(usuario.senha !== senha){

alert("Senha incorreta!");

return;

}

localStorage.setItem(
"usuarioLogado",
JSON.stringify(usuario)
);

alert("Login realizado!");

});
}