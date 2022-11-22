const allIds = ['A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17', 'A18', 'B21', 'B22', 'B23', 'B24', 'B25', 'B26', 'B27', 'B28', 'C31', 'C32', 'C33', 'C34', 'C35', 'C36', 'C37', 'C38', 'D41', 'D42', 'D43', 'D44', 'D45', 'D46', 'D47', 'D48', 'E51', 'E52', 'E53', 'E54', 'E55', 'E56', 'E57', 'E58', 'F61', 'F62', 'F63', 'F64', 'F65', 'F66', 'F67', 'F68', 'G71', 'G72', 'G73', 'G74', 'G75', 'G76', 'G77', 'G78', 'H81', 'H82', 'H83', 'H84', 'H85', 'H86', 'H87', 'H88'] // This array contains this ids pertaining all the squares in the board;

//These two arrays contain the numbers of the squares referring to the valid first moves of each player;
const catFirstMove = [44, 45, 54, 55];
const dogFirstMove = [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 46, 47, 48, 51, 52, 53, 56, 57, 58, 61, 62, 63, 64, 65, 66, 67, 68, 71, 72, 73, 74, 75, 76, 77, 78, 81, 82, 83, 84, 85, 86, 87, 88];

//These two arrays contain the numbers of the squares referring to the valid initial moves of each player;
const catInitialMoves = [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 51, 52, 53, 54, 55, 56, 57, 58, 61, 62, 63, 64, 65, 66, 67, 68, 71, 72, 73, 74, 75, 76, 77, 78, 81, 82, 83, 84, 85, 86, 87, 88];
const dogInitialMoves = [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 51, 52, 53, 54, 55, 56, 57, 58, 61, 62, 63, 64, 65, 66, 67, 68, 71, 72, 73, 74, 75, 76, 77, 78, 81, 82, 83, 84, 85, 86, 87, 88];

let cat = {
    name: 'cat',
    color: '#dcb893',
    moves: catInitialMoves,
}

let dog = {
    name: 'dog',
    color: '#8C4827',
    moves: dogInitialMoves,
    class: 'human',
    difficulty: 'easy'
}

let squares = []; // This array will be populated with the object location of all the squares (found by their id) by the forEach loop below;
allIds.forEach(item => squares.push(document.getElementById(item)));

let moveNumber = 0; // This is the move counter. For every turn, it will increase 1

let currentPlayer = cat; // This variable tracks the current player
let otherPlayer = dog; // This variable tracks the player who is waiting for his turn

let movesMade = [];



//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// This is the program main function. It increases the turn counter (moveNumber) for every click in a square, decides who is the current player, evaluates the validity of the movement made, adds a piece to the board if the move is 
function makeMove(event) {
    moveNumber++; // This line of code increases the move counter for every move made;
    console.log(`Current move: ${moveNumber}`);

    // The line of code above captures the event target id (the event target is the div that represents the clicked square), removes its first element (a letter) and turns it into a number, storing it in the variable playerMove. The purpose of this is to later evaluate the validity of the movement made, which will be easier with a numeric value;
    let playerMove = Number(event.target['id'].substring(1, 3));


    // This if else if statement checks which player is currently playing;
    if (moveNumber % 2 === 1) {
        currentPlayer = cat;
        otherPlayer = dog;
    } else if (moveNumber % 2 === 0) {
        currentPlayer = dog;
        otherPlayer = cat;
    }

    console.log(`Current player is ${currentPlayer['name']}`)
    console.log(`Other player is ${otherPlayer['name']}`)

    console.log(`${currentPlayer['name']} just made his move. He chose square ${playerMove}`);

    // This if else statement evaluates if the current move is valid according to the game rules with the help of function validMove. If valid, runs the functions addPiece and updateValidMoves;
    let assessmentOfMove = (validMove(playerMove, currentPlayer['moves']));
    console.log("assessmentOfMove:" + assessmentOfMove);

    if (assessmentOfMove > 0) {
        errorMessage(assessmentOfMove);
        moveNumber--;
    } else {

        addPiece(currentPlayer['color'], currentPlayer['name'], event.target);
        updateValidMoves(playerMove, currentPlayer, otherPlayer);
        updateInfo();

        // This if else statement is here for AI move to work properly;
        if (currentPlayer === cat) {
            currentPlayer = dog;
        } else if (currentPlayer === dog) {
            currentPlayer = cat;
        }
        if (otherPlayer === cat) {
            otherPlayer = dog;
        } else if (otherPlayer === dog) {
            otherPlayer = cat;
        }

        // This if statement checks if the other player still has moves left. If not, it will run an alert informing the winner of the game and reset the whole board with the help of reset function;
        if (currentPlayer['moves'].length === 0) {
            endGame(otherPlayer, currentPlayer);
        }

        // This if statement checks if the game is multiplayer and if yes, it runs the function computerAI with the apropriate parameter for the difficulty level;
        if (currentPlayer['class'] === "computer" && moveNumber !== 0) {
            console.log('Now is the computer playing!');
            switch (currentPlayer['difficulty']) {
                case "easy":
                    computerAI("easy");
                    break;
                case "normal":
                    computerAI("normal");
                    break;
                case "hard":
                    computerAI("hard");
                    break;
            }
        }
    };
}



