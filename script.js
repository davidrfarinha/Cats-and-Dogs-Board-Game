
/* ---------------------- CATS AND DOGS ---------------------- */


// Creating an array with the ids of all the available cells in the board 
const allIds = [];
for (let i = 1; i < 9; i++) {
    for (let j = i * 10 + 1; j < i * 10 + 9; j++) {
        allIds.push(`${String.fromCharCode(i + 64)}${j}`);
    }
}

// Defining the numbers of the squares referring to the valid first moves of each player;
const catFirstMove = [44, 45, 54, 55];
const dogFirstMove = [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 46, 47, 48, 51, 52, 53, 56, 57, 58, 61, 62, 63, 64, 65, 66, 67, 68, 71, 72, 73, 74, 75, 76, 77, 78, 81, 82, 83, 84, 85, 86, 87, 88];

//These two arrays contain the numbers of the squares referring to the valid initial moves of each player (these will change in the course of the game);
const catInitialMoves = [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 51, 52, 53, 54, 55, 56, 57, 58, 61, 62, 63, 64, 65, 66, 67, 68, 71, 72, 73, 74, 75, 76, 77, 78, 81, 82, 83, 84, 85, 86, 87, 88];
const dogInitialMoves = [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 51, 52, 53, 54, 55, 56, 57, 58, 61, 62, 63, 64, 65, 66, 67, 68, 71, 72, 73, 74, 75, 76, 77, 78, 81, 82, 83, 84, 85, 86, 87, 88];

// Objects representing both players
let cat = {
    name: 'cat',
    color: '#dcb893',
    moves: catInitialMoves
}

let dog = {
    name: 'dog',
    color: '#8C4827',
    moves: dogInitialMoves,
    class: 'human',
    difficulty: 'easy'
}

// This array will be populated with the object location of all the squares (found by their id) by the forEach loop below;
let squares = [];
allIds.forEach(item => squares.push(document.getElementById(item)));

let moveNumber = 0; // This is the move counter. For every turn, it will increase 1
let currentPlayer = cat; // This variable tracks the current player
let otherPlayer = dog; // This variable tracks the player who is waiting for his turn

