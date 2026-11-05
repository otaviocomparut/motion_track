import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

const parametros =
new URLSearchParams(window.location.search);

const exercicio =
parametros.get("exercicio");

console.log("Exercício:", exercicio);

const CLOUD_NAME = "dvp2oqxv";
const UPLOAD_PRESET = "motiontrack_upload";

document
.getElementById("btnUpload")
.addEventListener("click", async () => {

    const arquivo =
    document.getElementById("videoFile").files[0];

    if (!arquivo) {

        alert("Selecione um vídeo");

        return;
    }

    const formData =
    new FormData();

    formData.append(
        "file",
        arquivo
    );

    formData.append(
        "upload_preset",
        UPLOAD_PRESET
    );

    try {

        const resposta =
        await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const dados =
        await resposta.json();

        if (dados.error) {

            alert(
                dados.error.message
            );

            return;
        }

        const usuario =
        auth.currentUser;

        console.log(usuario);

        if (!usuario) {

            alert(
                "Usuário não autenticado."
            );

            return;
        }

        await addDoc(
            collection(
                db,
                "videos"
            ),
            {
                pacienteEmail:
                usuario.email,

                tipoExercicio:
                exercicio,

                videoUrl:
                dados.secure_url,

                status:
                "enviado",

                dataEnvio:
                new Date()
            }
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
        usuario.email
    ),
    where(
        "tipo",
        "==",
        exercicio
    )
);

const exercicios =
await getDocs(
    consulta
);

for(const documento of exercicios.docs){

    await updateDoc(
        documento.ref,
        {
            status:
            "enviado"
        }
    );

}

        console.log(
            "VIDEO SALVO"
        );

        document.getElementById(
            "resultado"
        ).innerHTML = `
            <h3>Vídeo enviado com sucesso!</h3>

            <a href="${dados.secure_url}" target="_blank">
                Assistir vídeo
            </a>
        `;

        alert(
            "Upload concluído!"
        );

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao salvar vídeo."
        );

    }

});