// This function checks if the move being made is valid by comparing the player move with the array containing the list of valid moves;
function validMove(playerMove, arrayOfMoves) {

    // console.log("Player move: " + playerMove)
    let assessment;
    if (moveNumber === 1) {
        arrayOfMoves = catFirstMove;
        if (!arrayOfMoves.includes(playerMove)) {
            assessment = 1;
        } else {
            assessment = 0;
        }
    } else if (moveNumber === 2) {
        arrayOfMoves = dogFirstMove;
        if (!arrayOfMoves.includes(playerMove)) {
            assessment = 2;
        } else if (!dog['moves'].includes(playerMove)) {
            assessment = 4;
        } else {
            assessment = 0;
        }
    } else if (playerMove === 0) {
        assessment = 3;
    } else {
        if (!arrayOfMoves.includes(playerMove)) {
            assessment = 4;
        } else {
            assessment = 0;
        }

    }
    return assessment;
}

const pieceSound = new Audio('./Resources/Sound/pieceMove.mp3');
pieceSound.volume = 0.2;
// This function adds a piece to the board corresponding to the board with the color of current player;
function addPiece(playerColor, playerName, square) {
    square.innerHTML = "<div class= 'piece " + playerName + "' style= 'background-color:" + playerColor + "; visibility: visible'></div>";
    pieceSound.play();
}

// This function updates both players arrays of valid moves;
function updateValidMoves(move, player1, player2) {
    movesMade.push(move);
    //console.log(`List of moves already made: ${movesMade}`)
    const squareToRemove2 = move - 10;
    const squareToRemove3 = move - 1;
    const squareToRemove4 = move + 1;
    const squareToRemove5 = move + 10;
    player1['moves'] = player1['moves'].filter(item => item !== move);
    player2['moves'] = player2['moves'].filter(item => item !== move);
    player2['moves'] = player2['moves'].filter(item => item !== squareToRemove2);
    player2['moves'] = player2['moves'].filter(item => item !== squareToRemove3);
    player2['moves'] = player2['moves'].filter(item => item !== squareToRemove4);
    player2['moves'] = player2['moves'].filter(item => item !== squareToRemove5);
}



/* ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- 
*/
// This function is the current working function of computer AI.
function computerAI(difficulty) {
    let move;
    let randomNumber;
    if (difficulty === "easy") {

        randomNumber = Math.floor(Math.random() * (dog['moves'].length));
        //move = dog['moves'][randomNumber];


        let uncommonMoves = [];
        for (let i = 0; i < dog['moves'].length; i++) {
            for (let j = 0; j < cat['moves'].length; j++) {
                if (dog['moves'][i] !== cat['moves'][j]) {
                    uncommonMoves.push(dog['moves'][i]);
                }
            }
        }
        if (uncommonMoves.length > 0) {
            randomNumber = Math.floor(Math.random() * uncommonMoves.length);
            move = uncommonMoves[randomNumber];
        } else {
            randomNumber = Math.floor(Math.random() * (dog['moves'].length));
            move = dog['moves'][randomNumber];
            //console.log("Computer move: square " + move);
        }

    } else if (difficulty === "normal") {

        let commonMoves = [];
        for (let i = 0; i < dog['moves'].length; i++) {
            for (let j = 0; j < cat['moves'].length; j++) {
                if (dog['moves'][i] === cat['moves'][j]) {
                    commonMoves.push(dog['moves'][i]);
                }
            }
        }
        // console.log(`The list of common moves between cat and dog is: ${commonMoves}`);
        if (commonMoves.length > 0) {
            randomNumber = Math.floor(Math.random() * commonMoves.length);
            move = commonMoves[randomNumber];
            console.log("Computer special move: square " + move);
        } else {
            randomNumber = Math.floor(Math.random() * (dog['moves'].length));
            move = dog['moves'][randomNumber];
            console.log("Computer move: square " + move);
        }

    } else if (difficulty === "hard") {
        //randomNumber = Math.floor(Math.random() * (dog['moves'].length));
        // move = dog['moves'][randomNumber];

        let objectMove;
        let possibleMoves = []; // This array will be populated by the factory function below with objects that represent every possible move to computer player;
        dog['moves'].forEach(item => {
            possibleMoves.push(checkAfterValidMoves(item, cat))
        });
        let moves5 = possibleMoves.filter(item => item['otherPlayerLostMoves'] === (-5));
        let moves4 = possibleMoves.filter(item => item['otherPlayerLostMoves'] === (-4));
        let moves3 = possibleMoves.filter(item => item['otherPlayerLostMoves'] === (-3));
        let moves2 = possibleMoves.filter(item => item['otherPlayerLostMoves'] === (-2));
        let moves1 = possibleMoves.filter(item => item['otherPlayerLostMoves'] === (-1));
        let moves0 = possibleMoves.filter(item => item['otherPlayerLostMoves'] === (0));

        switch (true) {
            case moves5.length > 0:
                randomNumber = Math.floor(Math.random() * moves5.length);
                objectMove = moves5[randomNumber];
                break;
            case moves4.length > 0:
                randomNumber = Math.floor(Math.random() * moves4.length);
                objectMove = moves4[randomNumber];
                break;
            case moves3.length > 0:
                randomNumber = Math.floor(Math.random() * moves3.length);
                objectMove = moves3[randomNumber];
                break;
            case moves2.length > 0:
                randomNumber = Math.floor(Math.random() * moves2.length);
                objectMove = moves2[randomNumber];
                break;
            case moves1.length > 0:
                randomNumber = Math.floor(Math.random() * moves1.length);
                objectMove = moves1[randomNumber];
                break;
            default:
                randomNumber = Math.floor(Math.random() * moves0.length);
                objectMove = moves0[randomNumber];
        }
        move = (objectMove['moveMade'])
    }
    console.log("Computer move: square " + move);
    // The piece of code below transfers the value given to move to the correct square div on the board;
    let chosenSquare;
    for (const square of squares) {
        if (Number(square['id'].substring(1, 3)) === move) {
            chosenSquare = square; // VERY IMPORTANT PIECE OF CODE
        }
    }
    addPiece(dog['color'], dog['name'], chosenSquare);
    updateValidMoves(move, dog, cat);


    if (cat['moves'].length === 0) {
        endGame(dog, cat);
    } else {
        currentPlayer = cat;
        moveNumber++;
        updateInfo();
    }
}
/* ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- 
*/
const endGameMessage = document.getElementById('endGameMessage');
const gameLoser = document.getElementById('gameLoser');
const gameWinner = document.getElementById('gameWinner');
const dogWinner = document.getElementById('dogWinner');
const catWinner = document.getElementById('catWinner');
const backToMainMenuButton = document.getElementById('backToMainMenuButton');
const playAgainButton = document.getElementById('playAgainButton');