//-------------------------------------------------------------------------------------------
// This is the program main function. It increases the turn counter (moveNumber) for every click in a square, decides who is the current player, evaluates the validity of the movement made, adds a piece to the board if the move is valid
function makeMove(event) {
    moveNumber++; // Increasing the move counter for every move made;
    console.log(`Current move: ${moveNumber}`);
    console.log(event.target);
    console.log(event.target['id']);
    // Capturing the event target id (the event target is the div that represents the clicked square), removing its first element (a letter) and turning it into a number, storing it in the variable playerMove. The purpose of this is to later evaluate the validity of the movement made, which will be easier with a numeric value;
    let playerMove = Number(event.target['id'].substring(1, 3));
    console.log(playerMove);

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

        // Checking if the other player still has moves left. If not, it will run an alert informing the winner of the game and reset the whole board with the help of reset function;
        if (currentPlayer['moves'].length === 0) {
            return endGame(otherPlayer, currentPlayer);
        }

        // This if statement checks if the game is multiplayer and if yes, it runs the function computerAI with the apropriate parameter for the difficulty level;
        if (currentPlayer['class'] === "computer" && moveNumber !== 0) {
            console.log('Now is the computer playing!');
            computerAI(currentPlayer['difficulty'])
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

// This function adds a piece to the board with the color of current player;
const pieceSound = new Audio('./Resources/Sound/pieceMove.mp3');
pieceSound.volume = 0.2;
function addPiece(playerColor, playerName, square) {
    if (currentPlayer['class'] === 'computer') {
        square.innerHTML = "<div class= 'piece " + playerName + "' style= 'background-color:" + playerColor + "; visibility: visible; animation-delay: 500ms; animation-fill-mode: backwards; '; ></div>";
        // The delays applied here serve the purpose of making the computer move not look so sudden;
        setTimeout(() => {
            pieceSound.play();
        }, 500);
    } else {
        square.innerHTML = "<div class= 'piece " + playerName + "' style= 'background-color:" + playerColor + "; visibility: visible; ease-out;'></div>";
        pieceSound.play();
    }

}

// This function updates both players arrays of valid moves;
function updateValidMoves(move, player1, player2) {
    const squareToRemove1 = move;
    const squareToRemove2 = move - 10;
    const squareToRemove3 = move - 1;
    const squareToRemove4 = move + 1;
    const squareToRemove5 = move + 10;
    const allSquaresToRemove = [squareToRemove1, squareToRemove2, squareToRemove3, squareToRemove4, squareToRemove5];
    player1['moves'] = player1['moves'].filter(item => item !== move);

    allSquaresToRemove.forEach(squareToRemove => {
        player2['moves'] = player2['moves'].filter(item => item !== squareToRemove);
    });
}

// ...........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
// This function is the current working function of computer AI.
function computerAI(difficulty) {
    let move;

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

    let bestMoves = [];
    let intermediateMoves = [];
    let worstMoves = [];

    switch (true) {
        case moves5.length > 0:
            bestMoves = moves5;
            intermediateMoves = moves4;
            worstMoves = moves3.concat(moves2, moves1, moves0);
            break;
        case moves4.length > 0:
            bestMoves = moves4;
            intermediateMoves = moves3;
            worstMoves = moves2.concat(moves1, moves0);
            break;
        case moves3.length > 0:
            bestMoves = moves3;
            intermediateMoves = moves2;
            worstMoves = moves1.concat(moves0);
            break;
        case moves2.length > 0:
            bestMoves = moves2;
            intermediateMoves = moves1;
            worstMoves = moves0;
            break;
        case moves1.length > 0:
            bestMoves = moves1;
            intermediateMoves = moves0;
            worstMoves = moves0;
            break;
        default:
            bestMoves = moves0;
            intermediateMoves = moves0;
            worstMoves = moves0;
    }

    let weightedChoice = getWeightedRandom(difficulty);
    console.log('Weighted Choice is: ' + weightedChoice)
    let weightedChoiceArray = [];
    switch (weightedChoice) {
        case 'bestMoves':
            weightedChoiceArray = bestMoves;
            break;
        case 'intermediateMoves':
            if (intermediateMoves.length > 0) {
                weightedChoiceArray = intermediateMoves;
            } else if (bestMoves.length > 0) {
                weightedChoiceArray = bestMoves;
            } else {
                weightedChoiceArray = worstMoves;
            }
            break;
        case 'worstMoves':
            if (worstMoves.length > 0) {
                weightedChoiceArray = worstMoves;
            } else if (intermediateMoves.length > 0) {
                weightedChoiceArray = intermediateMoves;
            } else {
                weightedChoiceArray = bestMoves;
            }
            break;
    }

    let randomNumber;
    let objectMove;
    randomNumber = Math.floor(Math.random() * weightedChoiceArray.length);
    objectMove = weightedChoiceArray[randomNumber];
    move = (objectMove['moveMade']);

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

// The function below is an helper function for computer AI to choose a move according to difficulty settings - An object called chosenObj is chosen according to difficulty. Then, a for loop nested in a forIn loop populates an array with x number of keys of the object, being that x is the value associated with that key. To finish, the function returns a random item from that array.
//(I felt the need to comment this function very well, or I wouldn't understand it later)
function getWeightedRandom(difficulty) {
    let chosenObj = {};
    switch (difficulty) {
        case 'easy':
            chosenObj['worstMoves'] = 50;
            chosenObj['intermediateMoves'] = 30;
            chosenObj['bestMoves'] = 20;
            break;
        case 'normal':
            chosenObj['worstMoves'] = 25;
            chosenObj['intermediateMoves'] = 50;
            chosenObj['bestMoves'] = 25;
            break;
        case 'hard':
            chosenObj['worstMoves'] = 0;
            chosenObj['intermediateMoves'] = 30;
            chosenObj['bestMoves'] = 70;
            break;
        case 'veryHard':
            chosenObj['worstMoves'] = 0;
            chosenObj['intermediateMoves'] = 0;
            chosenObj['bestMoves'] = 100;
            break;
    }
    let arrayOfChoices = [];
    for (let property in chosenObj) {
        for (let i = 0; i < chosenObj[property]; i++) {
            arrayOfChoices.push(property);
        }
    }
    return arrayOfChoices[Math.floor(Math.random() * arrayOfChoices.length)];
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
    let winnerSound;
    if (winner['name'] === 'dog') {
        winnerSVG = dogWinner;
        winnerSound = dogWinnerSound;
    } else if (winner['name'] === 'cat') {
        winnerSVG = catWinner;
        winnerSound = catWinnerSound;
    }
    setTimeout(() => {
        endGameMessage.style.display = 'block';
        gameLoser.innerHTML = loser['name'];
        gameWinner.innerHTML = winner['name'];
        winnerSVG.style.display = 'block';
        winnerSound.play();
    }, 1000);

}

backToMainMenuButton.onclick = function () {
    reset();
    mainMenuSection.style.display = 'flex';
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
    //console.log(`Current player is ${currentPlayer['name']}`);
    //console.log(`Other player is ${otherPlayer['name']}`);
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
let messagesPopped = [];
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
    if (!messagesPopped.includes(assessmentValue)) {
        errorMessageBox.style.display = 'block';
        errorMessageAlert.innerHTML = alert;
        errorAlertSound.play();
    } else {
        errorAlertSound.play();
    }
    messagesPopped.push(assessmentValue);
}
// The function below checks the available moves for each player while hovering the mouse over the squares of the board. If the square represents an available move, it will turn green. If not, it will turn red (The first two if statements occur only in the first two moves);
function checkIfAvailable(event) {
    let highlightedSquare = Number(event.target['id'].substring(1, 3));
    //console.log("highlightedsquare:" + highlightedSquare);
    if (moveNumber === 0) {
        if (catFirstMove.includes(highlightedSquare)) {
            paintSquare(event, 'red');
        } else {
            paintSquare(event, 'green');
        }
    } else if (moveNumber === 1) {
        if (dogFirstMove.includes(highlightedSquare) && dog['moves'].includes(highlightedSquare)) {
            paintSquare(event, 'red');
        } else {
            paintSquare(event, 'green');
        }
    } else if (moveNumber > 0) {
        if (currentPlayer['moves'].includes(highlightedSquare)) {
            paintSquare(event, 'red');
        } else {
            paintSquare(event, 'green');
        }
    }
}

// Helper function used by the function above to paint the squares with the corresponding color;
function paintSquare(event, color) {
    if (color === 'red') {
        event.target.style.backgroundImage = 'linear-gradient(to right bottom, #5dcc95, #69d09c, #74d3a4, #7ed7ab, #89dab2, #93ddb8, #9ce0bf, #a6e3c5, #b1e6cc, #bcead3, #c6edda, #d1f0e1)';
    } else if (color === 'green') {
        event.target.style.backgroundImage = 'linear-gradient(to right bottom, #cc5d93, #d0689a, #d374a2, #d77ea9, #da89b0, #dd93b7, #e09cbd, #e3a6c4, #e6b1cb, #eabcd3, #edc6da, #f0d1e1)';
    }
}
// Returning the squares to their original visual after hover out
function revert(event) {
    event.target.style.backgroundImage = "";
}

// Creating a onmouse down event listener that runs the function makeMove in every square of the board;
squares.forEach(item => item.onclick = makeMove);

// Creating a onmouseover event listener to check if the square hovered is a valid move for the current player;
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
    mainMenuSection.style.display = 'flex';
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
    mainMenuSection.style.display = 'flex';

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

multiPlayerButton.onclick = () => {
    aiDifficulty.style.display = 'none'
    singlePlayerButton.classList.remove('chosenOption');
    multiPlayerButton.classList.add('chosenOption');
    dog['class'] = 'human';
    console.log(dog['class']);
}

singlePlayerButton.onclick = () => {
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
    dog['difficulty'] = 'veryHard';
    console.log(dog['difficulty']);
}

startButton.onclick = function () {
    newGameSection.style.display = 'none';
    boardContainer.style.display = 'flex';
    mainThemeSong.pause();
}
