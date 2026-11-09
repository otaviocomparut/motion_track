import { db } from "./firebase.js";

import {
    collection,
    addDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    FilesetResolver,
    PoseLandmarker
}
from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";

const video =
document.getElementById(
    "video"
);

const canvas =
document.getElementById(
    "canvas"
);

const ctx =
canvas.getContext(
    "2d"
);

let centrosX = [];


// =====================================
// RECEBER URL DO VIDEO
// =====================================

const parametros =
new URLSearchParams(
    window.location.search
);

const urlVideo =
parametros.get(
    "video"
);

if(!urlVideo){

    alert(
        "Vídeo não informado."
    );

    throw new Error(
        "Vídeo não informado."
    );

}

video.crossOrigin =
"anonymous";

video.src =
urlVideo;


// =====================================
// MEDIAPIPE
// =====================================

const vision =
await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
);

const poseLandmarker =
await PoseLandmarker.createFromOptions(
    vision,
    {
        baseOptions:{
            modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task"
        },

        runningMode:
        "VIDEO",

        numPoses:
        1
    }
);


// =====================================
// ANALISAR VIDEO
// =====================================

video.addEventListener(
    "play",
    analisar
);

async function analisar(){

    canvas.width =
    video.videoWidth;

    canvas.height =
    video.videoHeight;

    centrosX = [];

    function frame(){

        if(video.ended){

            calcularOscilacao();

            return;

        }

        if(video.paused){

            requestAnimationFrame(
                frame
            );

            return;

        }

        const resultado =
        poseLandmarker.detectForVideo(
            video,
            performance.now()
        );

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        if(
            resultado.landmarks.length
        ){

            const pontos =
            resultado.landmarks[0];

            const quadrilEsquerdo =
            pontos[23];

            const quadrilDireito =
            pontos[24];

            const centroX =
            (
                quadrilEsquerdo.x +
                quadrilDireito.x
            ) / 2;

            centrosX.push(
                centroX
            );

            pontos.forEach(
                (ponto)=>{

                    ctx.beginPath();

                    ctx.arc(
                        ponto.x * canvas.width,
                        ponto.y * canvas.height,
                        4,
                        0,
                        Math.PI * 2
                    );

                    ctx.fillStyle =
                    "red";

                    ctx.fill();

                }
            );

        }

        requestAnimationFrame(
            frame
        );

    }

    frame();

}


// =====================================
// ROMBERG
// =====================================

async function calcularOscilacao(){

    const maior =
    Math.max(
        ...centrosX
    );

    const menor =
    Math.min(
        ...centrosX
    );

    const oscilacao =
    maior - menor;

    let pontuacao =
    0;

    let classificacao =
    "";

    if(oscilacao <= 0.03){

        pontuacao = 95;
        classificacao =
        "Excelente";

    }
    else if(
        oscilacao <= 0.07
    ){

        pontuacao = 80;
        classificacao =
        "Boa";

    }
    else if(
        oscilacao <= 0.12
    ){

        pontuacao = 60;
        classificacao =
        "Regular";

    }
    else{

        pontuacao = 40;
        classificacao =
        "Instável";

    }

await addDoc(
    collection(
        db,
        "resultados"
    ),
    {
        exercicio:
        "romberg",

        oscilacao,

        pontuacao,

        classificacao,

        dataAnalise:
        new Date()
    }
);

    mostrarResultado(
        oscilacao,
        pontuacao,
        classificacao
    );

}


// =====================================
// EXIBIR RESULTADO
// =====================================

function mostrarResultado(
    oscilacao,
    pontuacao,
    classificacao
){

    const resultado =
    document.getElementById(
        "resultado"
    );

    resultado.innerHTML = `

        <h2>
            Resultado Romberg
        </h2>

        <p>
            Oscilação:
            ${oscilacao.toFixed(4)}
        </p>

        <p>
            Pontuação:
            ${pontuacao}/100
        </p>

        <p>
            Classificação:
            ${classificacao}
        </p>

    `;

}