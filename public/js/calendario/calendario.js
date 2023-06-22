const dataAtual = new Date()
const dia = dataAtual.getDate()
const mes = dataAtual.getMonth() +1
const ano = dataAtual.getFullYear();

const dataCompleta = `${ano}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;

const primeiraData = document.getElementById('primeiraData')
const segundaData = document.getElementById('segundaData')

primeiraData.value = dataCompleta
primeiraData.min = dataCompleta
segundaData.min = dataCompleta
