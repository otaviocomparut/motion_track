import { db }
from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const parametros =
new URLSearchParams(
    window.location.search
);

const pacienteEmail =
parametros.get(
    "pacienteEmail"
);

function calcularBerg(

    pontuacaoRomberg,

    pontuacaoUnipodal,

    pontuacaoMarcha

){

    const total =

        pontuacaoRomberg +

        pontuacaoUnipodal +

        pontuacaoMarcha;

    let risco = "";

    if(total >= 240){

        risco =
        "Baixo";

    }
    else if(total >= 180){

        risco =
        "Moderado";

    }
    else{

        risco =
        "Alto";

    }

    return {

        total,
        risco,

        pontuacaoRomberg,
        pontuacaoUnipodal,
        pontuacaoMarcha

    };

}

async function carregarBerg(){

    console.log(
        "PACIENTE BERG:",
        pacienteEmail
    );

    const snapshot =
    await getDocs(

        query(

            collection(
                db,
                "resultados"
            ),

            where(
                "pacienteEmail",
                "==",
                pacienteEmail
            )

        )

    );

    let pontuacaoRomberg = 0;
    let pontuacaoUnipodal = 0;
    let pontuacaoMarcha = 0;

    snapshot.forEach(
        (documento)=>{

            const dado =
            documento.data();

            if(
                dado.exercicio ===
                "romberg"
            ){

                pontuacaoRomberg =
                dado.pontuacao || 0;

            }

            if(
                dado.exercicio ===
                "unipodal"
            ){

                pontuacaoUnipodal =
                dado.pontuacao || 0;

            }

            if(
                dado.exercicio ===
                "marcha"
            ){

                pontuacaoMarcha =
                dado.pontuacao || 0;

            }

        }
    );

    const berg =
    calcularBerg(

        pontuacaoRomberg,

        pontuacaoUnipodal,

        pontuacaoMarcha

    );

    mostrarResultadoBerg(
        berg
    );

}

function mostrarResultadoBerg(
    berg
){

    const resultado =
    document.getElementById(
        "resultadoBerg"
    );

    resultado.innerHTML = `

        <h2>
            Escala Berg Estimada
        </h2>

        <p>
            Romberg:
            ${berg.pontuacaoRomberg}
        </p>

        <p>
            Unipodal:
            ${berg.pontuacaoUnipodal}
        </p>

        <p>
            Marcha:
            ${berg.pontuacaoMarcha}
        </p>

        <hr>

        <p>
            Total:
            ${berg.total}
        </p>

        <p>
            Risco:
            ${berg.risco}
        </p>

    `;

}
carregarBerg();
