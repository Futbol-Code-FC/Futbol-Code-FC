

const apiKey = 'f4bfa11379msh911f4e258f881fdp1a16a4jsn4d6eb19218f7'; // ← REEMPLAZA con tu API Key real
const apiHost = 'api-football-v1.p.rapidapi.com';

const ligaIDs = {
  PD: 140,     // LaLiga
  PL: 39,      // Premier League
  BRA: 71,     // Brasileirão
  MLS: 253     // MLS
};

const botones = document.querySelectorAll('.league-button');
const contenedor = document.getElementById('lista-partidos');
const titulo = document.querySelector('#calendario h2');

// Función para obtener partidos
async function obtenerPartidos(leagueCode, season) {
  const ligaId = ligaIDs[leagueCode];
  if (!ligaId) return;

  contenedor.innerHTML = '<p>Cargando partidos...</p>';

  try {
    const respuesta = await fetch(
      `https://${apiHost}/v3/fixtures?league=${ligaId}&season=${season}&next=6`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost
        }
      }
    );

    const datos = await respuesta.json();
    contenedor.innerHTML = ''; // Limpiar antes de mostrar

    datos.response.forEach(partido => {
      const fecha = new Date(partido.fixture.date).toLocaleString('es-ES', {
        weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
      });

      const card = document.createElement('article');
      card.className = 'noticia';
      card.innerHTML = `
        <h3>${partido.teams.home.name} vs ${partido.teams.away.name}</h3>
        <p><strong>${fecha}</strong></p>
        <div style="display: flex; justify-content: center; align-items: center; gap: 1rem;">
          <img src="${partido.teams.home.logo}" alt="${partido.teams.home.name}" width="40" />
          <span>vs</span>
          <img src="${partido.teams.away.logo}" alt="${partido.teams.away.name}" width="40" />
        </div>
        <p><strong>Estadio:</strong> ${partido.fixture.venue.name || 'Por confirmar'}</p>
      `;
      contenedor.appendChild(card);
    });
  } catch (error) {
    contenedor.innerHTML = '<p>Error al cargar los partidos.</p>';
    console.error(error);
  }
}

// Activar botón y cargar partidos
botones.forEach(boton => {
  boton.addEventListener('click', () => {
    botones.forEach(b => b.classList.remove('active'));
    boton.classList.add('active');

    const liga = boton.dataset.league;
    const temporada = boton.dataset.season;

    obtenerPartidos(liga, temporada);
    titulo.textContent = `Próximos Partidos - ${boton.textContent}`;
  });
});

// Cargar por defecto: LaLiga
document.querySelector('.league-button.active').click();
