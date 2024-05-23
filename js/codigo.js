
const INITIAL_WORDS = [
    "a","de nuevo","todo","también","y","otro","cualquier","alrededor","como",
    "preguntar","en","atrás","porque","convertirse","antes","comenzar","ambos","pero",
    "por","llamar","puede","cambiar","niño","venir","podría","curso","día",
    "desarrollar","cada","temprano","fin","incluso","ojo","cara","hecho","pocos","primero","seguir",
    "de","general","obtener","dar","bueno","gobernar","grupo","mano",
    "tener","él","cabeza","ayudar","aquí","alto","sujetar","casa","cómo","sin embargo",
    "si","incrementar","interés","eso","saber","grande","último","liderar","salir","vida","gustar","línea","pequeño",
    "mirar","hacer","hombre","puede que","significar","podría","más","debe","necesitar",
    "nunca","nuevo","no","ahora","número","de","fuera","viejo","en","uno","abrir","o","ordenar","fuera","sobre",
    "propio","parte","gente","persona","lugar","plan","jugar","punto","posible","presente","problema",
    "programa","público","real","derecho","correr","decir","ver","parecer","mostrar","pequeño","alguno",
    "pararse","estado","aún","tal","sistema","tomar","que","eso","el","entonces","ahí","estos","ellos","cosa","pensar",
    "esto","esos","tiempo","a","bajo","arriba","usar","muy","camino","qué","cuando","dónde","mientras",
    "hará","con","sin","trabajar","mundo","haría","escribir","tú","ella","establecer","nosotros","largo","en",
    "muchos","hacer","después","cuál","así","mismo","otro","casa","durante","mucho","solo","considerar","desde","debería","solo","decir","acerca de"
];

const tiempo = document.getElementById('tiempo');
const parrafo = document.getElementById('parrafo');
const input = document.getElementById('input-parrafo');
const mensaje = document.getElementById('mensaje');

const wpm = document.getElementById('h3-wpm');
const accuracy = document.getElementById('h3-accuracy');

const type = document.getElementById('type');
const resultados = document.getElementById('resultados');
const reset = document.getElementById('button-reset');


const INITIAL_TIME = 60; 
let palabras = [];
let currentTime;


document.addEventListener('DOMContentLoaded', function() {
    initGame();
    initEvents();

})

function recargarPagina() {
    location.reload();
    
}

function initGame() {
    type.style.display = 'flex';
    resultados.style.display = 'none';
    input.value = '';

    palabras = INITIAL_WORDS.toSorted(
        () => Math.random() - 0.5
    ).slice(0, 40);
        currentTime = INITIAL_TIME
        tiempo.textContent = currentTime
        parrafo.innerHTML = palabras.map((palabra, index) => {
        const letras = palabra.split('')
        return `<x-palabra>
        ${letras
            .map(letra=> `<x-letra>${letra}</x-letra>`)
            .join('')
        }
        </x-palabra>
        `
    }).join('')
    
    const primeraPalabra = parrafo.querySelector('x-palabra');
    primeraPalabra.classList.add('active');
    primeraPalabra.querySelector('x-letra').classList.add('active');
    const intervaloValid = setInterval(()=>{
        currentTime--
        tiempo.textContent = currentTime;
        if(currentTime === 0){
            clearInterval(intervaloValid)
            finishgame()
        }
    },1000)
}

function finishgame(){
    type.style.display = 'none';
    resultados.style.display = 'flex';
    
    const palabrasCorrectas = parrafo.querySelectorAll('x-palabra.correcto').length;
    const letrasCorrectas = parrafo.querySelectorAll('x-letra.correcto').length;
    const letrasIncorrectas = parrafo.querySelectorAll('x-letra.incorrecto').length;

    const letrasTotales = letrasCorrectas + letrasIncorrectas;
    console.log(letrasTotales)
    const accuracyres = letrasTotales > 0
        ? (letrasCorrectas / letrasTotales) * 100
        : 0

    const wpmres = palabrasCorrectas * 60 / INITIAL_TIME;
    wpm.textContent = wpmres
    accuracy.textContent = `${accuracyres.toFixed(2)}%`
    
}

