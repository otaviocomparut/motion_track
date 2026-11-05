import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
            "login.html";

            return;

        }

        document.getElementById(
            "emailPaciente"
        ).textContent =
        user.email;

        await carregarNome(
            user.email
        );

        await carregarExercicios(
            user.email
        );

        await carregarVideos(
            user.email
        );

    }
);


// =====================
// CARREGAR NOME
// =====================

async function carregarNome(email) {

    const consulta =
    query(
        collection(
            db,
            "usuarios"
        ),
        where(
            "email",
            "==",
            email
        )
    );

    const snapshot =
    await getDocs(
        consulta
    );

    snapshot.forEach(
        (documento) => {

            const usuario =
            documento.data();

            document.getElementById(
                "nomePaciente"
            ).textContent =
            usuario.nome;

        }
    );

}


// =====================
// EXERCÍCIOS
// =====================

async function carregarExercicios(email) {

    const lista =
    document.getElementById(
        "listaExerciciosPerfil"
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
            email
        )
    );

    const snapshot =
    await getDocs(
        consulta
    );

    lista.innerHTML = "";

    snapshot.forEach(
        (documento) => {

            const exercicio =
            documento.data();

            const bloco =
            document.createElement(
                "div"
            );

            bloco.innerHTML = `
                <hr>

                Exercício:
                ${exercicio.tipo}

                <br>

                Status:
                ${exercicio.status}
            `;

            lista.appendChild(
                bloco
            );

        }
    );

}


// =====================
// VIDEOS
// =====================

async function carregarVideos(email) {

    const lista =
    document.getElementById(
        "listaVideosPerfil"
    );

    const consulta =
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
    );

    const snapshot =
    await getDocs(
        consulta
    );

    lista.innerHTML = "";

    snapshot.forEach(
        (documento) => {

            const video =
            documento.data();

            let dataFormatada =
            "Não informada";

            if (video.dataEnvio) {

                const data =
                video.dataEnvio.toDate();

                dataFormatada =
                data.toLocaleDateString(
                    "pt-BR"
                );

            }

            const bloco =
            document.createElement(
                "div"
            );

            bloco.innerHTML = `

                <hr>

                Exercício:
                ${video.tipoExercicio}

                <br>

                Data:
                ${dataFormatada}

                <br>

                Status:
                ✅ Vídeo Enviado

                <br><br>

                <a
                    href="${video.videoUrl}"
                    target="_blank">

                    Assistir Vídeo

                </a>

            `;

            lista.appendChild(
                bloco
            );

        }
    );

}