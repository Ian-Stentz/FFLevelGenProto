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
    for (let k = 0; k < 5; k++) {
      for (let point of points) {
        let ii = point[0];
        let jj = point[1];
        if(dist2(i, j, ii, jj) <= minRadius) {
          let pNew = proposePoint(); 
          i = pNew[0];
          j = pNew[1];
          break;
        }
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
    rects[n] = [Math.ceil(width/2), Math.ceil(height/2), Math.floor(width/2), Math.floor(height/2)]
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

// function delaunayTriangulation() {
//   let newPoints = [];
//   for (let [x, y] of points) {
//     newPoints.push(tileToMP(x, y));
//   }
//   triMesh = new TriMesh(newPoints);
//   //triMesh.addTri(0, 1, 2);
//   adjList = triMesh.toAdjList();
//   adjList.printAdjList();
// }

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
  //delaunayTriangulation();
  console.log(points);
  //console.log(rects);

  // for (let i = 0; i < 10000; i++) {
  //   ptCruise.push([Math.random() * cw * 2 - cw, Math.random() * ch * 2 - ch]);
  // }
  
  // for (let i = 0; i < 3; i++) {
  //   aTri.push([Math.random() * cw * 2 - cw, Math.random() * ch * 2 - ch]);
  // }
  // for (let i = 0; i < 3; i++) {
  //   bTri.push([Math.random() * cw * 2 - cw, Math.random() * ch * 2 - ch]);
  // }
  // for (let i = 0; i < 3; i++) {
  //   cTri.push([Math.random() * cw * 2 - cw, Math.random() * ch * 2 - ch]);
  // }
  // console.log(aTri);
}

function update(delta) {
  totalTime += delta;
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
    }
  }
}

function draw() {
  update(deltaTime)
  background(220);
  noFill();
  stroke("black");
  strokeWeight(1);
  let edgeColor = color(250, 210, 10)

  drawGrid(gx, gy, cs, rws, cms);
  for (let i = 0; i < ptAmnt; i++) {
    let thisPoint = points[i];
    let [xi, yi] = tileToMP(thisPoint[0], thisPoint[1])
    drawPoint(xi, yi, i);
  }
  drawRects();
  
  delaunayMesh.drawTriMesh(edgeColor);

  // for(myPoint of ptCruise) {
  //   let [x, y] = myPoint;
  //   let color = 0;
  //   let [aa, ba, ca] = aTri;
  //   let [ab, bb, cb] = bTri;
  //   let [ac, bc, cc] = cTri;
  //   if(inCircumcircle(aa, ba, ca, myPoint)) {
  //     color += 1
  //   }
  //   if(inCircumcircle(ab, bb, cb, myPoint)) {
  //     color += 2
  //   }
  //   if(inCircumcircle(ac, bc, cc, myPoint)) {
  //     color += 4
  //   }
  //   drawPoint((x + cw) / 2, (y + ch) / 2, color);
  // }
  // stroke(0, 0, 0);
  // noFill();
  // strokeWeight(5);
  // let [a, b, c] = aTri;
  // let [ax, ay] = a;
  // let [bx, by] = b;
  // let [cx, cy] = c;
  // triangle((ax + cw) / 2, (ay + ch) / 2, (bx + cw) / 2, (by + ch) / 2, (cx + cw) / 2, (cy + ch) / 2);
  // [a, b, c] = bTri;
  // [ax, ay] = a;
  // [bx, by] = b;
  // [cx, cy] = c;
  // triangle((ax + cw) / 2, (ay + ch) / 2, (bx + cw) / 2, (by + ch) / 2, (cx + cw) / 2, (cy + ch) / 2);
  // [a, b, c] = cTri;
  // [ax, ay] = a;
  // [bx, by] = b;
  // [cx, cy] = c;
  // triangle((ax + cw) / 2, (ay + ch) / 2, (bx + cw) / 2, (by + ch) / 2, (cx + cw) / 2, (cy + ch) / 2);

  //triMesh.drawTriMesh(edgeColor);
  //adjList.drawAdjList(edgeColor, 1);
  // let u = tileToLoc(6, 7);
  // let v = tileToLoc(1, 3);
  // let a = u[0];
  // let b = u[1];
  // let c = v[0];
  // let d = v[1];
  // drawRandColorRect(a,b,c,d)
}