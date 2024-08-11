function dist2(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

class TriMesh {
    constructor() {
        //a list of three points for a super triangle, for the sake of the delaunay triangulation
        this.superTri = [];
        //point list is a list of paired list points which should be never be popped from
        this.pointList = [];
        //mesh is a triangle mesh represented by 3-length lists of indices of the points involved, referencing the point list
        this.mesh = [];
    }

    addPoint(x, y) {
        this.pointList.push([x, y])
    }

    addTri(a, b, c) {
        this.mesh.push([a,b,c]);
    }

    triLen() {
        return this.mesh.length;
    }

    pointLen() {
        return this.pointList.length;
    }

    getPoint(i) {
        if(i == "a") {
            return this.superTri[0];
        } else if (i == "b") {
            return this.superTri[1];
        } else if (i == "c") {
            return this.superTri[2];
        } else {
            return this.pointList[i];
        }
    }

    triToPoints(a, b, c) {
        let i = this.getPoint(a);
        let j = this.getPoint(b);
        let k = this.getPoint(c);
        return [i, j, k];
    }

    indexToPoints(i) {
        let [a, b, c] = this.mesh[i];
        return this.triToPoints(a, b, c);
    }

    //Any triangle containing any of the super triangle points is pruned
    removeSuperTri() {
        let ind = 0;
        while(ind < this.triLen) {
            let tri = this.mesh[ind];
            let prune = false;

            for(let point of tri) {
                if(point == "a" || point == "b" || point == "c") {
                    prune = true;
                    break;
                }
            }

            if(prune) {
                this.mesh.splice(ind, 1);
                continue;
            } else {
                ind++;
                continue;
            }
        }
    }

    toAdjList() {
        let outAdjList = new adjacencyList(this.pointList);
        for (let tri of this.mesh) {
            let [a, b, c] = tri;
            outAdjList.makeUndirectedEdge(a, b);
            outAdjList.makeUndirectedEdge(b, c);
            outAdjList.makeUndirectedEdge(a, c);
        }
        return outAdjList;
    }
}

class adjacencyList {
    constructor(points){
        this.pointList = points;
        this.adjacencyList = [];
        for (let i = 0; i < points.length; i++) {
            this.pointList.push([]);
        }
    }

    //from a to b
    makeDirectedEdge(a, b) {
        if(!this.adjacencyList[a].includes(b)) {
            this.adjacencyList[a].push(b);
        }
    }

    makeUndirectedEdge(a, b) {
        this.makeDirectedEdge(a, b);
        this.makeDirectedEdge(b, a);
    }

    indexToPoint(i) {
        return this.pointList[i];
    }

    getWeight(a, b) {
        [x1, y1] = this.indexToPoint(a)
        [x2, y2] = this.indexToPoint(b)
        return dist2(x1, y1, x2, y2);
    }
    
    drawAdjList(strokeWeight, color) {
        //TODO;
    }
}