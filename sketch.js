//canvas dim
let cw = 600, ch = 600
//grid variables
let gx = 20, gy = 20, cs = 20, rws = 28, cms = 28;
let minRadius = 3;
let maxRadius = 5;
let ptAmnt = 10;

// initialize points arrays
let points = [];
let colors = [];
//rects defines rects as [Right,Upper,Left,Lower]
let rects = [];
let ptvel = [];
let ptacc = [];

// initialize action queue

function dist2(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

//populate points array
for (let n = 0; n < ptAmnt; n++) {
  let i = Math.floor(Math.random() * cms);
  let j = Math.floor(Math.random() * rws);
  for (let k = 0; k < 5; k++) {
    for (let point of points) {
      let ii = point[0];
      let jj = point[1];
      if(dist2(i, j, ii, jj) <= minRadius) {
        i = Math.floor(Math.random() * cms);
        j = Math.floor(Math.random() * rws);
        break;
      }
    }
  }
  points.push([i,j]);
}

//colors!
for (let n = 0; n < ptAmnt; n++) {
  let r = Math.random() * 256;
  let g = Math.random() * 256;
  let b = Math.random() * 256;
  while(Math.sqrt(r ** 2 + g ** 2 + b ** 2) > 192) {
    console.log("regenerated")
    r = Math.random() * 256;
    g = Math.random() * 256;
    b = Math.random() * 256;
  }
  colors.push([r,g,b]);
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
function drawPoint(x, y, i = -1) {
  if(i == -1) {
    stroke("black");
    fill("black");
  } else {
    [r, g, b] = colors[i];
    stroke(r, g, b);
    fill(r, g, b);
  }
  circle(x, y, 7);
}

// function drawRandColorRect(x1, y1, x2, y2) {
//   noFill();
//   let r = Math.random() * 256;
//   let g = Math.random() * 256;
//   let b = Math.random() * 256;
//   stroke(r, g, b);
//   rect(x1, y1, x2-x1, y2-y1);
// }

function drawRects() {
  noFill();
  for (let i = 0; i < ptAmnt; i++) {
    [r, g, b] = colors[i];
    stroke(r, g, b);
    let pt = points[i];
    let rect = rects[i];
    let xr = pt[0] + rect[0];
    let yu = pt[1] - rect[1];
    let xl = pt[0] - rect[2];
    let yd = pt[1] + rect[3];
    let [l, u] = tileToLoc(xl, yu)
    let [r, d] = tileToLoc(xr, yd)
    rect(l, u, r-l, d-u);
  }
}

//converts a grid tile to canvas space
function tileToLoc(i, j) {
  return [x, y] = [gx + cs * i, gy + cs * (rws - j)];
}

function locToMP(i, j) {
  return [x, y] = [i + cs / 2, j - cs / 2]
}

function DelaunayTriangulation() {
  return;
}

function draw() {
  background(220);
  noFill();
  stroke("black");
  drawGrid(gx, gy, cs, rws, cms);
  for (let i = 0; i < ptAmnt; i++) {
    let thisPoint = points[i];
    let [xi, yi] = tileToLoc(thisPoint[0], thisPoint[1])
    mp = locToMP(xi, yi);
    xi = mp[0]
    yi = mp[1]
    drawPoint(xi, yi, i);
  }
  // let u = tileToLoc(6, 7);
  // let v = tileToLoc(1, 3);
  // let a = u[0];
  // let b = u[1];
  // let c = v[0];
  // let d = v[1];
  // drawRandColorRect(a,b,c,d)
}