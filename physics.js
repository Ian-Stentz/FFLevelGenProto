class FreeBodyDiagram {
    constructor(ptList, rectList, adjArray, xL, xR, yD, yU, sprCst = 6) {
        this.ptList = ptList;
        this.rectList = rectList;
        this.adjArray = adjArray;
        this.sprCst = sprCst;
        this.xL = xL;
        this.xR = xR;
        this.yD = yD;
        this.yU = yU;

        this.forceLists = [];
        this.velocityList = [];
    }

    dist2d(i, j) {

    }

    checkWallCollision(i) {

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