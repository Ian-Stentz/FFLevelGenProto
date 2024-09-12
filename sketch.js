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
//
let adjList;
let triMesh;

// initialize action queue
let totalTime = 0;

let delaunayMesh = new TriMesh();

function proposePoint() {
  return [i, j] = [Math.floor(Math.random() * (cms - 2 * minRadius)) + minRadius, Math.floor(Math.random() * (rws - 2 * minRadius)) + minRadius];
}

//populate points array
function generatePoints() {
  for (let n = 0; n < ptAmnt; n++) {
    let [i, j] = proposePoint();
    let success;
    for (let k = 0; k < 5; k++) {
      success = true;
      for (let point of points) {
        let ii = point[0];
        let jj = point[1];
        if(dist2(i, j, ii, jj) <= minRadius) {
          let pNew = proposePoint(); 
          i = pNew[0];
          j = pNew[1];
          success = false;
          break;
        }
      }
      if(success) {
        break;
      }
    }
    points.push([i,j]);
  }
}

//colors!
function generateColors() {
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
}

function generateRects() {
  for (let n = 0; n < ptAmnt; n++) {
    let width = Math.floor(Math.random() * (maxRadius) * 2) + 1;
    let height = Math.floor(Math.random() * (maxRadius) * 2) + 1;
    rects.push([Math.ceil(width/2), Math.ceil(height/2), Math.floor(width/2), Math.floor(height/2)]);
  }
}

//draws a grid with upper left corner at (startx,starty) with a cell size of cell and with "rows" amount of rows and "columns" amount of columns
function drawGrid(startx, starty, cell, rows, columns) {
  strokeWeight(1);
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
  strokeWeight(1);
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

function drawRects() {
  noFill();
  for (let i = 0; i < ptAmnt; i++) {
    let [cr, cg, cb] = colors[i];
    stroke(cr, cg, cb);
    strokeWeight(4);
    let pt = points[i];
    let myRect = rects[i];
    let xr = pt[0] + myRect[0];
    let yu = pt[1] + myRect[1];
    let xl = pt[0] - myRect[2];
    let yd = pt[1] - myRect[3];
    let [l, u] = tileToLoc(xl, yu);
    let [r, d] = tileToLoc(xr, yd);
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

function tileToMP(i, j) {
  [xi, yi] = tileToLoc(i, j);
  return [x, y] = locToMP(xi, yi);
}

let ptCruise = [];
let aTri = [];
let bTri = [];
let cTri = [];

function setup() {
  createCanvas(cw, ch);
  generatePoints();
  generateColors();
  generateRects();
  frameRate(30);
  delaunayMesh.addSuperTri(gx, gy, cs * rws, cs * cms);
  let midPoints = [];
  for (let point of points) {
    midPoints.push(tileToMP(point[0], point[1]));
  }
  adjList = new adjacencyList(midPoints);
  console.log(points);
}

function update(delta) {
  totalTime += delta/1000;
  //console.log(delta/1000);
}

let ticker = 0;
let badTrisRemoved = false
function keyPressed() {
  if (key === " ") {
    if (ticker < ptAmnt) {
      let [i, j] = points[ticker];
      delaunayMesh.addDelaunayPoint(tileToMP(i, j));
      ticker += 1;
    } else if(!badTrisRemoved) {
      delaunayMesh.removeSuperTri();
      badTrisRemoved = true;
      delaunayMesh.toAdjList(adjList);
      adjList.printAdjList();
    } else {
      //Two forces to account for: Spring forces and collision forces
      //Spring forces will be calculated using a map of edges to equilibrium weight, and then weight will be calculated frame-by-frame until equilibrium is reached (might need drag to help). F = -k*dx (equilibrium length - current length; in the direction towards equilibrium) 
      //Collision forces will be calculated by checking collisions between boxes and from boxes to walls. Momentum gained from this force will have to be tracked, so it can be cancelled completely upon collision ending. Or, simply cancel the velocity component in the direction out from the wall
      //Then it's just a matter of using the free body diagram of each box to apply a force to itself, iterating over all the boxes, and then applying drag & force cancellation, repeating until the system reaches equilibrium (?) if it takes longer than (some time), cancel the operation and [regenerate]
    }
  }
}

function draw() {
  update(deltaTime)
  background(220);
  noFill();
  stroke("black");
  strokeWeight(1);
  let edgeColor = color(235, 180, 10)

  drawGrid(gx, gy, cs, rws, cms);
  for (let i = 0; i < ptAmnt; i++) {
    let thisPoint = points[i];
    let [xi, yi] = tileToMP(thisPoint[0], thisPoint[1])
    drawPoint(xi, yi, i);
  }
  drawRects();
  if(!badTrisRemoved) {
    delaunayMesh.drawTriMesh(edgeColor);
  }
  else {
    adjList.drawAdjList(edgeColor, 2.5);
  }
}