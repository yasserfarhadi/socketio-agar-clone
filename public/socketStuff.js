// connect to the socket server
const socket = io.connect('http://localhost:9000');

const init = async () => {
  const data = await socket.emitWithAck('init', { playerName: player.name });
  // out await has resolved, so start 'tocking'
  setInterval(() => {
    socket.emit('tock', {
      xVector: player.xVector ? player.xVector : 0.1,
      yVector: player.yVector ? player.yVector : 0.1,
    });
  }, 33);
  player.indexInPlayers = data.indexInPlayers;
  orbs = data.orbs;
  // init is calles inside of start-game click listener
  draw();
};

socket.on('tick', (playersArray) => {
  players = playersArray;
  if (players[player.indexInPlayers].playerData) {
    player.locX = players[player.indexInPlayers].playerData.locX;
    player.locY = players[player.indexInPlayers].playerData.locY;
  }
});

socket.on('orbSwith', (orbData) => {
  // the server just told us that an orb absorbed, replace it with new one
  orbs.splice(orbData.capturedOrbI, 1, orbData.newOrb);
});

socket.on('playerAbsorbed', (absorbedData) => {
  console.log(absorbedData);
  const messageEl = document.querySelector('#game-message');
  messageEl.innerHTML = `
    ${absorbedData.absorbed} was absorbed by ${absorbedData.absorbedBy}
  `;
  messageEl.style.opacity = 1;
  setTimeout(() => {
    messageEl.style.opacity = 0;
  }, 2000);
});

socket.on('updateLeaderBoard', (leaderBoardArray) => {
  const lb = document.querySelector('.leader-board');
  lb.innerHTML = '';
  leaderBoardArray
    .sort((a, b) => b.score - a.score)
    .forEach((p) => {
      if (p.score && p.name)
        lb.innerHTML += `
      <li class="leaderboard-player">${p.name} - ${p.score}</li>
    `;
    });
});
