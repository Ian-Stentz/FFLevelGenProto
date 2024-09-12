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
        return [i, j] = [Math.floor(Math.random() * (this.columns - 2 * MR)) + MR, Math.floor(Math.random() * (this.rows - 2 * MR)) + MR];
    }

    placePoints(ptAmnt) {
        for (let n = 0; n < this.numPoints; n++) {
            let [i, j] = this.proposePoint();
            let success;
            for (let k = 0; k < 5; k++) {
            success = true;
              for (let point of points) {
                let ii = point[0];
                let jj = point[1];
                if(dist2(i, j, ii, jj) <= this.minRadius) {
                  let pNew = thisproposePoint(); 
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
            this.points.push([i,j]);
          }
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

    makeRectangles() {
        for (let n = 0; n < this.numPoints(); n++) {
            let width = Math.floor(Math.random() * (this.maxRadius) * 2) + 1;
            let height = Math.floor(Math.random() * (this.maxRadius) * 2) + 1;
            this.rects.push([Math.ceil(width/2), Math.ceil(height/2), Math.floor(width/2), Math.floor(height/2)]);
          }
    }
}