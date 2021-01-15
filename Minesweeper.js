// all the html components
const grid = document.querySelector('.grid');
const resetButton = document.querySelector('#reset');
const heightInput = document.getElementById('height');
const widthInput = document.getElementById('width');
const bombAmountInput = document.getElementById('bombInput');
const gridOption = document.getElementsByName('grid-option');
const bombCounterDisplay = document.querySelector('#bombCounter');
const timeDisplay = document.querySelector('#time');
const autoSolve = document.querySelector('#auto-solve');
const solveButton = document.querySelector('#solve-button');

// game components
let bombAmount = 10;
let height = 10;
let width = 10;
let board = [];
let isGameOver = false;
let clicked = 0;
let bombCounter = 10;
let time = 0;
let solveLaterCells = [];

function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, duration * 1000)
    })
}

class Cell {
    constructor(status, row, col) {
        this.status = status;
        this.row = row;
        this.col = col;
        this.revealed = false;
        this.flagged = false;
        this.display = document.createElement('img');
        this.display.src = 'img/facingDown.png';
        this.numBombs = 0;
        this.numFlagged = 0;
        this.solved = false;

        if ((this.isRightCell() || this.isLeftCell()) && (this.isTopCell() || this.isBottomCell())) {
            this.available = 3;
        }
        else if (this.isRightCell() || this.isLeftCell() || this.isTopCell() || this.isBottomCell()) {
            this.available = 5;
        }
        else {
            this.available = 8;
        }
    }
    isLeftCell() {
        return this.col === 0;
    }
    isLeftCell() {
        return this.col === 0;
    }
    isRightCell() {
        return this.col === width - 1;
    }
    isTopCell() {
        return this.row === 0;
    }
    isBottomCell() {
        return this.row === height - 1;
    }


    rightCell() {
        if (!this.isRightCell()) {
            return board[this.row][this.col + 1];
        }
        else return null;
    }
    bottomRightCell() {
        if (!(this.isBottomCell() || this.isRightCell())) {
            return board[this.row + 1][this.col + 1];
        }
        else return null;
    }
    bottomCell() {
        if (!this.isBottomCell()) {
            return board[this.row + 1][this.col];
        }
        else return null;
    }
    bottomLeftCell() {
        if (!(this.isBottomCell() || this.isLeftCell())) {
            return board[this.row + 1][this.col - 1];
        }
        else return null;
    }
    leftCell() {
        if (!this.isLeftCell()) {
            return board[this.row][this.col - 1];
        }
        else return null;
    }
    topLeftCell() {
        if (!(this.isTopCell() || this.isLeftCell())) {
            return board[this.row - 1][this.col - 1];
        }
        else return null;
    }
    topCell() {
        if (!this.isTopCell()) {
            return board[this.row - 1][this.col];
        }
        else return null;
    }
    topRightCell() {
        if (!(this.isTopCell() || this.isRightCell())) {
            return board[this.row - 1][this.col + 1];
        }
        else return null;
    }


    updateAvailability() {
        // minus 1 from the avaiable of all the surrounding board
        if (!this.isRightCell()) {
            // minus right
            this.rightCell().available--;
            setSolved(this.rightCell());

            if (!this.isTopCell()) {
                // minus top right
                this.topRightCell().available--;
                setSolved(this.topRightCell());
            }
            if (!this.isBottomCell()) {
                // minus bottom right
                this.bottomRightCell().available--;
                setSolved(this.bottomRightCell());
            }
        }

        if (!this.isBottomCell()) {
            // minus bottom
            this.bottomCell().available--;
            setSolved(this.bottomCell());
        }

        if (!this.isLeftCell()) {
            // minus left
            this.leftCell().available--;
            setSolved(this.leftCell());
            if (!this.isTopCell()) {
                // minus top left
                this.topLeftCell().available--;
                setSolved(this.topLeftCell());
            }
            if (!this.isBottomCell()) {
                // minus bottom left
                this.bottomLeftCell().available--;
                setSolved(this.bottomLeftCell());
            }
        }

        if (!this.isTopCell()) {
            // minus top
            this.topCell().available--;
            setSolved(this.topCell());
        }
    }

