//helper functions for the delaunay triangulation

function determinant2(matrix) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

//returns the cofactor of a nxn square matrix, removing row x and column y
function cofactor(matrix, n, x, y) {
    let newMatrix = [];
    let row = [];
    for (let i = 0; i < n; i++) {
        row = [];
        if(i == x) {
            continue;
        }
        for (let j = 0; j < n; j++) {
            if(j == y) {
                continue;
            }
            row.push(matrix[i][j])
        }
        newMatrix.push(row);
    }
    return newMatrix;
}

//console.log(cofactor([[0, 1, 2],[3, 4, 5],[6, 7, 8]], 3, 0, 1));

//general form for the determinant of an nxn matrix
function determinant(matrix, n) {
    if(n == 2) {
        return determinant2(matrix);
    }
    let sum = 0;
    for (let i = 0; i < n; i++) {
        //console.log(Math.pow(-1, i), matrix[0][i], determinant(cofactor(matrix, n, 0, i), n-1))
        sum += Math.pow(-1, i) * matrix[0][i] * determinant(cofactor(matrix, n, 0, i), n-1)
    }
    return sum;
}

//determines if point D is within the circumcircle of triangle ABC
function inCircumcircle(A, B, C, D) {
    let [Ax, Ay] = A;
    let [Bx, By] = B;
    let [Cx, Cy] = C;
    let [Dx, Dy] = D;
    let adx = Ax - Dx;
    let ady = Ay - Dy;
    let bdx = Bx - Dx;
    let bdy = By - Dy;
    let cdx = Cx - Dx;
    let cdy = Cy - Dy;
    let myMatrix = [[adx, ady, (adx * adx) + (ady * ady)],
                    [bdx, bdy, (bdx * bdx) + (bdy * bdy)],
                    [cdx, cdy, (cdx * cdx) + (cdy * cdy)]];
    let det = determinant(myMatrix, 3);
    console.log("DET:")
    console.log(myMatrix);
    //console.log(A, B, C, D);
    console.log(det);
    return det > 0;
}

// //expecting: 1
// console.log(determinant([[1,0,0],[0,1,0],[0,0,1]], 3));
// //expecting: 23
// console.log(determinant([[7,-4,2],[3,1,-5],[2,2,-5]], 3));
// //expecting: 16
// console.log(determinant([[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]], 4));
//expecting: -240
//console.log(determinant([[4,3,2,2],[0,1,-3,3],[0,-1,3,3],[0,3,1,1]], 4));

