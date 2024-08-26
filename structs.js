function dist2(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

class TriMesh {
    constructor(points = []) {
        //a list of three points for a super triangle, for the sake of the delaunay triangulation
        this.superTri = [];
        //point list is a list of paired list points which should be never be popped from
        this.pointList = points;
        //mesh is a triangle mesh represented by a set of 3-length lists of indices of the points involved, referencing the point list
        this.mesh = new Set();
    }

    addPoint(x, y) {
        return this.pointList.push([x/10, y/10]) - 1;
    }

    addTri(a, b, c) {
        this.mesh.add([a,b,c]);
    }

    addSuperTri(x,y,w,h) {
        let pA = [(x-w)/10, (y-h)/10]
        let pB = [(x+2*w)/10, (y-h)/10]
        let pC = [(x+w/2)/10, (y+2*h)/10]
        this.superTri.push(pA, pB, pC)
        this.mesh.add(["a", "b", "c"]);
    }

    meshSize() {
        return this.mesh.size;
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

    triEdges(tri) {
        let [a, b, c] = tri;
        return [[a, b], [b, c], [a, c]];
    }

    edgeEquals(edgeA, edgeB) {
        let [a, b] = edgeA
        let [c, d] = edgeB
        return ((a == c && b == d) || (a == d && b == c))
    }

    indexToPoints(i) {
        let [a, b, c] = this.mesh[i];
        return this.triToPoints(a, b, c);
    }

    //Any triangle containing any of the super triangle points is pruned
    //TO REMAKE
    removeSuperTri() {
        let badTris = new Set()
        for (let tri of this.mesh) {
            for(let point of tri) {
                if(point == "a" || point == "b" || point == "c") {
                    badTris.add(tri);
                }
            }
        }
        this.mesh = this.mesh.difference(badTris);
    }

    toAdjList(adjList) {
        let outAdjList = new adjacencyList(this.pointList);
        for (let tri of this.mesh) {
            let [a, b, c] = tri;
            outAdjList.makeUndirectedEdge(a, b);
            outAdjList.makeUndirectedEdge(b, c);
            outAdjList.makeUndirectedEdge(a, c);
        }
        return outAdjList;
    }

    //add Delaunay Point
    addDelaunayPoint(newPoint) {
        let [npa, npb] = newPoint;
        //search for bad triangles
        let npi = this.addPoint(npa, npb);
        npa = npa / 10;
        npb = npb / 10;
        let newPointMod = [npa, npb];
        let badTriangles = new Set()
        for (let tri of this.mesh) {
            let [a, b, c] = tri;
            console.log(a, b, c, npi);
            let [i, j, k] = this.triToPoints(a, b, c);
            console.log(i, j, k, newPointMod);
            if(inCircumcircle(i, j, k, newPointMod)) {
                badTriangles.add(tri);
            }
        }
        //find edges shared by no other bad triangle
        let badTriArray = Array.from(badTriangles);
        console.log("BAD TRIANGLES:")
        console.log(badTriArray);
        //keep track of unique edges and shared edges
        let uniqueEdges = new Set();
        for (let i = 0; i < badTriArray.length; i++) {
            let edges = this.triEdges(badTriArray[i]) 
            for (let edge of edges) {
                let unique = true;
                for (let uniqueEdge of uniqueEdges) {
                    if (this.edgeEquals(edge, uniqueEdge)) {
                        uniqueEdges.delete(uniqueEdge)
                        unique = false;
                        break;
                    }
                }
                if(unique) {
                    uniqueEdges.add(edge);
                }
            }
        }
        //remove bad triangles
        this.mesh = this.mesh.difference(badTriangles);
        //form triangles from the edges + the new point
        for (let edge of uniqueEdges) {
            let [a, b] = edge;
            this.addTri(a, b, npi)
        }
        console.log("New Triangles");
        console.log(this.mesh);
    }
    
    drawTriangle(tri, edgeColor) {
        stroke(edgeColor);
        strokeWeight(3);
        noFill();
        let [a, b, c] = tri
        let [i, j, k] = this.triToPoints(a, b, c);
        let [x1, y1] = i;
        let [x2, y2] = j;
        let [x3, y3] = k;
        triangle(x1 * 10, y1 * 10, x2 * 10, y2 * 10, x3 * 10, y3 * 10);
    }

    drawTriMesh(edgeColor) {
        if(this.mesh.size == 0) {
            return;
        }
        for (let tri of this.mesh) {
            this.drawTriangle(tri, edgeColor);
        }
    }
}

class adjacencyList {
    constructor(points){
        this.pointList = points;
        this.adjacencyList = [];
        for (let i = 0; i < this.pointList.length; i++) {
            this.adjacencyList.push([]);
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
    
    printAdjList() {
        console.log("Point List:")
        for (let i = 0; i < this.pointList.length; i++) {
            let [x, y] = this.pointList[i];
            console.log(`${i}: (${x}, ${y})`);
        }
        console.log("Adj List:")
        for (let from = 0; from < this.adjacencyList.length; from++) {
            let string = `${from}: `
            for(let to of this.adjacencyList[from]) {
                string += `${to}, `
            }
            string = string.slice(0, string.lastIndexOf(", "));
            console.log(string);
        }
    }

    drawAdjList(color, strokeWgt = 1) {
        //console.log("beep");
        strokeWeight(strokeWgt);
        stroke(color);
        for (let from = 0; from < this.adjacencyList.length; from++) {
            for(let to of this.adjacencyList[from]) {
                if (from < to) {
                    let [x1, y1] = this.indexToPoint(from);
                    let [x2, y2] = this.indexToPoint(to);
                    //console.log(`(${x1}, ${y1}) to (${x2}, ${y2})`);
                    line(x1, y1, x2, y2);
                }
            }
        }
    }
}