    updateFlagged() {
        if (!this.isRightCell()) {
            // add 1 to right
            this.rightCell().numFlagged++;
            setSolved(this.rightCell());


            if (!this.isTopCell()) {
                // add 1 to top right
                this.topRightCell().numFlagged++;
                setSolved(this.topRightCell());
            }
            if (!this.isBottomCell()) {
                // add 1 to bottom right
                this.bottomRightCell().numFlagged++;
                setSolved(this.bottomRightCell());
            }
        }

        if (!this.isBottomCell()) {
            // add 1 to bottom
            this.bottomCell().numFlagged++;
            setSolved(this.bottomCell());
        }

        if (!this.isLeftCell()) {
            // add 1 to left
            this.leftCell().numFlagged++;
            setSolved(this.leftCell());
            if (!this.isTopCell()) {
                // add 1 to top left
                this.topLeftCell().numFlagged++;
                setSolved(this.topLeftCell());
            }
            if (!this.isBottomCell()) {
                // add 1 to bottom left
                this.bottomLeftCell().numFlagged++;
                setSolved(this.bottomLeftCell());
            }
        }

        if (!this.isTopCell()) {
            // add 1 to top
            this.topCell().numFlagged++;
            setSolved(this.topCell());
        }
    }



}





let timeCounterId;
function timeCounter() {
    timeCounterId = setInterval(() => {
        time++;
        timeDisplay.innerHTML = time;
    }, 1000)
}

// show and hide custom button
document.querySelector('#customInput').style.display = 'none';
function showCustom() {
    for (let option of gridOption) {
        option.addEventListener('click', function (e) {
            if (option.id !== 'custom') {
                document.querySelector('#customInput').style.display = 'none';
            }
            else {
                document.querySelector('#customInput').style.display = 'block';
            }
        })
    }
}
showCustom();

function gridChoosing() {
    if (gridOption[0].checked) {
        height = 10;
        width = 10;
        bombAmount = 10;
        return;
    }
    if (gridOption[1].checked) {
        height = 16;
        width = 16;
        bombAmount = 40;
        return;

    }
    if (gridOption[2].checked) {
        height = 16;
        width = 30;
        bombAmount = 99;
        return;

    }
    if (gridOption[3].checked) {
        // getting input for bombAmount, height, width of the board
        heightInput.addEventListener('input', function (e) {
            height = parseInt(heightInput.value);
        })
        // do this in case user enter input first and the click radio
        height = parseInt(heightInput.value);
        widthInput.addEventListener('input', function (e) {
            width = parseInt(widthInput.value);
        })
        width = parseInt(widthInput.value);
        bombAmountInput.addEventListener('input', function (e) {
            bombAmount = parseInt(bombAmountInput.value);
        })
        bombAmount = parseInt(bombAmountInput.value);
    }

}

// create Board
function makeBoard() {
    gridChoosing();
    bombCounter = bombAmount;
    bombCounterDisplay.innerHTML = bombCounter;
    // setting up the grid
    grid.style.height = `${height * 40}px`;
    grid.style.width = `${width * 40}px`;


    // making an array with mixing bombs and blank
    let id = 0;
    let bombsArray = Array(bombAmount).fill('bomb');
    let emptyArray = Array(width * height - bombAmount).fill('valid');
    const gameArray = emptyArray.concat(bombsArray);
    const shuffleArray = gameArray.sort(() => Math.random() - 0.5);

    // setup each cell in
    for (let i = 0; i < height; i++) {
        let rowCells = [];
        for (let j = 0; j < width; j++) {
            let newCell = new Cell(shuffleArray[id], i, j);
            newCell.display.classList.add(shuffleArray[id++]);
            // setting click listener for each square
            newCell.display.addEventListener('click', function (e) {
                click(newCell);
                if (autoSolve.checked){
                    if (solveLaterCells.length > 0) {
                        do {
                            previousLength = solveLaterCells.length;
                            for (let cell of solveLaterCells) {
                                solve(cell);
                            }
                        } while (previousLength !== solveLaterCells.length)
                    }
                }
                

            })
            newCell.display.addEventListener('long-press', function (e) {
                e.preventDefault();
                addFlag(newCell);
            });
            newCell.display.oncontextmenu = function (e) {
                e.preventDefault();
                addFlag(newCell);
            }
            // add the cell to the grid
            grid.appendChild(newCell.display);
            rowCells.push(newCell);
        }
        board.push(rowCells);
    }
    // add numbers
    addNumbers();

}

