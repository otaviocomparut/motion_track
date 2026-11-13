export function analisarUnipodal(
    pontos,
    estado
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

        if(!estado.iniciou){

            estado.iniciou =
            true;

            estado.inicio =
            performance.now();

        }

    }
    else{

        if(estado.iniciou){

            estado.tempo =
            (
                performance.now() -
                estado.inicio
            ) / 1000;

            estado.iniciou =
            false;

        }

    }

}

export function calcularResultadoUnipodal(
    estado
){

    let classificacao = "";

    if(estado.tempo >= 20){

        classificacao =
        "Excelente";

    }
    else if(estado.tempo >= 10){

        classificacao =
        "Boa";

    }
    else if(estado.tempo >= 5){

        classificacao =
        "Regular";

    }
    else{

        classificacao =
        "Instável";

    }

    return {

        tempo:
        estado.tempo,

        classificacao

    };

}