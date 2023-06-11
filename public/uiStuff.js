// set height and width of canvas to window
let wHeight = window.innerHeight;
let wWidth = window.innerWidth;

// canvas element need to be in a variable
const canvas = document.querySelector('#the-canvas');
// context is how we draw! we will draw in 2d
const context = canvas.getContext('2d');
// set the canvas height and width to = window height and width
canvas.height = wHeight;
canvas.width = wWidth;

//this will be all things "this" player
const player = {};

let orbs = []; // this is blobal for all non-player orbs
let players = []; // array of all players

// put the modal into variables so we can intract with them
const loginModal = new bootstrap.Modal(document.querySelector('#loginModal'));
const spawnModal = new bootstrap.Modal(document.querySelector('#spawnModal'));

window.addEventListener('load', () => {
  // on page load open the login modal
  loginModal.show();
});

document.querySelector('.name-form').addEventListener('submit', (e) => {
  e.preventDefault();
  player.name = document.querySelector('#name-input').value;
  document.querySelector('.player-name').innerText = player.name;
  loginModal.hide();
  spawnModal.show();
});

document.querySelector('.start-game').addEventListener('click', () => {
  spawnModal.hide();
  const elArray = Array.from(document.querySelectorAll('.hiddenOnStart'));
  elArray.forEach((el) => {
    el.removeAttribute('hidden');
  });
  init();
});
