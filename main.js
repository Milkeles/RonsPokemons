const NUM_BUSHES = 50
const POKEMON_PROBABILITY = 1; //10%
const MAX_CHECKED_BUSHES = 5;


const player = document.querySelector('.player');

const player_pos = {
    x: parseInt(window.innerWidth / 2),
    y: parseInt(window.innerHeight / 2)
}
const player_vel = {
    x: 0,
    y: 0
}

const bushes = []
const lastCheckedBushes = [];
const foundPokemons = [];
const sound = new Audio('assets/coin.mp3')

let canMove = true;

function createBushes() {
    for (let i = 0; i < NUM_BUSHES; i++) {
        generateBush();
    }
}

function generateBush() {
    const div = document.createElement('div');
    div.classList.add('bush');
    let x = Math.random() * 100 + '%';
    let y = Math.random() * 100 + '%';
    div.style.left = x;
    div.style.top = y;
    document.body.appendChild(div);
    bushes.push({
        bush: div,
        pos: { x, y }
    });
}

let pokemonId = null;
let pokemonName = null;

function startBattle() {
    canMove = false;
    const overlay = document.querySelector('.overlay');
    overlay.classList.add('show');

    let promptSquare = document.getElementById('battleWindow');
    promptSquare.style.display = 'block';
    let id = Math.floor(Math.random() * 20) + 1;
    let apiUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
    fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                pokemonImage.src = data.sprites.front_default;
                pokemonId = id;
                pokemonName = data.name;
                promptSquare.style.display = 'block';
            })
            .catch(error => console.error('Error fetching data:', error));

}

function endBattle() {
    let promptSquare = document.getElementById('battleWindow');
    promptSquare.style.display = 'none';
    canMove = true;
    let overlay = document.querySelector('.overlay');
    overlay.classList.remove('show');
}

function processInput() {
    let userInput = document.getElementById('userInput').value;
    if (userInput.toLowerCase() == pokemonName) {
        foundPokemons.push(pokemonId);
        alert("Correct!");
    }
    else {
        alert("Incorrect!")
    }
    endBattle();
}

function collision($div1, $div2) {
    var x1 = $div1.getBoundingClientRect().left;
    var y1 = $div1.getBoundingClientRect().top;
    var h1 = $div1.clientHeight;
    var w1 = $div1.clientWidth;
    var b1 = y1 + h1;
    var r1 = x1 + w1;

    var x2 = $div2.getBoundingClientRect().left;
    var y2 = $div2.getBoundingClientRect().top;
    var h2 = $div2.clientHeight;
    var w2 = $div2.clientWidth;
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
}

function checkCollisions() {
    bushes.forEach(bush => {
        if (!lastCheckedBushes.includes(bush) && collision(bush.bush, player)) {
            console.log("Collision");

            // Mark the bush as collided
            lastCheckedBushes.push(bush);
            if (lastCheckedBushes.length > MAX_CHECKED_BUSHES) {
                lastCheckedBushes.shift();
            }

            let hasPokemon = Math.random();
            if (hasPokemon <= POKEMON_PROBABILITY) {
                console.log("Has pokemon");
                sound.play();
                startBattle();
            }
        }
    });
}

function run() {
    player_pos.x += player_vel.x
    player_pos.y += player_vel.y

    if (player_pos.x < 0) {
        player_pos.x = 0;
    } else if (player_pos.x > window.innerWidth - player.offsetWidth) {
        player_pos.x = window.innerWidth - player.offsetWidth;
    }

    if (player_pos.y < 0) {
        player_pos.y = 0;
    } else if (player_pos.y > window.innerHeight - player.offsetHeight) {
        player_pos.y = window.innerHeight - player.offsetHeight;
    }

    player.style.left = player_pos.x + 'px'
    player.style.bottom = player_pos.y + 'px'

    checkCollisions()
    
    requestAnimationFrame(run)
}

function init() {
    createBushes()
    run()
}

init()

window.addEventListener('keydown', function (e) {
    if (canMove) {
        if (e.key == "ArrowUp") {
            player_vel.y = 3
            player.style.backgroundImage = 'url("assets/player_front.png")'
        }
        if (e.key == "ArrowDown") {
            player_vel.y = -3
            player.style.backgroundImage = 'url("assets/player_back.png")'
        }
        if (e.key == "ArrowLeft") {
            player_vel.x = -3
            player.style.backgroundImage = 'url("assets/player_left.png")'
        }
        if (e.key == "ArrowRight") {
            player_vel.x = 3
            player.style.backgroundImage = 'url("assets/player_right.png")'
        }
    }
    player.classList.add('active')
})
window.addEventListener('keyup', function () {
    player_vel.x = 0
    player_vel.y = 0
    player.classList.remove('active')
})
