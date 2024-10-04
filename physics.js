// Collision info
class CollisionData {
    constructor(colliding, normal, newCollision = false) {
        this.colliding = colliding
        this.normal = normal
        this.newCollsion = newCollision
    }
}

// Grid bounds order is RULD (radial)
class FreeBodyDiagram {
    constructor(ptList, rectList, adjArray, gridBounds, wallVelMag = 20, sprCst = 6, sprEqulibriumMod = 1.0, drag = 0.95) {
        this.ptList = ptList;
        this.rectList = rectList;
        this.adjArray = adjArray;
        this.wallVelMag = wallVelMag;
        this.sprCst = sprCst;
        this.sprEqulibriumMod = sprEqulibriumMod;
        this.drag = drag;
        this.gridR = gridBounds[0];
        this.gridU = gridBounds[1];
        this.gridL = gridBounds[2];
        this.gridD = gridBounds[3];

        this.forceLists = [];
        this.velocityList = [];

        this.initPhysicsArrays();
    }

    initPhysicsArrays() {
        for (let i = 0; i < this.numPoints(); i++) {
            this.forceLists.push([]);
            this.velocityList.push([0, 0]);
        }
    }

    dist2index(i, j) {
        let ptA = this.ptList[i];
        let ptB = this.ptList[j];
        return dist2(ptA[0], ptA[1], ptB[0], ptB[1]);
    }

    getRectBoundsIndex(i) {
        let pt = this.ptList[i];
        let rect = this.rectList[i];
        let rectR = pt[0] + rect[0];
        let rectU = pt[1] + rect[1];
        let rectL = pt[0] - rect[2];
        let rectD = pt[1] - rect[3];
        return [rectR, rectU, rectL, rectD];
    }
    getRectBoundsPoint(i, point) {
        let pt = point;
        let rect = this.rectList[i];
        let rectR = pt[0] + rect[0];
        let rectU = pt[1] + rect[1];
        let rectL = pt[0] - rect[2];
        let rectD = pt[1] - rect[3];
        return [rectR, rectU, rectL, rectD];
    }

    checkWallCollision(i, newPointi = []) {
        let rectBounds = this.getRectBoundsIndex(i);
        let iColliding = false;
        let normal = [0,0];
        if (rectBounds[0] > this.gridR) {
            iColliding = true;
            normal = vectAdd(normal, [1,0]);
        }
        if (rectBounds[1] > this.gridR) {
            iColliding = true;
            normal = vectAdd(normal, [0,1]);
        }
        if (rectBounds[2] < this.gridR) {
            iColliding = true;
            normal = vectAdd(normal, [-1,0]);
        }
        if (rectBounds[3] < this.gridR) {
            iColliding = true;
            normal = vectAdd(normal, [0,-1]);
        }
        if(newPointi.length == 0) {
            normal = vectNormalize(normal);
            return new CollisionData(iColliding, normal, false);
        } else {
            let newBounds = this.getRectBoundsPoint(i, newPointi);
            let newColliding = false;
            normal = [0,0];
            if (newBounds[0] > this.gridR) {
                newColliding = true;
                normal = vectAdd(normal, [1,0]);
            }
            if (newBounds[1] > this.gridR) {
                newColliding = true;
                normal = vectAdd(normal, [0,1]);
            }
            if (newBounds[2] < this.gridR) {
                newColliding = true;
                normal = vectAdd(normal, [-1,0]);
            }
            if (newBounds[3] < this.gridR) {
                newColliding = true;
                normal = vectAdd(normal, [0,-1]);
            }
            normal = vectNormalize(normal);
            let beginOverlap = newColliding && !iColliding;
            return new CollisionData(newColliding, normal, beginOverlap);
        }
    }

    //checks if i is colliding j and returns the normal of j onto i (iorigin - jorigin or the vector pointing from j's origin to i's origin)
    //uses newPointi to test collision if the point were to move to newPointi's location
    checkBoxCollision(i, j, newPointi = []) {
        let pti;
        let oldColliding = false;
        if(newPointi.length == 0) {
            pti = this.ptList[i];
        } else [
            pti = newPointi
        ]
        let ptj = this.ptList[j];
        let rectBoundsi = this.getRectBoundsPoint(i, pti);
        let rectBoundsj = this.getRectBoundsIndex(j);
        let colliding = false;
        //I know the way it's currently implemented doesn't take advantage of the seperate cases, but it might eventually sooo
        //I right is over J left edge
        if(rectBoundsi[0] > rectBoundsj[2]) {
            colliding = true;
        }
        //I up is over J down edge
        if(rectBoundsi[1] > rectBoundsj[3]) {
            colliding = true;
        }
        //I left is over J right edge
        if(rectBoundsi[2] < rectBoundsj[0]) {
            colliding = true;
        }
        //I down is over J up edge
        if(rectBoundsi[3] < rectBoundsj[1]) {
            colliding = true;
        }
        let normal = [0, 0];
        if(colliding) {
            normal = pti - ptj;
            normal = vectNormalize(normal);
        }
        if(newPointi.length != 0) {
            let rectBoundsOld = this.getRectBoundsIndex(i);
            if(rectBoundsOld[0] > rectBoundsj[2]) {
                oldColliding = true;
            }
            //I up is over J down edge
            if(rectBoundsOld[1] > rectBoundsj[3]) {
                oldColliding = true;
            }
            //I left is over J right edge
            if(rectBoundsOld[2] < rectBoundsj[0]) {
                oldColliding = true;
            }
            //I down is over J up edge
            if(rectBoundsOld[3] < rectBoundsj[1]) {
                oldColliding = true;
            }
            let beginOverlap = colliding && !oldColliding
            return new CollisionData(colliding, normal, beginOverlap);
        }
        return new CollisionData(colliding, normal);
    }

