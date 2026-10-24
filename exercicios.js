const usuarioPaciente =
JSON.parse(
localStorage.getItem(
"usuarioLogado"
));

if(usuarioPaciente){

    const nome =
    document.getElementById(
    "nomePacienteLogado"
    );

    nome.innerText =
    usuarioPaciente.nome;

}

const lista =
document.getElementById(
"listaExercicios"
);

const exercicios =
JSON.parse(
localStorage.getItem(
"exercicios"
)) || [];

if(lista && usuarioPaciente){

    const meusExercicios =
    exercicios.filter((ex)=>{

        return ex.paciente ===
        usuarioPaciente.email;

    });

    meusExercicios.forEach((ex)=>{

        const li =
        document.createElement(
        "li"
        );

        li.innerText =
        ex.tipo +
        " - " +
        ex.status;

        lista.appendChild(
        li
        );

    });

}