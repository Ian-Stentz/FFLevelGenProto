//canvas dim
let cw = 600, ch = 600
//grid variables
let gx = 20, gy = 20, cs = 20, rws = 28, cms = 28;

// initialize points
let points = [];
for (let n = 0; n < 10; n++) {
  let i = Math.floor(Math.random() * cms) + 1;
  let j = Math.floor(Math.random() * rws) + 1;
  points.push([i,j]);
}

console.log(points);

function setup() {
  createCanvas(cw, ch);
}

//draws a grid with upper left corner at (startx,starty) with a cell size of cell and with "rows" amount of rows and "columns" amount of columns
function drawGrid(startx, starty, cell, rows, columns) {
  let xf = startx + cell * rows;
  let yf = starty + cell * rows;
  for (let i = 0; i <= rows; i++) {
    let nx = startx + cell * i;
    line(nx, starty, nx, yf);
  }
  for (let j = 0; j <= columns; j++) {
    let ny = starty + cell * j;
    line(startx, ny, xf, ny);
  }
}

//draws a point (small circle) at indicated location
function drawPoint(x, y) {
  fill("black");
  circle(x, y, 7);
}

//converts a grid tile to canvas space
function tileToLoc(i, j) {
  return [x, y] = [gx + cs * i - cs / 2, gy + cs * (rws - j + 1) - cs / 2];
}

function draw() {
  background(220);
  drawGrid(gx, gy, cs, rws, cms);
  for (let point of points) {
    console.log(point);
    let [xi, yi] = tileToLoc(point[0], point[1])
    drawPoint(xi ,yi);
  }
}