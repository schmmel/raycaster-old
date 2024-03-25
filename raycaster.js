const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

window.onresize = () => {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
};

const playerX = 2;
const playerY = 2;
const playerAngle = 45;

const playerFov = canvas.width / 20;
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