const dogWinnerSound = new Audio('./Resources/Sound/dogBarkVictory.wav');
const catWinnerSound = new Audio('./Resources/Sound/catMeowVictory.wav');
let winnerSVG;

/* The function below is responsible for showing the endgame message*/
function endGame(winner, loser) {
    updateInfo();
    endGameMessage.style.display = 'block';
    gameLoser.innerHTML = loser['name'];
    gameWinner.innerHTML = winner['name'];
    let winnerSound;
    if (winner['name'] === 'dog') {
        winnerSVG = dogWinner;
        winnerSound = dogWinnerSound;
    } else if (winner['name'] === 'cat') {
        winnerSVG = catWinner;
        winnerSound = catWinnerSound;
    }
    winnerSVG.style.display = 'block';
    winnerSound.play();
}

backToMainMenuButton.onclick = function () {
    reset();
    mainMenuSection.style.display = 'block';
    endGameMessage.style.display = 'none';
    //newGameSection.style.display = 'block';
    boardContainer.style.display = 'none';
    mainThemeSong.load();
    mainThemeSong.play();
}
playAgainButton.onclick = function () {
    reset();
    endGameMessage.style.display = 'none';
    winnerSVG.style.display = 'none';
}

// The function below is used by the computer AI to evaluate the quality of the possible moves that can be made.
function checkAfterValidMoves(move, player2) {
    let futureOtherPlayerMoves = player2['moves'];
    let player2MovesDiff;
    //console.log(`List of moves already made: ${movesMade}`)
    const squareToRemove2 = move - 10;
    const squareToRemove3 = move - 1;
    const squareToRemove4 = move + 1;
    const squareToRemove5 = move + 10;
    futureOtherPlayerMoves = futureOtherPlayerMoves.filter(item => item !== move);
    futureOtherPlayerMoves = futureOtherPlayerMoves.filter(item => item !== squareToRemove2);
    futureOtherPlayerMoves = futureOtherPlayerMoves.filter(item => item !== squareToRemove3);
    futureOtherPlayerMoves = futureOtherPlayerMoves.filter(item => item !== squareToRemove4);
    futureOtherPlayerMoves = futureOtherPlayerMoves.filter(item => item !== squareToRemove5);
    player2MovesDiff = futureOtherPlayerMoves.length - player2['moves'].length;
    return {
        moveMade: move,
        otherPlayerLostMoves: player2MovesDiff,
    }
}

function updateInfo() {
    if (dog['class'] === 'computer') {
        currentPlayerInfo.innerHTML = currentPlayer['name'];
    } else {
        currentPlayerInfo.innerHTML = otherPlayer['name'];
    }
    currentMoveInfo.innerHTML = moveNumber + 1;
    catAvailableMovesInfo.innerHTML = cat['moves'].length;
    dogAvailableMovesInfo.innerHTML = dog['moves'].length;
    //console.log(currentPlayer['name'] + ' player available moves are: ' + currentPlayer['moves']);
    //console.log(otherPlayer['name'] + ' player available moves are: ' + otherPlayer['moves']);
    console.log(`Current move: ${moveNumber}`);
    console.log(`Current player is ${currentPlayer['name']}`);
    console.log(`Other player is ${otherPlayer['name']}`);
    console.log('-----------------------------Move change-----------------------------');
}

function reset() {
    squares.forEach(item => item.innerHTML = '');
    moveNumber = 0;
    currentPlayer = cat;
    cat['moves'] = catInitialMoves;
    dog['moves'] = dogInitialMoves;
    currentPlayerInfo.innerHTML = currentPlayer['name'];
    currentMoveInfo.innerHTML = moveNumber;
    catAvailableMovesInfo.innerHTML = cat['moves'].length;
    dogAvailableMovesInfo.innerHTML = dog['moves'].length;
}

