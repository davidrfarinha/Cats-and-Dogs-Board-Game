const allIds = [];

for (let i = 1; i < 9; i++) {
    for (let j = i * 10 + 1; j < i * 10 + 9; j++) {
        allIds.push(`${String.fromCharCode(i + 64)}${j}`);
    }
}
console.log(allIds);

const dogFirstMove = [];

function populateArrayWith1stMoves(array) {
    for (let i = 1; i < 9; i++) {
        for (let j = i * 10 + 1; j < i * 10 + 9; j++) {
            array.push(j);
        }
    }
}

populateArrayWith1stMoves(dogFirstMove);
console.log(dogFirstMove);
