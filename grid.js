//Keep the grid here and make it an object, pronto 
class Grid {
  constructor(xOffset, yOffset, cellSize, rows, columns, minRadius, maxRadius) {
      this.xOffset = xOffset;
      this.yOffset = yOffset;
      this.cellSize = cellSize;
      this.rows = rows;
      this.columns = columns;
      this.minRadius = minRadius;
      this.maxRadius = maxRadius;

      this.ptList = [];
      this.rects = [];
      this.colors = [];
  }

  numPoints() {
    return this.ptList.length;
  }

  proposePoint() {
    let MR = this.minRadius
    return [Math.floor(Math.random() * (this.columns - 2 * MR)) + MR, Math.floor(Math.random() * (this.rows - 2 * MR)) + MR];
  }

  placePoints(ptAmnt) {
    for (let n = 0; n < ptAmnt; n++) {
      let [i, j] = this.proposePoint();
      let success;
      for (let k = 0; k < 5; k++) {
      success = true;
        for (let point of this.ptList) {
          let ii = point[0];
          let jj = point[1];
          if(dist2(i, j, ii, jj) <= this.minRadius) {
            let pNew = this.proposePoint(); 
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
      this.ptList.push([i,j]);
    }
  }

  tileToLoc(i, j) {
    return [this.xOffset + this.cellSize * i, this.yOffset + this.cellSize * (this.rows - j)];
  }
  
  locToMP(i, j) {
    return [i + this.cellSize / 2, j - this.cellSize / 2]
  } 
  
  tileToMP(i, j) {
    let [xi, yi] = this.tileToLoc(i, j);
    return this.locToMP(xi, yi);
  }
  
  getBoundpoints(overridePts = []) {
    let Boundpoints = [];
    let myList;
    if(overridePts.length == 0) {
      myList = this.ptList;
    } else {
      myList = overridePts;
    }
    for (let point of myList) {
      Boundpoints.push(this.tileToLoc(point[0], point[1]));
    }
    return Boundpoints;
  }

  getMidpoints() {
    let Midpoints = [];
    for (let point of this.ptList) {
      Midpoints.push(this.tileToMP(point[0], point[1]));
    }
    return Midpoints;
  }

  selectColors() {
    for (let n = 0; n < this.numPoints(); n++) {
      let r = Math.random() * 256;
      let g = Math.random() * 256;
      let b = Math.random() * 256;
      while(Math.sqrt(r ** 2 + g ** 2 + b ** 2) > 192) {
      r = Math.random() * 256;
      g = Math.random() * 256;
      b = Math.random() * 256;
      }
      this.colors.push([r,g,b]);
    }
  }

  //Order is RULD (radial)  UP is +y in this
  makeRectangles() {
    for (let n = 0; n < this.numPoints(); n++) {
      let width = Math.floor(Math.random() * (this.maxRadius) * 2) + 1;
      let height = Math.floor(Math.random() * (this.maxRadius) * 2) + 1;
      this.rects.push([Math.ceil(width/2), Math.ceil(height/2), Math.floor(width/2), Math.floor(height/2)]);
    }
  }

  //draws a grid with upper left corner at (startx,starty) with a cell size of cell and with "rows" amount of rows and "columns" amount of columns
  drawGrid() {
    strokeWeight(1);
    let xf = this.xOffset + this.cellSize * this.rows;
    let yf = this.yOffset + this.cellSize * this.columns;
    for (let i = 0; i <= this.rows; i++) {
      let nx = this.xOffset + this.cellSize * i;
      line(nx, this.yOffset, nx, yf);
    }
    for (let j = 0; j <= this.columns; j++) {
      let ny = this.yOffset + this.cellSize * j;
      line(this.xOffset, ny, xf, ny);
    }
  }

  //draws a point (small circle) at indicated location
  drawPoint(x, y, i = -1) {
    strokeWeight(1);
    if(i == -1) {
      stroke("black");
      fill("black");
    } else {
      let [r, g, b] = this.colors[i];
      stroke(r, g, b);
      fill(r, g, b);
    }
    circle(x, y, 7);
  }

  drawMidpoints() {
    for (let i = 0; i < this.numPoints(); i++) {
      let [x, y] = this.ptList[i];
      let [a, b] = this.tileToMP(x, y)
      this.drawPoint(a, b, i)
    }
  }
  //override option for physics sim?
  drawBoundpoints(overridePts = []) {
    let Boundpoints;
    if (overridePts.length == 0) {
      Boundpoints = this.getBoundpoints();
    } else {
      Boundpoints = this.getBoundpoints(overridePts);
    }
    for (let i = 0; i < this.numPoints(); i++) {
      let [x, y] = Boundpoints[i];
      this.drawPoint(x, y, i)
    }
  }
  //override option for physics sim?
  drawRects(overridePts = []) {
    noFill();
    let myList;
    if(overridePts.length == 0) {
      myList = this.ptList;
    } else {
      myList = overridePts;
    }
    for (let i = 0; i < this.numPoints(); i++) {
      let [cr, cg, cb] = this.colors[i];
      stroke(cr, cg, cb);
      strokeWeight(4);
      let pt = myList[i];
      let myRect = this.rects[i];
      let xr = pt[0] + myRect[0];
      let yu = pt[1] + myRect[1];
      let xl = pt[0] - myRect[2];
      let yd = pt[1] - myRect[3];
      let [l, u] = this.tileToLoc(xl, yu);
      let [r, d] = this.tileToLoc(xr, yd);
      rect(l, u, r-l, d-u);
    }
  }
}