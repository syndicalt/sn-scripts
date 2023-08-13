const spiralTraverse = (matrix) => {
    const result = [];
    let startRow = 0;
    let endRow = matrix.length - 1;
    let startCol = 0;
    let endCol = matrix[0].length - 1;

    while (startRow <= endRow && startCol <= endCol) {
        // top row
        for (let col = startCol; col <= endCol; col++) {
            result.push(matrix[startRow][col]);
        }

        // right column
        for (let row = startRow + 1; row <= endRow; row++) {
            result.push(matrix[row][endCol]);
        }

        // bottom row
        for (let col = endCol - 1; col >= startCol; col--) {
            // handle edge case where there is a single row in the middle of the matrix
            if (startRow === endRow) break;
            result.push(matrix[endRow][col]);
        }

        // start column
        for (let row = endRow - 1; row > startRow; row--) {
            // handle edge case where there is a single column in the middle of the matrix
            if (startCol === endCol) break;
            result.push(matrix[row][startCol]);
        }

        startRow++;
        endRow--;
        startCol++;
        endCol--;
    }

    return result;
}

// provide a binary array matrix for testing
const matrix = [
    [1, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 1, 0, 0, 1],
    [0, 0, 1, 0, 0, 1, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0]
];

console.log(spiralTraverse(matrix));

$('.tinymce').tinymce({
    setup : function(ed) {
        ed.onInit.add(function(ed) {
            ed.execCommand("fontName", false, "Arial");
            ed.execCommand("fontSize", false, "2");
        });
    }
});