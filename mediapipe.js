import {
    PoseLandmarker,
    FilesetResolver
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

const stream =
await navigator.mediaDevices.getUserMedia({
    video:true
});

video.srcObject =
stream;

video.addEventListener(
"loadeddata",
detectar
);

async function detectar(){

    canvas.width =
    video.videoWidth;

    canvas.height =
    video.videoHeight;

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

        resultado.landmarks[0]
        .forEach((ponto)=>{

            ctx.beginPath();

            ctx.arc(
                ponto.x * canvas.width,
                ponto.y * canvas.height,
                5,
                0,
                Math.PI*2
            );

            ctx.fillStyle =
            "red";

            ctx.fill();

        });

    }

    requestAnimationFrame(
        detectar
    );

}