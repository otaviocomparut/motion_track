console.log("UPLOAD CARREGADO");

const CLOUD_NAME = "dvp2oqxv";
const UPLOAD_PRESET = "motiontrack_upload";

document.getElementById("btnUpload")
.addEventListener("click", async () => {

    const arquivo =
        document.getElementById("videoFile").files[0];
        console.log("Nome:", arquivo.name);
console.log("Tipo:", arquivo.type);
console.log("Tamanho:", arquivo.size);

    if (!arquivo) {
        alert("Selecione um vídeo");
        return;
    }

    const formData = new FormData();

    formData.append("file", arquivo);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {

        console.log("Enviando...");

        const resposta = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        console.log("Status:", resposta.status);

        const dados = await resposta.json();

        console.log(JSON.stringify(dados, null, 2));

console.log(dados.error);

        if (dados.error) {
            alert("Erro: " + dados.error.message);
            return;
        }

        alert("Upload concluído!");

        document.getElementById("resultado").innerHTML =
            `${dados.secure_url}
                Abrir vídeo enviado
            </a>`;

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Falha na conexão");

    }

}); 