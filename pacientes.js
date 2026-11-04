import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================
// CARREGAR PACIENTES
// ============================

async function carregarPacientes() {

    const lista =
    document.getElementById(
        "listaPacientes"
    );

    if (!lista) return;

    lista.innerHTML = "";

    const snapshot =
    await getDocs(
        collection(
            db,
            "pacientes"
        )
    );

    snapshot.forEach((documento) => {

        const paciente =
        documento.data();

        const li =
        document.createElement(
            "li"
        );

        li.innerText =
        paciente.nome +
        " - " +
        paciente.email;

        lista.appendChild(
            li
        );

    });

}


// ============================
// CARREGAR SELECT
// ============================

async function carregarSelect() {

    const select =
    document.getElementById(
        "pacienteSelecionado"
    );

    if (!select) return;

    select.innerHTML = "";

    const snapshot =
    await getDocs(
        collection(
            db,
            "pacientes"
        )
    );

    snapshot.forEach((documento) => {

        const paciente =
        documento.data();

        const option =
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


// ============================
// CADASTRAR PACIENTE
// ============================

const formPaciente =
document.getElementById(
    "formPaciente"
);

if (formPaciente) {

    formPaciente.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const nome =
            document.getElementById(
                "nomePaciente"
            ).value;

            const email =
            document.getElementById(
                "emailPaciente"
            ).value;

            try {

                await addDoc(
                    collection(
                        db,
                        "pacientes"
                    ),
                    {
                        nome,
                        email
                    }
                );

                alert(
                    "Paciente cadastrado!"
                );

                formPaciente.reset();

                await carregarPacientes();
                await carregarSelect();

            } catch (erro) {

                console.error(
                    erro
                );

                alert(
                    "Erro ao cadastrar paciente"
                );

            }

        }
    );

}


// ============================
// CRIAR EXERCÍCIO
// ============================

const formExercicio =
document.getElementById(
    "formExercicio"
);

if (formExercicio) {

    formExercicio.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const pacienteEmail =
            document.getElementById(
                "pacienteSelecionado"
            ).value;

            const tipo =
            document.getElementById(
                "tipoExercicio"
            ).value;

            try {

                await addDoc(
                    collection(
                        db,
                        "exercicios"
                    ),
                    {
                        pacienteEmail,
                        tipo,
                        status:
                        "pendente",

                        dataCriacao:
                        new Date()
                    }
                );

                alert(
                    "Exercício enviado!"
                );

            } catch (erro) {

                console.error(
                    erro
                );

                alert(
                    "Erro ao criar exercício"
                );

            }

        }
    );

}


// ============================
// CARREGAR VIDEOS
// ============================

async function carregarVideos() {

    const lista =
    document.getElementById(
        "listaVideos"
    );

    if (!lista) return;

    lista.innerHTML = "";

    const snapshot =
    await getDocs(
        collection(
            db,
            "videos"
        )
    );

    snapshot.forEach((documento) => {

        const video =
        documento.data();

        const li =
        document.createElement(
            "li"
        );

        li.innerHTML = `
            <strong>Paciente:</strong>
            ${video.pacienteEmail}

            <br>

            <strong>Exercício:</strong>
            ${video.tipoExercicio}

            <br>

            <a
                href="${video.videoUrl}"
                target="_blank">

                Assistir Vídeo

            </a>

            <br><br>
        `;

        lista.appendChild(
            li
        );

    });

}


// ============================
// INICIALIZAÇÃO
// ============================

carregarPacientes();
carregarSelect();
carregarVideos();