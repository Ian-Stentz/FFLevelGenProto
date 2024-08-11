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
    let myMatrix = [[Ax, Ay, Ax * Ax + Ay * Ay, 1],
                    [Bx, By, Bx * Bx + By * By, 1],
                    [Cx, Cy, Cx * Cx + Cy * Cy, 1],
                    [Dx, Dy, Dx * Dx + Dy * Dy, 1]];
    return determinant(myMatrix) > 0;
}

// //expecting: 1
// console.log(determinant([[1,0,0],[0,1,0],[0,0,1]], 3));
// //expecting: 23
// console.log(determinant([[7,-4,2],[3,1,-5],[2,2,-5]], 3));
// //expecting: 16
// console.log(determinant([[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2]], 4));
// //expecting: -240
// console.log(determinant([[4,3,2,2],[0,1,-3,3],[0,-1,3,3],[0,3,1,1]], 4));