function errorMessage(assessmentValue) {
    let alert;
    switch (assessmentValue) {
        case 1:
            alert = "Cat's first move should be in the center!";
            break;
        case 2:
            alert = "Dog's first move should be outside the center!";
            break;
        case 3:
            alert = "That square is already ocupied";
            break;
        case 4:
            alert = "When placing a new pet on the board, players cannot place a cat next to a dog (horizontally or vertically) or a dog next to a cat.";
            break;
    }
    errorMessageBox.style.display = 'block';
    errorMessageAlert.innerHTML = alert;
    errorAlertSound.play();
}

function checkIfAvailable(event) {

    let highlightedSquare = Number(event.target['id'].substring(1, 3));
    //console.log("highlightedsquare:" + highlightedSquare);
    if (moveNumber === 0) {
        if (catFirstMove.includes(highlightedSquare)) {
            event.target.style.backgroundImage = 'linear-gradient(to right bottom, #5dcc95, #69d09c, #74d3a4, #7ed7ab, #89dab2, #93ddb8, #9ce0bf, #a6e3c5, #b1e6cc, #bcead3, #c6edda, #d1f0e1)';
        } else {
            event.target.style.backgroundImage = 'linear-gradient(to right bottom, #cc5d93, #d0689a, #d374a2, #d77ea9, #da89b0, #dd93b7, #e09cbd, #e3a6c4, #e6b1cb, #eabcd3, #edc6da, #f0d1e1)';
        }
    } else if (moveNumber === 1) {
        if (dogFirstMove.includes(highlightedSquare) && dog['moves'].includes(highlightedSquare)) {
            event.target.style.backgroundImage = 'linear-gradient(to right bottom, #5dcc95, #69d09c, #74d3a4, #7ed7ab, #89dab2, #93ddb8, #9ce0bf, #a6e3c5, #b1e6cc, #bcead3, #c6edda, #d1f0e1)';
        } else {
            event.target.style.backgroundImage = 'linear-gradient(to right bottom, #cc5d93, #d0689a, #d374a2, #d77ea9, #da89b0, #dd93b7, #e09cbd, #e3a6c4, #e6b1cb, #eabcd3, #edc6da, #f0d1e1)';
        }
    } else if (moveNumber > 0) {
        if (currentPlayer['moves'].includes(highlightedSquare)) {
            event.target.style.backgroundImage = 'linear-gradient(to right bottom, #5dcc95, #69d09c, #74d3a4, #7ed7ab, #89dab2, #93ddb8, #9ce0bf, #a6e3c5, #b1e6cc, #bcead3, #c6edda, #d1f0e1)';
        } else {
            event.target.style.backgroundImage = 'linear-gradient(to right bottom, #cc5d93, #d0689a, #d374a2, #d77ea9, #da89b0, #dd93b7, #e09cbd, #e3a6c4, #e6b1cb, #eabcd3, #edc6da, #f0d1e1)';
        }
    }
}

function revert(event) {
    event.target.style.backgroundImage = "";
}

// This forEach loop creates a onmouse down event listener that runs the function makeMove in every square of the board;
squares.forEach(item => item.onmousedown = makeMove);
squares.forEach(item => item.onmouseover = checkIfAvailable);
squares.forEach(item => item.onmouseout = revert);

/* The variables below represent the information available in game*/
const currentMoveInfo = document.getElementById('currentMove');
currentMoveInfo.innerHTML = 1;
const currentPlayerInfo = document.getElementById('currentPlayer');
currentPlayerInfo.innerHTML = 'Cat';
const catAvailableMovesInfo = document.getElementById('catAvailableMoves');
catAvailableMovesInfo.innerHTML = catInitialMoves.length;
const dogAvailableMovesInfo = document.getElementById('dogAvailableMoves');
dogAvailableMovesInfo.innerHTML = dogInitialMoves.length;
const mainMenuSection = document.getElementById('mainMenu');

