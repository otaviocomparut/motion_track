export function analisarBerg(
    pontos,
    estado
){

    estado.frames++;

}

export function calcularResultadoBerg(
    estado
){

    let pontuacao =
    Math.min(
        56,
        estado.frames / 10
    );

    return {

        pontuacao:
        Math.round(
            pontuacao
        )

    };

}