solveButton.addEventListener('click', function(e){
    autoSolve.checked=true;
    if (solveLaterCells.length > 0) {
        do {
            previousLength = solveLaterCells.length;
            for (let cell of solveLaterCells) {
                solve(cell);
            }
        } while (previousLength !== solveLaterCells.length)
    }
})




function addNumbers() {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let numBombs = 0;
            // do nothing when the cell is a bomb
            if (board[i][j].status === 'bomb') {
                continue;
            }
            // check for the right cell
            if (j < width - 1 && board[i][j + 1].status === 'bomb') numBombs++;
            // check for the bottom right cell
            if (i < height - 1 && j < width - 1 && board[i + 1][j + 1].status === 'bomb') numBombs++;
            //check for the bottom cell
            if (i < height - 1 && board[i + 1][j].status === 'bomb') numBombs++;
            // check for the bottom left cell
            if (i < height - 1 && j > 0 && board[i + 1][j - 1].status === 'bomb') numBombs++;
            // check for the left cell
            if (j > 0 && board[i][j - 1].status === 'bomb') numBombs++;
            // check for the top left cell
            if (i > 0 && j > 0 && board[i - 1][j - 1].status === 'bomb') numBombs++;
            // check for the top cell
            if (i > 0 && board[i - 1][j].status === 'bomb') numBombs++;
            // check for the top right cell
            if (i > 0 && j < width - 1 && board[i - 1][j + 1].status === 'bomb') numBombs++;
            board[i][j].numBombs = numBombs;

            if (board[i][j].numBombs == 0) {
                board[i][j].solved = true;
            }
        }
    }
}

function addFlag(cell) {
    if (cell === null) return;
    if (isGameOver) return;
    if (!cell.revealed) {
        if (cell.flagged) {
            // turn this on for none auto
            if (!autoSolve.checked) {
                removeFlag(cell);
            }
            return;
        }
        else {
            cell.flagged = true;
            bombCounterDisplay.innerHTML = --bombCounter;
            cell.display.src = "img/flagged.png";
            cell.updateFlagged();
            solveSurroundCells(cell);
        }

    }


}

function solveSurroundCells(cell) {
    solve(cell.rightCell());
    solve(cell.bottomRightCell());
    solve(cell.bottomCell());
    solve(cell.bottomLeftCell());
    solve(cell.leftCell());
    solve(cell.topLeftCell());
    solve(cell.topCell());
    solve(cell.topRightCell());
}

function removeFlag(cell) {
    cell.flagged = false;
    bombCounterDisplay.innerHTML = ++bombCounter;
    cell.display.src = "img/facingDown.png";
}



function solve(cell) {
    if (cell === null) return;
    if (cell.available === cell.numBombs) {
        if (autoSolve.checked) {
            flagSurroundCells(cell);
            cell.solved = true;
        }
        
    }
    else if (cell.numBombs == cell.numFlagged) {
        if (autoSolve.checked) {
            clickSurroundCells(cell);
            cell.solved = true;
        }
        
    }
    if (!cell.solved && cell.revealed && !cell.flagged && !solveLaterCells.includes(cell)) {
        solveLaterCells.push(cell);
    }
    else if (cell.solved) {
        // remove the solved cell
        let index = solveLaterCells.indexOf(cell);
        if (index > -1) {
            solveLaterCells.splice(index, 1);
        }
    }

}

function flagSurroundCells(cell) {
    addFlag(cell.rightCell());
    addFlag(cell.bottomRightCell());
    addFlag(cell.bottomCell());
    addFlag(cell.bottomLeftCell());
    addFlag(cell.leftCell());
    addFlag(cell.topLeftCell());
    addFlag(cell.topCell());
    addFlag(cell.topRightCell());
}

function clickSurroundCells(cell) {
    click(cell.rightCell());
    click(cell.bottomRightCell());
    click(cell.bottomCell());
    click(cell.bottomLeftCell());
    click(cell.leftCell());
    click(cell.topLeftCell());
    click(cell.topCell());
    click(cell.topRightCell());
}



