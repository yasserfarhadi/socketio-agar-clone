// This is where all the data that everyone needs to know about everyone else
class PlayerData {
  constructor(playerName, settings) {
    this.name = playerName;
    this.locX = Math.floor(settings.worldWidth * Math.random() + 10); // horizontal axis
    this.locY = Math.floor(settings.worldHeight * Math.random() + 10); // vertical axis
    this.radius = settings.defaultSize;
    this.color = this.randomColor();
    this.score = 0;
    this.orbsObsorbed = 0;
    this.playersAbsorbed = 0;
  }

  randomColor() {
    const r = Math.floor(Math.random() * 200 + 50);
    const g = Math.floor(Math.random() * 200 + 50);
    const b = Math.floor(Math.random() * 200 + 50);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

module.exports = PlayerData;