/* ERROR MESSAGE FOR UNAVAILABLE MOVES */
const errorMessageBox = document.getElementById('errorMessage');
const errorMessageAlert = document.getElementById('error');
const errorMessageOKButton = document.getElementById('okButton');
const errorAlertSound = new Audio('./Resources/Sound/alert.wav');
errorAlertSound.volume = 0.5;

errorMessageOKButton.onclick = function () {
    errorMessageBox.style.display = 'none';
};

/* START SCREEN */
const startScreen = document.getElementById('startScreen');
const mainThemeSong = new Audio('./Resources/Sound/mainTheme.mp3');

mainThemeSong.volume = 0.1;
startScreen.onclick = function () {
    mainThemeSong.play();
    startScreen.style.display = 'none';
    mainMenuSection.style.display = 'block';
}

/* MAIN MENU */
const startNewGame = document.getElementById('startNewGame');

startNewGame.onclick = function () {
    mainMenuSection.style.display = 'none';
    newGameSection.style.display = 'block';
}

/* GAME RULES MENU */
const gameRulesButton = document.getElementById('gameRulesButton');
const gameRulesInfo = document.getElementById('gameRules')
const backGameRulesButton = document.getElementById('backButton')

gameRulesButton.onclick = function () {
    mainMenuSection.style.display = 'none';
    gameRulesInfo.style.display = 'block';
}

backGameRulesButton.onclick = function () {
    gameRulesInfo.style.display = 'none';
    mainMenuSection.style.display = 'block';

}

/* NEW GAME MENU */
const newGameSection = document.getElementById('newGame');

const multiPlayerButton = document.getElementById('multiPlayerButton');
const singlePlayerButton = document.getElementById('singlePlayerButton');
const aiDifficulty = document.getElementById('aiDiff')

const difficultyButtons = document.querySelectorAll('.small');
const easyButton = document.getElementById('easy');
const normalButton = document.getElementById('normal');
const hardButton = document.getElementById('hard');
const veryHardButton = document.getElementById('veryHard');

const startButton = document.getElementById('startButton');
const boardContainer = document.getElementById('boardContainer');

multiPlayerButton.onclick = function () {
    aiDifficulty.style.display = 'none'
    singlePlayerButton.classList.remove('chosenOption');
    multiPlayerButton.classList.add('chosenOption');
    dog['class'] = 'human';
    console.log(dog['class']);
}

singlePlayerButton.onclick = function () {
    aiDifficulty.style.display = 'block'
    multiPlayerButton.classList.remove('chosenOption');
    singlePlayerButton.classList.add('chosenOption');
    dog['class'] = 'computer';
    console.log(dog['class'])
}

easyButton.onclick = function () {
    difficultyButtons.forEach(item => item.classList.remove('chosenOption'));
    easyButton.classList.add('chosenOption');
    dog['difficulty'] = 'easy';
    console.log(dog['difficulty']);
}
normalButton.onclick = function () {
    difficultyButtons.forEach(item => item.classList.remove('chosenOption'));
    normalButton.classList.add('chosenOption');
    dog['difficulty'] = 'normal';
    console.log(dog['difficulty']);
}
hardButton.onclick = function () {
    difficultyButtons.forEach(item => item.classList.remove('chosenOption'));
    hardButton.classList.add('chosenOption');
    dog['difficulty'] = 'hard';
    console.log(dog['difficulty']);
}
veryHardButton.onclick = function () {
    difficultyButtons.forEach(item => item.classList.remove('chosenOption'));
    veryHardButton.classList.add('chosenOption');
    dog['difficulty'] = 'hard';
    console.log(dog['difficulty']);
}

startButton.onclick = function () {
    newGameSection.style.display = 'none';
    boardContainer.style.display = 'flex';
    mainThemeSong.pause();
}




