// La fecha de estreno de Avengers: Doomsday es el 18 de diciembre de 2026.
// Le he puesto una hora de estreno (19:00) para que puedas ver las horas en el contador.
const releaseDate = new Date('December 18, 2026 19:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = releaseDate - now;

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = "<h2>¡La película ya se estrenó!</h2>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}

// Actualizar el contador cada segundo
setInterval(updateCountdown, 1000);

// Llamada inicial para evitar el retraso de 1 segundo
updateCountdown();
