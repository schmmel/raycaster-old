const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

window.onresize = () => {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
};

// player position
let playerX = 2;
let playerY = 2;
let playerAngle = 45;
let playerSpeed = 0.15;
let playerRotationSpeed = 3;

const playerFov = canvas.width / 18;

const screenScale = 1;

let projectionWidth = canvas.width / screenScale;
let projectionHeight = canvas.height / screenScale;

const rayPrecision = 64;
const rayIncrement = playerFov / projectionWidth;

ctx.scale(screenScale, screenScale);
ctx.translate(0.5, 0.5);

// 1 = cyan wall, 2 = red wall
const map = [
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,2,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1]
];

const roofColor = "blueviolet";
const floorColor = "darkblue";

function degToRad(deg) {
    return deg * Math.PI / 180;
}

function drawLine(x1, y1, x2, y2, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawTexture(x, wallHeight, texturePosX, texture, textureColors) {
    let yIncrement = (wallHeight * 2 )/ texture.height;
    let y = (projectionHeight / 2) - wallHeight;

    for (let i = 0; i < texture.height; i++) {
        ctx.strokeStyle = textureColors[texture.bitmap[i][texturePosX]];
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + yIncrement + 0.5);
        ctx.stroke();
        y += yIncrement;
    }
}

function raycast() {
    let angle = playerAngle - playerFov / 2;

    for (let i = 0; i < projectionWidth; i++) {
        
        // rays start at player position
        let rayX = playerX;
        let rayY = playerY;

        // they told me i'd never use trigonometry in real life
        // calculate the angle of the ray
        let rayCos = Math.cos(degToRad(angle)) / rayPrecision;
        let raySin = Math.sin(degToRad(angle)) / rayPrecision;

        // ray keeps going until it hits a wall
        let wall = 0;
        while (wall === 0) {
            rayX += rayCos;
            rayY += raySin;

            // wall = the location of the ray in the map array, if it's not 0 it's a wall
            wall = map[Math.floor(rayY)][Math.floor(rayX)];
        };

        // that one theory from that one guy
        let distance = Math.sqrt(Math.pow(playerX - rayX, 2) + Math.pow(playerY - rayY, 2));

        // fish-eye correction
        distance = distance * Math.cos(degToRad(angle - playerAngle));

        // the further the wall the shorter it is
        let wallHeight = Math.floor((projectionHeight / 2) / distance);

        // wall color and texture
        switch (wall) {
            case 1:
                texture = textures[0];
                textureColors = ["cyan", "red"];
                break;
            case 2:
                texture = textures[0];
                textureColors = ["red", "cyan"];
                break;  
        }

        let texturePosX = Math.floor((texture.width * (rayX + rayY)) % texture.width);
        
        drawLine(i, 0, i, (projectionHeight / 2) - wallHeight, roofColor);
        drawTexture(i, wallHeight, texturePosX, texture, textureColors);
        drawLine(i, (projectionHeight / 2) + wallHeight, i, projectionHeight, floorColor)


        angle += rayIncrement;
    }
};

function draw() {
    setInterval(() => {
        // clear canvas
        ctx.clearRect(0, 0, projectionWidth, projectionWidth);

        // move player
        movePlayer();
        
        // do the magic
        raycast();

    }, 1000 / 30);


    // gotta rewrite this so it uses requestAnimationFrame
    // requestAnimationFrame(draw);
}

draw();

// player movement
let keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function movePlayer() {
    if (keys["w"] || keys["ArrowUp"]) {
        let playerCos = Math.cos(degToRad(playerAngle)) * playerSpeed;
        let playerSin = Math.sin(degToRad(playerAngle)) * playerSpeed;
        let newPlayerX = playerX + playerCos;
        let newPlayerY = playerY + playerSin;

        if (map[Math.round(newPlayerY)][Math.floor(newPlayerX)] === 0) {
            playerX = newPlayerX;
            playerY = newPlayerY;
        }
    }

    if (keys["s"] || keys["ArrowDown"]) {
        let playerCos = Math.cos(degToRad(playerAngle)) * playerSpeed;
        let playerSin = Math.sin(degToRad(playerAngle)) * playerSpeed;
        let newPlayerX = playerX - playerCos;
        let newPlayerY = playerY - playerSin;

        if (map[Math.floor(newPlayerY)][Math.floor(newPlayerX)] === 0) {
            playerX = newPlayerX;
            playerY = newPlayerY;
        }
    }

    if (keys["a"] || keys["ArrowLeft"]) {
        playerAngle -= playerRotationSpeed;
        playerAngle %= 360;
    }

    if (keys["d"] || keys["ArrowRight"]) {
        playerAngle += playerRotationSpeed;
        playerAngle %= 360;
    }
}