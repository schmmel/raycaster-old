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
let playerSpeed = 0.5;
let playerRotationSpeed = 3;

const playerFov = canvas.width / 18;
// const playerFov = 60;

const rayPrecision = 64;
const rayIncrement = playerFov / canvas.width;

const map = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,2,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1]
];


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

function raycast() {
    let angle = playerAngle - playerFov / 2;

    for (let i = 0; i < canvas.width; i++) {
        
        // rays start at player position
        let rayX = playerX;
        let rayY = playerY;

        // they told me i'd never use trigonometry in real life
        let rayCos = Math.cos(degToRad(angle)) / rayPrecision;
        let raySin = Math.sin(degToRad(angle)) / rayPrecision;

        let wall = 0;
        while (wall === 0) {
            rayX += rayCos;
            rayY += raySin;

            wall = map[Math.floor(rayY)][Math.floor(rayX)];

        };

        switch (wall) {
            case 1:
                wallColor = "cyan";
                break;
            case 2:
                wallColor = "red";
                break;
        }

        // that one theory from that one guy
        let distance = Math.sqrt(Math.pow(playerX - rayX, 2) + Math.pow(playerY - rayY, 2));

        // fish-eye correction
        distance = distance * Math.cos(degToRad(angle - playerAngle));

        let wallHeight = Math.floor((canvas.height / 2) / distance);
        
        drawLine(i, 0, i, (canvas.height / 2) - wallHeight, "blueviolet");
        drawLine(i, (canvas.height / 2) - wallHeight, i, (canvas.height / 2) + wallHeight, wallColor);
        drawLine(i, (canvas.height / 2) + wallHeight, i, canvas.height, "darkblue")


        angle += rayIncrement;
    }
};

function draw() {
    setInterval(() => {
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // do the magic
        raycast();

    }, 1000 / 30);


    // gotta rewrite this so it uses requestAnimationFrame
    // requestAnimationFrame(draw);
}

draw();

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        // forward
        case "w":
        case "ArrowUp":
            let playerCos = Math.cos(degToRad(playerAngle)) * playerSpeed;
            let playerSin = Math.sin(degToRad(playerAngle)) * playerSpeed;
            playerX += playerCos;
            playerY += playerSin;
            break;
        // back
        case "s":
        case "ArrowDown":
            let playerCos2 = Math.cos(degToRad(playerAngle)) * playerSpeed;
            let playerSin2 = Math.sin(degToRad(playerAngle)) * playerSpeed;
            playerX -= playerCos2;
            playerY -= playerSin2;
            break;
        // rotate left
        case "a":
        case "ArrowLeft":
            playerAngle -= playerRotationSpeed;
            break;
        // rotate right
        case "d":
        case "ArrowRight":
            playerAngle += playerRotationSpeed;
            break;
    }
});