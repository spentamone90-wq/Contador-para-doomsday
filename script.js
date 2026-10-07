// Fecha de estreno oficial de Avengers: Doomsday
const releaseDate = new Date('December 18, 2026 19:00:00').getTime();

// Usamos una fecha pasada como ancla (ej: Octubre 1, 2026) para que haya una progresión de brillo gradual
const startDate = new Date('October 1, 2026 00:00:00').getTime();
const totalDuration = releaseDate - startDate;

function setupBlock(id, numDigits) {
    const container = document.getElementById(id + '-digits');
    if (!container) return [];
    container.innerHTML = '';
    const digits = [];
    for (let i = 0; i < numDigits; i++) {
        const digitDiv = document.createElement('div');
        digitDiv.className = 'digit';
        
        const currSpan = document.createElement('span');
        currSpan.className = 'digit-value curr';
        currSpan.innerText = '0';
        
        const nextSpan = document.createElement('span');
        nextSpan.className = 'digit-value next';
        nextSpan.innerText = '0';
        
        digitDiv.appendChild(currSpan);
        digitDiv.appendChild(nextSpan);
        container.appendChild(digitDiv);
        
        digits.push({
            element: digitDiv,
            curr: currSpan,
            next: nextSpan,
            currentValue: '0'
        });
    }
    return digits;
}

const state = {
    days: [],
    hours: setupBlock('hours', 2),
    minutes: setupBlock('minutes', 2),
    seconds: setupBlock('seconds', 2)
};

let initializedDays = false;
let isFinished = false;

function updateDigit(digitObj, newValue) {
    if (digitObj.currentValue !== newValue) {
        digitObj.next.innerText = newValue;
        digitObj.element.classList.add('flipping');
        
        setTimeout(() => {
            digitObj.curr.innerText = newValue;
            digitObj.element.classList.remove('flipping');
            digitObj.currentValue = newValue;
        }, 850); // Sincronizado con los 0.85s de CSS
    }
}

function updateBlock(digitsArray, newValueStr) {
    for (let i = 0; i < digitsArray.length; i++) {
        if (digitsArray[i]) {
            updateDigit(digitsArray[i], newValueStr[i]);
        }
    }
}

function updateBackground(distance) {
    // Calculamos el progreso (de 0 a 1) basándonos en cuánto falta para el estreno 
    // en relación con la duración total que establecimos como referencia.
    let progress = 1 - (distance / totalDuration);
    
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    // Conforme avanza el tiempo, se vuelve más saturado, brillante y verdoso original.
    // Grayscale: de 60% baja a 0%
    const grayscale = 60 - (progress * 60);
    // Brightness: de 0.3 sube a 1.0
    const brightness = 0.3 + (progress * 0.7);
    // Sepia: de 20 baja a 0%
    const sepia = 20 - (progress * 20);

    const bgLayer = document.querySelector('.bg-layer');
    if (bgLayer) {
        bgLayer.style.filter = `grayscale(${grayscale}%) brightness(${brightness}) contrast(1.2) sepia(${sepia}%) hue-rotate(80deg)`;
    }
}

function updateCountdown() {
    if (isFinished) return;

    const now = new Date().getTime();
    const distance = releaseDate - now;

    updateBackground(distance);

    if (distance <= 0) {
        isFinished = true;
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <header class="header" style="margin-top: 30vh;">
                    <h1 class="movie-title" style="font-size: 5rem; letter-spacing: 15px; margin-right: -15px;">DOOMSDAY LLEGÓ</h1>
                </header>
            `;
        }
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysStr = days.toString().padStart(2, '0');
    
    if (!initializedDays || state.days.length !== daysStr.length) {
        state.days = setupBlock('days', daysStr.length);
        initializedDays = true;
        for (let i = 0; i < state.days.length; i++) {
            state.days[i].currentValue = daysStr[i];
            state.days[i].curr.innerText = daysStr[i];
        }
    } else {
        updateBlock(state.days, daysStr);
    }

    updateBlock(state.hours, hours.toString().padStart(2, '0'));
    updateBlock(state.minutes, minutes.toString().padStart(2, '0'));
    updateBlock(state.seconds, seconds.toString().padStart(2, '0'));
}

// Set initial states
const initialDistance = releaseDate - new Date().getTime();
if (initialDistance >= 0) {
    const hours = Math.floor((initialDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((initialDistance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((initialDistance % (1000 * 60)) / 1000);
    
    const hStr = hours.toString().padStart(2, '0');
    const mStr = minutes.toString().padStart(2, '0');
    const sStr = seconds.toString().padStart(2, '0');
    
    for(let i=0; i<2; i++) {
        state.hours[i].currentValue = hStr[i]; state.hours[i].curr.innerText = hStr[i];
        state.minutes[i].currentValue = mStr[i]; state.minutes[i].curr.innerText = mStr[i];
        state.seconds[i].currentValue = sStr[i]; state.seconds[i].curr.innerText = sStr[i];
    }
} else {
    // Si la fecha ya pasó al recargar
    updateCountdown();
}

updateCountdown();
setInterval(updateCountdown, 1000);
