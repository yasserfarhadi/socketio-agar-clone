// this is where all our socket stuff will go
const io = require('../servers').io;
const app = require('../servers').app;
const checkForOrbCollisions =
  require('./checkCollisions').checkForOrbCollisions;
const checkForPlayerCollisions =
  require('./checkCollisions').checkForPlayerCollisions;

const Orb = require('./classes/Orb');
// make an orbs array that will host all 500/5000 non player orbs
// every time one is obsorbs, server will make a new one
// on server start, to make our 500 initial

const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');

const orbs = [];
const settings = {
  defaultNmuberOfOrbs: 5000,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5, // as the player gets bigger, zoom needs to go out
  worldWidth: 5000,
  worldHeight: 5000,
  defaultGenericOrbSize: 5,
};

const players = [];
const playersForUsers = [];
let tickTockInterval;

// loop defaultNmuberOfOrbs times and push a new Orb into our array
initGame();

function initGame() {
  for (let i = 0; i < settings.defaultNmuberOfOrbs; i++) {
    orbs.push(new Orb(settings));
  }
  // orbs = Array(500).fill(new Orb());
  // console.log(orbs);
}

io.of('/').on('connect', (socket) => {
  // make a player config object - data specific to this player that only the player needs to know
  // make a player data object - data specific to this player that everyone needs to know
  // a master player object to house both
  let player = {};
  socket.on('init', (playerObj, cb) => {
    // someone is about to be added to players. start tick-tocking
    if (players.length === 0) {
      // tick-tock - issue an event to EVERY connected socket, that is playing the game, 30 times in a second.

      tickTockInterval = setInterval(() => {
        io.of('/').to('game').emit('tick', playersForUsers); // send the event o the "game" room
      }, 33);
    }

    socket.join('game'); // ad d this sicket to game room
    const playerConfig = new PlayerConfig(settings);
    const playerData = new PlayerData(playerObj.playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);
    players.push(player); // server use only
    playersForUsers.push({ playerData });
    cb({ orbs, indexInPlayers: playersForUsers.length - 1 }); // sends the orbs array back as an ack function
    // socket.emit('initReturn', { orbs });
  });

  socket.on('tock', (data) => {
    // a tock has coming before the player is setup
    // this is because the client kept tocking after disconnect
    if (!player.playerConfig) {
      return;
    }
    const speed = player.playerConfig.speed;
    const xV = (player.playerConfig.xVector = data.xVector);
    const yV = (player.playerConfig.yVector = data.yVector);

    if (
      (player.playerData.locX > 5 && xV < 0) ||
      (player.playerData.locX < settings.worldWidth && xV > 0)
    ) {
      player.playerData.locX += speed * xV;
    }
    if (
      (player.playerData.locY > 5 && yV > 0) ||
      (player.playerData.locY < settings.worldHeight && yV < 0)
    ) {
      player.playerData.locY -= speed * yV;
    }

    // check for the tocking player to hit orbs
    // function returns null of no collitions, an index of there is collisions
    const capturedOrbI = checkForOrbCollisions(
      player.playerData,
      player.playerConfig,
      orbs,
      settings
    );
    if (capturedOrbI != null) {
      // index could be zero
      // remove the orb that needs to be replaced (at capturedOrbI)
      // add a new orb
      orbs.splice(capturedOrbI, 1, new Orb(settings));

      // now update the clients with new orbs
      const orbData = {
        capturedOrbI,
        newOrb: orbs[capturedOrbI],
      };

      // emit to all sockets playing the game, the orbSwitch event so it can update orbs
      // just the new orbs
      io.of('/').to('game').emit('orbSwith', orbData);
      io.to('game').emit('updateLeaderBoard', getLeaderBoard());
    }

    // check for the tocking player to hit orbs
    const absorbData = checkForPlayerCollisions(
      player.playerData,
      player.playerConfig,
      players,
      playersForUsers,
      socket.id
    );
    if (absorbData) {
      io.to('game').emit('playerAbsorbed', absorbData);
      io.to('game').emit('updateLeaderBoard', getLeaderBoard());
    }
  });
  socket.on('disconnect', (reason) => {
    // console.log(reason);
    for (let i = 0; i < players.length; i++) {
      if (players[i].socketId === player.socketId) {
        players.splice(i, 1, {});
        playersForUsers.splice(i, 1, {});
        break;
      }
    }
    if (players.legnth === 0) {
      clearInterval(tickTockInterval);
    }
  });
});

function getLeaderBoard() {
  const leaderBoardArray = players.map((p) => {
    if (p.playerData) {
      return {
        name: p.playerData.name,
        score: p.playerData.score,
      };
    } else {
      return {};
    }
  });
  return leaderBoardArray;
}