// click on board actions
function click(cell) {
    // base cases
    if (isGameOver || cell === null || cell.revealed) return;
    if (cell.flagged === true) return;

    // game over when click the bomb
    if (cell.status === 'bomb') {
        gameOver(false, cell);
    }

    else {
        if (cell.numBombs != 0) {
            if (!cell.revealed) {
                clicked++;
                // start time on the first click
                if (clicked === 1) {
                    timeCounter();
                }
                showCell(cell);
                cell.updateAvailability();
            }

            if (cell.available >= 0) {
                solve(cell);
            }
        }
        else {
            if (!cell.revealed) {
                // start time on the first click
                clicked++;
                if (clicked === 1) {
                    timeCounter();
                }
                showCell(cell);
                cell.updateAvailability();
                return checkCell(cell);

            }

        }



    }

    if (clicked === width * height - bombAmount) {
        gameOver(true, cell)
    }
}





function setSolved(cell) {
    if (cell.numFlagged == cell.numBombs) {
        cell.solved = true;
        // remove the solved cell
        let index = solveLaterCells.indexOf(cell);
        if (index > -1) {
            solveLaterCells.splice(index, 1);
        }
    }
    else {
        if (!cell.solved && cell.revealed && !cell.flagged && !solveLaterCells.includes(cell)) {
            solveLaterCells.push(cell);
        }

    }
}

function showCell(cell) {
    cell.revealed = true;
    
    if (cell.numBombs===0){
        cell.display.src = "img/0.png";
    }
    else if (cell.numBombs===1){
        cell.display.src = "img/1.png";
    }
    else if (cell.numBombs===2){
        cell.display.src = "img/2.png";
    }
    else if (cell.numBombs===3){
        cell.display.src = "img/3.png";
    }
    else if (cell.numBombs===4){
        cell.display.src = "img/4.png";
    }
    else if (cell.numBombs===5){
        cell.display.src = "img/5.png";
    }
    else if (cell.numBombs===6){
        cell.display.src = "img/6.png";
    }
    else if (cell.numBombs===7){
        cell.display.src = "img/7.png";
    }
    else {
        cell.display.src = "img/8.png";
    }
    
}


function solveNext(cell) {

    if (autoSolve.checked) {
        if (cell.revealed && cell.numBombs != 0) {
            solve(cell);
        }
        else {
            if (!cell.revealed) {
                click(cell);
            }
        }
    }
    else {
        click(cell);
    }




}

// check neighbor cell when click the 0 cell
function checkCell(cell) {
    // setTimeout(() => {
    // await sleep(0.015);
    // check the right cell
    if (!cell.isRightCell()) {
        solveNext(cell.rightCell());
    }
    //  check the bottom right cell
    if (!cell.isRightCell() && !cell.isBottomCell()) {
        solveNext(cell.bottomRightCell());
    }
    // check the bottom cell
    if (!cell.isBottomCell()) {
        solveNext(cell.bottomCell());
    }
    //  check the bottom left cell
    if (!cell.isBottomCell() && !cell.isLeftCell()) {
        solveNext(cell.bottomLeftCell());
    }
    // check the left cell
    if (!cell.isLeftCell()) {
        solveNext(cell.leftCell());
    }
    //  check the top left cell
    if (!cell.isTopCell() && !cell.isLeftCell()) {
        solveNext(cell.topLeftCell());
    }
    //  check the top right cell
    if (!cell.isTopCell() && !cell.isRightCell()) {
        solveNext(cell.topRightCell());
    }
    // check the top cell
    if (!cell.isTopCell()) {
        solveNext(cell.topCell());
    }

    // }, 15)
}













function gameOver(win, cellClicked) {
    clearInterval(timeCounterId);
    if (win) {
        console.log('YOU WON!!');
    }
    // reveal the bombs (unhide the cover)
    else {
        let bombCells = document.querySelectorAll('.bomb');
        for (let bombCell of bombCells) {
            console.log(bombCell);
            bombCell.src = "img/bomb.png";
        }
        cellClicked.display.src= "img/exploded.png"
    }
    isGameOver = true;

}

resetButton.addEventListener('click', function () {
    reset();
})

function reset() {
    isGameOver = false;
    const cells = document.querySelectorAll('.grid img');
    for (let chim of cells) {
        chim.remove();
    }
    bombCounter = 0;
    board = [];
    solveLaterCells = [];
    makeBoard();
    clicked = 0;
    time = 0;
    timeDisplay.innerHTML = 0;
}

makeBoard();
