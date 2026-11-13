export function analisarMarcha(
    pontos,
    estado
){

    const joelhoEsquerdo =
    pontos[25];

    if(

        joelhoEsquerdo.y < 0.55 &&
        !estado.joelhoAlto

    ){

        estado.passos++;

        estado.joelhoAlto =
        true;

    }

    if(

        joelhoEsquerdo.y > 0.65

    ){

        estado.joelhoAlto =
        false;

    }

}

export function calcularResultadoMarcha(
    estado
){

    let classificacao = "";

    if(estado.passos >= 25){

        classificacao =
        "Excelente";

    }
    else if(estado.passos >= 20){

        classificacao =
        "Boa";

    }
    else if(estado.passos >= 10){

        classificacao =
        "Regular";

    }
    else{

        classificacao =
        "Instável";

    }

    return {

        passos:
        estado.passos,

        classificacao

    };

}