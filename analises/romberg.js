export function analisarRomberg(
    pontos,
    centrosX
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

export function calcularResultadoRomberg(
    centrosX
){

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

    let pontuacao = 0;
    let classificacao = "";

    if(oscilacao <= 0.03){

        pontuacao = 95;
        classificacao =
        "Excelente";

    }
    else if(oscilacao <= 0.07){

        pontuacao = 80;
        classificacao =
        "Boa";

    }
    else if(oscilacao <= 0.12){

        pontuacao = 60;
        classificacao =
        "Regular";

    }
    else{

        pontuacao = 40;
        classificacao =
        "Instável";

    }

    return {

        oscilacao,
        pontuacao,
        classificacao

    };

}