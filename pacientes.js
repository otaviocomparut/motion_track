import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    doc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


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
// SELECT EXERCÍCIOS
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
// SELECT PERFIL CLÍNICO
// ============================

async function carregarSelectPerfil() {

    const select =
    document.getElementById(
        "pacientePerfil"
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
// CADASTRO PACIENTE
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
                await carregarSelectPerfil();

            } catch (erro) {

                console.error(
                    erro
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

            }

        }
    );

}


// ============================
// VIDEOS ENVIADOS
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
    href="analise-video.html?video=${encodeURIComponent(video.videoUrl)}&tipo=${video.tipoExercicio}">

    Analisar

</a>

            <br><br>
        `;

        lista.appendChild(
            li
        );

    });

}


// ============================
// PERFIL CLÍNICO
// ============================

async function carregarPerfilPaciente() {

    const select =
    document.getElementById(
        "pacientePerfil"
    );

    const div =
    document.getElementById(
        "perfilPaciente"
    );

    if (!select || !div) return;

    const email =
    select.value;

    const exercicios =
    await getDocs(
        query(
            collection(
                db,
                "exercicios"
            ),
            where(
                "pacienteEmail",
                "==",
                email
            )
        )
    );

    const videos =
    await getDocs(
        query(
            collection(
                db,
                "videos"
            ),
            where(
                "pacienteEmail",
                "==",
                email
            )
        )
    );

    const quantidadeExercicios =
    exercicios.size;

    const quantidadeVideos =
    videos.size;

    let html = `

        <h4>Paciente</h4>

        <strong>Email:</strong>
        ${email}

        <br><br>

        <strong>Resumo</strong>

        <br>

        Exercícios atribuídos:
        ${quantidadeExercicios}

        <br>

        Vídeos enviados:
        ${quantidadeVideos}

        <br><br>

        <strong>Exercícios</strong>

        <ul>
    `;

    exercicios.forEach((documento) => {

        const exercicio =
        documento.data();

        html += `
            <li>

                ${exercicio.tipo}

                -

                Status:
                ${exercicio.status}

                <br>

                ${
                    exercicio.status !== "concluido"
                    ?
                    `<button onclick="concluirExercicio('${documento.id}')">
                        Concluir Exercício
                    </button>`
                    :
                    "✅ Concluído"
                }

            </li>
        `;

    });

    html += `
        </ul>

        <strong>Vídeos</strong>

        <ul>
    `;

    videos.forEach((documento) => {

        const video =
        documento.data();

        html += `
            <li>

                ${video.tipoExercicio}

                -

                <a
                    href="${video.videoUrl}"
                    target="_blank">

                    Assistir

                </a>

            </li>
        `;

    });

    html += `
        </ul>
    `;

    div.innerHTML = html;

}
window.concluirExercicio =
async function(id){

    try{

        await updateDoc(
            doc(
                db,
                "exercicios",
                id
            ),
            {
                status: "concluido"
            }
        );

        alert(
            "Exercício concluído!"
        );

        await carregarPerfilPaciente();

    }catch(erro){

        console.error(
            erro
        );

        alert(
            "Erro ao concluir exercício"
        );

    }

};


// ============================
// EVENTOS
// ============================

const seletorPerfil =
document.getElementById(
    "pacientePerfil"
);

if (seletorPerfil) {

    seletorPerfil.addEventListener(
        "change",
        carregarPerfilPaciente
    );

}


// ============================
// INICIALIZAÇÃO
// ============================

async function iniciar() {

    await carregarPacientes();

    await carregarSelect();

    await carregarVideos();

    await carregarSelectPerfil();

    carregarPerfilPaciente();

}

iniciar();