    getEquilibriumSpringLength(i, j) {
        let rectI = this.rectList[i];
        let rectJ = this.rectList[j];
        let calcX = (rectI[0] + rectI[2] + rectJ[0] + rectJ[2]) / 2
        let calcY = (rectI[1] + rectI[3] + rectJ[1] + rectJ[3]) / 2
        return dist2(0,0,calcX,calcY) * this.sprEqulibriumMod;
    }

    numPoints() {
        return this.ptList.length;
    }

    wallForces() {
        //iterate over each box and check if it's overlapping with a wall. If it is, add velocity(?) in the direction of the normal
        let collisionDetected = false;
        let outVelList = [];
        for (let i = 0; i < this.numPoints(); i++) {
            let collisionData = this.checkWallCollision[i]
            if(collisionData.collding) {
                outVelList.push(vectScale(this.wallVelMag, collisionData.normal));
            } else {
                outVelList.push([0, 0]);
            }
        }
        return [collisionDetected, outVelList];
    }

    springForces() {
        //iterate over each connection and return the force applied by springs
        for (let i = 0; i < this.numPoints(); i++) {
            let tempForceList = [];
            let adjacencies = this.adjArray[i]
            for (let adjacency of adjacencies) {
                let pi = this.ptList[i]
                let pj = this.ptList[adjacency]
                let eL = this.getEquilibriumSpringLength(i, adjacency);
                let longVec = vectAdd(pi, vectScale(-1, pj));
                let longVecMag = dist2(0, 0, longVec[0], longVec[1]);
                let dx = longVecMag - eL
                let deltaPosition = vectScale(dx, vectNormalize(longVecMag));
                let springForce = vectScale(this.sprCst, deltaPosition);
                tempForceList.push(springForce);
            }
            this.forceLists[i] = tempForceList;
        }
        //TODO: return instead of accessing force lists?
    }

    calculateForces() {
        this.springForces();
    }

    calculateVelocities(dT) {
        //add wall forces if wall forces found a collision
        //REVISED: add wall forces to effective velocities during UPDATEPOSITIONS, remove from here!!!
        // let results = this.wallForces();
        // if(results[0]) {
        //     let velList = results[1];
        //     for (let i = 0; i < this.numPoints(); i++) {
        //         this.velocityList[i] = vectAdd(this.velocityList[i], velList[i]);
        //     }
        // }
        //add spring forces from this.forcelists
        for(let i = 0; i < this.numPoints(); i++) {
            let forces = this.forceLists[i];
            for (let j = 0; j < forces.length; j++) {
                let force = forces[j];
                let dV = vectScale(dT, force);
                this.velocityList[i] = vectAdd(this.velocityList[i], dV);
            }
        }
    }

    updatePositions(dT) {
        //if this would cause it to intersect with something else, prevent it from doing so.
        for(let i = 0; i < this.numPoints(); i++) {
            let vel = this.velocityList[i];
            let pos = this.ptList[i];
            //TODO: prevent it from moving into a collision, if it was not already
            //First check for wall collision (and move against wall?)
            //Then check other box collisions
            //this.ptList[i] = vectAdd(pos, vectScale(dT, vel));
            let proposeMove = vectAdd(pos, vectScale(dT, vel));
            let checkWall = this.checkWallCollision(i, proposeMove);
            if(checkWall.colliding && checkWall.newCollsion) {
                //TODO: manual calculation
                if(checkWall.normal[1] > 0) {
                    
                }
                if(checkWall.normal[0] > 0) {
                    
                }
                if(checkWall.normal[1] < 0) {
                    
                }
                if(checkWall.normal[0] < 0) {
                    
                }
            }
            for (let adjacency of this.adjArray[i]) {
                let checkBoxCollision = this.checkBoxCollision(i, j, proposeMove);
                if(checkBoxCollision.colliding && checkBoxCollision.newCollsion) {
                    //TODO: for loop?

                }
            }
        }
    }

    applyDrag(dT) {
        for (let i = 0; i < this.velocityList.length; i++) {
            let vel = this.velocityList[i];
            this.velocityList[i] = vectScale(drag, vel);
        }
    }

    runSimulation(deltaTime) {
        //first calc forces, then velocity, then update positions, then apply drag
        this.calculateForces();
        this.calculateVelocities(deltaTime);
        this.updatePositions(deltaTime);
        this.applyDrag(deltaTime);
    }

    roundPoints() {
        //TODO;
        return;
    }

    stopSimulation() {
        this.roundPoints();
    }
}