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

let tempoUnipodal = 0;

let iniciouUnipodal = false;

let inicioUnipodal = 0;

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

let tipoExercicio =
parametros.get(
    "tipo"
);

if(!tipoExercicio){

    tipoExercicio =
    "romberg";

}
console.log(
    "Tipo:",
    tipoExercicio
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

function analisarRomberg(
    pontos
){

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

}

function analisarUnipodal(
    pontos
){

    const tornozeloEsquerdo =
    pontos[27];

    const tornozeloDireito =
    pontos[28];

    const diferenca =
    Math.abs(
        tornozeloEsquerdo.y -
        tornozeloDireito.y
    );

    if(diferenca > 0.10){

        if(!iniciouUnipodal){

            iniciouUnipodal =
            true;

            inicioUnipodal =
            performance.now();

        }

    }
    else{

        if(iniciouUnipodal){

            tempoUnipodal =
            (
                performance.now() -
                inicioUnipodal
            ) / 1000;

            iniciouUnipodal =
            false;

        }

    }

}

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

    tempoUnipodal = 0;

iniciouUnipodal = false;

inicioUnipodal = 0;


    function frame(){

        if(video.ended)
            
            {console.log("VIDEO TERMINOU");

    if(
        tipoExercicio ===
        "romberg"
    ){

        calcularOscilacao();

    }
   else if(
    tipoExercicio ===
    "unipodal"
){

    if(iniciouUnipodal){

        tempoUnipodal =
        (
            performance.now() -
            inicioUnipodal
        ) / 1000;

        iniciouUnipodal =
        false;

    }

    salvarResultadoUnipodal();

mostrarResultadoUnipodal();

}

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

 if(
    tipoExercicio ===
    "romberg"
){

    analisarRomberg(
        pontos
    );

}
else if(
    tipoExercicio ===
    "unipodal"
){

    analisarUnipodal(
        pontos
    );

}

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

async function calcularOscilacao(){

    console.log("CALCULANDO OSCILACAO");

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

    tempoUnipodal,

    dataAnalise:
    new Date()
}

);

console.log(
    "MOSTRANDO RESULTADO"
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
            Tempo Unipodal:
            ${tempoUnipodal.toFixed(1)} segundos
        </p>

        <p>
            Classificação:
            ${classificacao}
        </p>

    `;

}
function mostrarResultadoUnipodal(){

    const resultado =
    document.getElementById(
        "resultado"
    );

    let classificacao = "";

    if(tempoUnipodal >= 20){

        classificacao =
        "Excelente";

    }
    else if(tempoUnipodal >= 10){

        classificacao =
        "Boa";

    }
    else if(tempoUnipodal >= 5){

        classificacao =
        "Regular";

    }
    else{

        classificacao =
        "Instável";

    }

    resultado.innerHTML = `

        <h2>
            Resultado Unipodal
        </h2>

        <p>
            Tempo:
            ${tempoUnipodal.toFixed(1)}
            segundos
        </p>

        <p>
            Classificação:
            ${classificacao}
        </p>

    `;

}
async function salvarResultadoUnipodal(){

    let classificacao = "";

    if(tempoUnipodal >= 20){

        classificacao =
        "Excelente";

    }
    else if(tempoUnipodal >= 10){

        classificacao =
        "Boa";

    }
    else if(tempoUnipodal >= 5){

        classificacao =
        "Regular";

    }
    else{

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
            "unipodal",

            tempoUnipodal,

            classificacao,

            dataAnalise:
            new Date()
        }
    );

}