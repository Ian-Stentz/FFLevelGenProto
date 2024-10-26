//canvas dim
let cw = 600, ch = 600
let totalTime = 0;
let delaunayMesh = new TriMesh();
let myGrid = new Grid(20, 20, 20, 28, 28, 3, 5);

let actionQueue = ["Delaunay", "EnablePhysics"];
let adjList;
let physicsObj;

function setup() {
  createCanvas(cw, ch);
  myGrid.placePoints(10);
  myGrid.selectColors();
  myGrid.makeRectangles();
  // generatePoints();
  // generateColors();
  // generateRects();
  // console.log(myGrid.ptList);
  frameRate(30);
  delaunayMesh.addSuperTri(myGrid.xOffset, myGrid.yOffset, myGrid.cellSize * myGrid.rows, myGrid.cellSize * myGrid.columns);
  adjList = new adjacencyList(myGrid.getBoundpoints());
  //console.log(myGrid.ptList);
}

function myUpdate(delta) {
  totalTime += delta/1000;
  //console.log(delta/1000);
  if(runningSimulation) {
    physicsObj.runSimulation(delta);
  }
}

let ticker = 0;
let badTrisRemoved = false
let runningSimulation = false
let simulationDone = false;
function keyPressed() {
  if (key === " ") {
    let action = actionQueue.shift()
    //console.log(actionQueue)
    switch(action) {
      case "Delaunay":
        for (let point of myGrid.getBoundpoints()) {
          delaunayMesh.addDelaunayPoint(point);
        }
        delaunayMesh.removeSuperTri();
        badTrisRemoved = true;
        delaunayMesh.toAdjList(adjList);
        break;
      case "EnablePhysics":
        let bounds = [myGrid.xOffset + myGrid.cellSize * myGrid.rows, myGrid.yOffset + myGrid.cellSize + myGrid.columns, myGrid.xOffset, myGrid.yOffset];
        let myPoints = []
        let bPoints = myGrid.getBoundpoints()
        for (let i = 0; i < bPoints.length; i++) {
          let point = bPoints[i];
          //console.log(point);
          let x = point[0];
          let y = point[1];
          let newPoint = [x,y];
          //console.log(newPoint);
          myPoints[i] = newPoint;
          //console.log(myPoints);
        }
        //console.log(myPoints);
        physicsObj = new FreeBodyDiagram(myPoints, myGrid.rects, adjList.adjacencyList, bounds, myGrid.cellSize, 20, 40);
        runningSimulation = true;
        break;
      default:
        runningSimulation = false;
        simulationDone = true;
        physicsObj.ptList = myGrid.roundPointsToGrid(physicsObj.ptList);
        console.log("out of actions");
    }
    // if (ticker < myGrid.numPoints()) {
    //   let [i, j] = myGrid.ptList[ticker];
    //   delaunayMesh.addDelaunayPoint(myGrid.tileToMP(i, j));
    //   ticker += 1;
    // } else if(!badTrisRemoved) {
    //   delaunayMesh.removeSuperTri();
    //   badTrisRemoved = true;
    //   delaunayMesh.toAdjList(adjList);
    //   adjList.printAdjList();
    // } else {
    //   //Two forces to account for: Spring forces and collision forces
    //   //Spring forces will be calculated using a map of edges to equilibrium weight, and then weight will be calculated frame-by-frame until equilibrium is reached (might need drag to help). F = -k*dx (equilibrium length - current length; in the direction towards equilibrium) 
    //   //Collision forces will be calculated by checking collisions between boxes and from boxes to walls. Momentum gained from this force will have to be tracked, so it can be cancelled completely upon collision ending. Or, simply cancel the velocity component in the direction out from the wall
    //   //Then it's just a matter of using the free body diagram of each box to apply a force to itself, iterating over all the boxes, and then applying drag & force cancellation, repeating until the system reaches equilibrium (?) if it takes longer than (some time), cancel the operation and [regenerate]
    // }
  }
}

function draw() {
  myUpdate(deltaTime)
  background(220);
  noFill();
  stroke("black");
  strokeWeight(1);
  let edgeColor = color(235, 180, 10)

  myGrid.drawGrid();
  if(!runningSimulation && !simulationDone) {
    myGrid.drawBoundpoints();
    myGrid.drawRects();
    if(!badTrisRemoved) {
      delaunayMesh.drawTriMesh(edgeColor);
    }
    else {
      adjList.drawAdjList(edgeColor, 2.5);
    }
  } else {
    //console.log(physicsObj.ptList)
    myGrid.drawBoundpoints(physicsObj.ptList);
    myGrid.drawRects(physicsObj.ptList);
    let newDelaunayMesh = new TriMesh();
    let newAdjList = new adjacencyList(physicsObj.ptList);
    newDelaunayMesh.addSuperTri(myGrid.xOffset, myGrid.yOffset, myGrid.cellSize * myGrid.rows, myGrid.cellSize * myGrid.columns);
    for (let point of physicsObj.ptList) {
      newDelaunayMesh.addDelaunayPoint(point);
    }
    newDelaunayMesh.removeSuperTri();
    //console.log(newDelaunayMesh.mesh);
    newDelaunayMesh.toAdjList(newAdjList);
    // adjList.adjacencyList = newAdjList.adjacencyList

    physicsObj.adjArray = newAdjList.adjacencyList;
    
    //console.log(newAdjList.adjacencyList);
    //console.log(physicsObj.adjArray);
    newAdjList.drawAdjList(edgeColor, 2.5);
    //console.log(newAdjList.adjacencyList);
  }
  // drawGrid(gx, gy, cs, rws, cms);
  // for (let i = 0; i < ptAmnt; i++) {
  //   let thisPoint = points[i];
  //   let [xi, yi] = tileToMP(thisPoint[0], thisPoint[1])
  //   drawPoint(xi, yi, i);
  // }
  // drawRects();
}