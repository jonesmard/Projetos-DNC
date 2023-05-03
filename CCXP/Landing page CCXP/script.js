const dia = document.getElementById('dia')
const hora = document.getElementById('hora')
const minuto = document.getElementById('minuto')
const segundo = document.getElementById('segundo')

const lancamento = "1 dec 2023"

function countDown (){
    const dataLanc = new Date(lancamento)
    const hoje = new Date()

    const segTotal = (dataLanc - hoje) / 1000;

    const finalDias = Math.floor (segTotal / 60 / 60 / 24);
    const finalHoras = Math.floor(segTotal / 60 / 60) % 24;
    const finalMinutos = Math.floor(segTotal / 60) % 60;
    const finalSegundos = Math.floor( segTotal) % 60;

    dia.innerHTML = `${finalDias}D `
    hora.innerHTML = formatoTemp(`${finalHoras}H`) 
    minuto.innerHTML = formatoTemp (`${finalMinutos}M `) 
    segundo.innerHTML = formatoTemp (`${finalSegundos}S`) 

}

function formatoTemp (tempo){
    return tempo < 10 ? `0${tempo}` : tempo;
}

countDown();
setInterval(countDown, 1000);