function initEvents(){

    input.addEventListener('keydown', onkeydown);
    input.addEventListener('keyup',onkeyup);
    reset.addEventListener('click',initGame)

    input.addEventListener('focus', quitarBorrosoYMensaje);
    input.addEventListener('blur', ponerBorrosoYMostrarMensaje);
}

function onkeydown(event){
    const $palabraActual = parrafo.querySelector('x-palabra.active');
    const $letraActual = $palabraActual.querySelector('x-letra.active');

    const {key} = event;
    console.log({key});
    if(key === ' '){
        event.preventDefault();

        const $siguientePalabra = $palabraActual.nextElementSibling;
        const $siguienteLetra = $siguientePalabra.querySelector('x-letra');
        
        $palabraActual.classList.remove('active');
        $letraActual.classList.remove('active');
        
        $siguientePalabra.classList.add('active');
        $siguienteLetra.classList.add('active');

        input.value = ''; 

        const hasMissedLetters = $palabraActual
        .querySelectorAll('x-letra:not(.correcto)').length > 0;

        const classToAdd = hasMissedLetters ? 'marked' : 'correcto';
        $palabraActual.classList.add(classToAdd);
        return
    }

    if(key === 'Backspace'){
        const $palabraAnterior = $palabraActual.previousElementSibling
        const $letraAnterior = $letraActual.previousElementSibling

        if(!$palabraAnterior && !$letraAnterior){
            event.preventDefault();
            return
        }
        
        const $palabraMarcada = parrafo.querySelector('x-palabra.marked');

        if ($palabraMarcada && !$letraAnterior) {
            event.preventDefault();
            $palabraAnterior.classList.remove('marked');
            $palabraAnterior.classList.add('active');
    
            const $letterToGo = $palabraAnterior.querySelector('x-letra:last-child');
    
            $letraActual.classList.remove('active');
            $letterToGo.classList.add('active');
    
            input.value = [
                ...$palabraAnterior.querySelectorAll('x-letra.correcto, x-letra.incorrecto')
            ].map($el => {
                return $el.classList.contains('correcto') ? $el.innerText : '*'
            }).join('');
        }
    }

}
function onkeyup(){

    const $palabraActual = parrafo.querySelector('x-palabra.active');
    const $letraActual = $palabraActual.querySelector('x-letra.active');

    const palabraActual = $palabraActual.innerText.trim();
    input.maxLength = palabraActual.length; 
    console.log({value: input.value,palabraActual})

    const $todasLasLetras = $palabraActual.querySelectorAll('x-letra');
    $todasLasLetras.forEach($letra => $letra.classList.remove('correcto','incorrecto')); 

    input.value.split('').forEach((char,index) => {
        const $letra = $todasLasLetras[index];
        const letraCheck = palabraActual[index];

        const letraVerificada = char === letraCheck
        const letraClass = letraVerificada ? 'correcto' : 'incorrecto';
        $letra.classList.add(letraClass);
    });

    $letraActual.classList.remove('active', 'is-last')
    const inputLength = input.value.length;
    const $siguienteLetraActiva = $todasLasLetras[inputLength];

    if ($siguienteLetraActiva) {
        $siguienteLetraActiva.classList.add('active')
    } else {
        $letraActual.classList.add('active', 'is-last')
    }

}

function devolverFocus() {
    if (input) {
        input.focus();
    }
}

function quitarBorrosoYMensaje() {
    parrafo.style.filter = 'none'; 
    mensaje.style.display = 'none'; 
}

function ponerBorrosoYMostrarMensaje() {
    parrafo.style.filter = 'blur(2px)';
    mensaje.style.display = 'block';

}




