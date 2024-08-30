//Keep the grid here and make it an object, pronto 
class Grid {
    constructor(xOffset, yOffset, cellSize, rows, columns) {
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.cellSize = cellSize;
        this.rows = rows;
        this.columns = columns;
    }

    placePoints(ptAmnt, minRadius, maxRadius) {
        this.ptAmnt = ptAmnt;
        this.minRadius = minRadius;
        this.maxRadius = maxRadius;
    }

    selectColors() {

    }

    makeRectangles() {

    }
}