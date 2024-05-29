const gridContainer = document.querySelector(".grid-container");
const gridItems = document.querySelectorAll(".grid-item");
NodeList.prototype.indexOf = Array.prototype.indexOf;

//IIFE, closure, by referencing to one inst of an obj, ensure only one inst
const gameFactory = (function(){
let gameBoard = ["", "", "", "", "", "", "", "", ""];
function isDraw(){
    return gameBoard.every(function(tile){
    return tile !== "";
})};
let gameActive = true;
let currentPlayer = "X";
function updateGameBoard(boardindex, player){
    gameFactory.gameBoard[boardindex] = player;
}
function updateCurrentPlayer()  {
    gameFactory.currentPlayer = gameFactory.currentPlayer === "X" ? "O" : "X";
}
function resetGameBoard(){
    gameFactory.gameBoard = ["", "", "", "", "", "", "", "", ""];
}
function resetPlayer(){
    gameFactory.currentPlayer = "X";
}
function clearDisplay(){ //checked, working properly
    gridItems.forEach((currentSquare) =>{
        currentSquare.innerHTML = "";
        if(currentSquare.classList.contains("selected")){
            currentSquare.classList.remove("selected")
        }
    })
};

//Return all internal functions as Object properties
return{updateGameBoard, gameBoard, currentPlayer, updateCurrentPlayer, gameActive, isDraw, resetGameBoard,resetPlayer, clearDisplay}
})();

//Display Texts
let playerTurn = `It's Player ${gameFactory.currentPlayer}'s turn!`;
const winningMessage = `Player ${gameFactory.currentPlayer} won!`;
const drawMessage = "It's a draw!";

//Set initial game status. Player X's turn
let gameStatus = document.querySelector("#game-status");
gameStatus.innerHTML = playerTurn;

//Get index to update board, update display when clicked. Update value of currentPlayer
gridItems.forEach((currentSquare) =>{
    currentSquare.addEventListener("click", (e) =>{
        if (!currentSquare.classList.contains("selected") && gameFactory.gameActive == true){
            e.stopPropagation()
            let index = gridItems.indexOf(currentSquare);
            gameFactory.updateGameBoard(index, gameFactory.currentPlayer);
            gridItems[index].textContent = gameFactory.currentPlayer;
            currentSquare.classList.add("selected");
            checkWinCondition();
        }
        else{
            console.log("Grid item already selected or game not active.");
            return;
        }
    })
})

const winConditions =
[
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
]

function checkWinCondition(){
    let bingo = false;
    //Loop through to check for win
    for (let i=0; i<8;i++){
        let winCondition = winConditions[i]
        let a = gameFactory.gameBoard[winCondition[0]];
        let b = gameFactory.gameBoard[winCondition[1]];
        let c = gameFactory.gameBoard[winCondition[2]];
        if (a === "" || b === "" || c === ""){
            continue;
        }
        if (a === b && b === c){
            bingo = true;
            gameFactory.gameActive = false;
            const winningMessage = `Player ${gameFactory.currentPlayer} won!`;
            gameStatus.innerHTML = winningMessage;
            break
        }
    };
    //What happens when no win detected, continue game, switch turns
    if (bingo === false){
        checkDrawOrContinue();
    }
};

function checkDrawOrContinue(){
    if (gameFactory.isDraw()){ //draw
        gameFactory.gameActive = false;
        gameStatus.innerHTML = drawMessage;
    }
    else{ //continue
        gameFactory.updateCurrentPlayer();
        playerTurn = `It's Player ${gameFactory.currentPlayer}'s turn!`; // Update playerTurn
        gameStatus.innerHTML = playerTurn; // Update game status
    }
} 

let resetBtn = document.querySelector("#reset"); //checked all working properly
resetBtn.addEventListener("click", ()=>{
    gameFactory.resetGameBoard();
    gameFactory.resetPlayer();
    playerTurn = `It's Player ${gameFactory.currentPlayer}'s turn!`;
    gameFactory.clearDisplay(); //clears visual display as well as class:selected
    gameFactory.gameActive = true;
    gameStatus.innerHTML = playerTurn;
})