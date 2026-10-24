const usuario =
JSON.parse(
localStorage.getItem(
"usuarioLogado"
));

if(usuario){

    const nomeProfissional =
    document.getElementById(
    "nomeProfissional"
    );

    if(nomeProfissional){

        nomeProfissional.innerText =
        usuario.nome;

    }

}

function carregarPacientes(){

    const lista =
    document.getElementById(
    "listaPacientes"
    );

    if(!lista) return;

    lista.innerHTML = "";

    const pacientes =
    JSON.parse(
    localStorage.getItem(
    "pacientes"
    )) || [];

    pacientes.forEach((paciente)=>{

        const li =
        document.createElement("li");

        li.innerText =
        paciente.nome +
        " - " +
        paciente.email;

        lista.appendChild(li);

    });

}

const formPaciente =
document.getElementById(
"formPaciente"
);

if(formPaciente){

    formPaciente.addEventListener(
        "submit",
        function(e){

            e.preventDefault();

            const paciente = {

                id: Date.now(),

                nome:
                document.getElementById(
                "nomePaciente"
                ).value,

                email:
                document.getElementById(
                "emailPaciente"
                ).value

            };

            let pacientes =
            JSON.parse(
            localStorage.getItem(
            "pacientes"
            )) || [];

            pacientes.push(
            paciente
            );

            localStorage.setItem(
                "pacientes",
                JSON.stringify(
                pacientes
                )
            );

            carregarPacientes();
            carregarSelect();

            formPaciente.reset();

        }
    );

}

function carregarSelect(){

    const select =
    document.getElementById(
    "pacienteSelecionado"
    );

    if(!select) return;

    select.innerHTML = "";

    const pacientes =
    JSON.parse(
    localStorage.getItem(
    "pacientes"
    )) || [];

    pacientes.forEach((paciente)=>{

        let option =
        document.createElement(
        "option"
        );

        option.value =
        paciente.email;

        option.textContent =
        paciente.nome;

        select.appendChild(
        option
        );

    });

}

const formExercicio =
document.getElementById(
"formExercicio"
);

if(formExercicio){

    formExercicio.addEventListener(
        "submit",
        function(e){

            e.preventDefault();

            const exercicio = {

                paciente:
                document.getElementById(
                "pacienteSelecionado"
                ).value,

                tipo:
                document.getElementById(
                "tipoExercicio"
                ).value,

                status:
                "pendente"

            };

            let exercicios =
            JSON.parse(
            localStorage.getItem(
            "exercicios"
            )) || [];

            exercicios.push(
            exercicio
            );

            localStorage.setItem(
                "exercicios",
                JSON.stringify(
                exercicios
            ));

            alert(
            "Exercício enviado!"
            );

        }
    );

}

carregarPacientes();
carregarSelect();