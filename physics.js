// Grid bounds order is RULD (radial)
class FreeBodyDiagram {
    constructor(ptList, rectList, adjArray, gridBounds, sprCst = 6) {
        this.ptList = ptList;
        this.rectList = rectList;
        this.adjArray = adjArray;
        this.sprCst = sprCst;
        this.xR = gridBounds[0];
        this.yU = gridBounds[1];
        this.xL = gridBounds[2];
        this.yD = gridBounds[3];

        this.forceLists = [];
        this.velocityList = [];
    }

    dist2d(i, j) {

    }

    checkWallCollision(i) {
        let pt = this.ptList[i];
        let ptX = pt[0];
        let ptY = pt[1];
        let rect = this.rectList[i];
    }

    checkBoxCollision() {

    }

    getEquilibriumSpringLength() {

    }

    numPoints() {
        return this.ptList.length;
    }

    wallForces() {

    }

    collisionForces() {

    }

    springForces() {

    }

    calculateForces() {

    }

    calculateVelocities() {

    }

    updatePositions(dT) {
        for(let i = 0; i < this.numPoints(); i++) {
            let [vx, vy] = this.velocityList[i];
            let [px, py] = this.ptList[i];
            this.ptList[i] = px + vx * dT;
        }
    }

    runSimulation(deltaTime) {

    }
}