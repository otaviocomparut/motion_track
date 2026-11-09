import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
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
            (documento) => {

                const exercicio =
                documento.data();

                const li =
                document.createElement(
                    "li"
                );

                if (
                    exercicio.status ===
                    "pendente"
                ) {

                    li.innerHTML = `
                        🟡 ${exercicio.tipo} - pendente

                        <button
                            onclick="abrirUpload('${exercicio.tipo}')">

                            Enviar Vídeo

                        </button>
                    `;

                }
                else if (
                    exercicio.status ===
                    "enviado"
                ) {

                    li.innerHTML = `
                        🔵 ${exercicio.tipo} - enviado

                        <br>

                        Aguardando avaliação
                    `;

                }
                else if (
                    exercicio.status ===
                    "concluido"
                ) {

                    li.innerHTML = `
                        🟢 ${exercicio.tipo} - concluido

                        <br>

                        Exercício finalizado
                    `;

                }

                lista.appendChild(
                    li
                );

            }
        );

    }
);


window.abrirUpload =
function(tipoExercicio){

    window.location.href =
    `upload-video.html?exercicio=${tipoExercicio}`;

};  