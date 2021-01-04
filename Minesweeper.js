// all the html components
const grid = document.querySelector('.grid');
const resetButton = document.querySelector('#reset');
const heightInput = document.getElementById('height');
const widthInput = document.getElementById('width');
const bombAmountInput = document.getElementById('bombInput');
const gridOption = document.getElementsByName('grid-option');
const bombCounterDisplay = document.querySelector('#bombCounter');
const timeDisplay = document.querySelector('#time');

// game components
let bombAmount= 10;
let height = 10;
let width = 10;
let board = [];
let isGameOver= false;
let clicked =0;
let bombCounter = 10;
let time=0;



class Cell{
    constructor(status,row,col){
        this.status = status;
        this.row= row;
        this.col=col;
        this.revealed = false;
        this.flagged = false;
        this.display = document.createElement('div');
        this.numBombs = 0;
        this.available = 8;
    }
}

function isLeftCell(cell){
    return cell.col === 0;
}
function isRightCell(cell){
    return cell.col === width-1;
}
function isTopCell(cell){
    return cell.row === 0;
}
function isBottomCell(cell){
    return cell.row === height-1; 
}



let timeCounterId;
function timeCounter(){
    timeCounterId = setInterval(()=>{
        time++;
        timeDisplay.innerHTML = time;
    },1000)
}

// show and hide custom button
document.querySelector('#customInput').style.display = 'none';
function showCustom(){
    for (let option of gridOption){
        option.addEventListener('click', function(e){
            if (option.id!=='custom'){
                document.querySelector('#customInput').style.display = 'none';
            }
            else{
                document.querySelector('#customInput').style.display = 'block';
            }
        })
    }  
}
showCustom();

function gridChoosing(){
    if (gridOption[0].checked){
        height = 10;
        width = 10;
        bombAmount = 10;
        return;
    }
    if (gridOption[1].checked){
        height = 16;
        width = 16;
        bombAmount = 40;
        return;
        
    }
    if (gridOption[2].checked){
        height=16;
        width= 30;
        bombAmount =99;
        return;
        
    }
    if (gridOption[3].checked){
        // getting input for bombAmount, height, width of the board
        heightInput.addEventListener('input', function(e){
            height = parseInt(heightInput.value);
        })
        // do this in case user enter input first and the click radio
        height = parseInt(heightInput.value);
        widthInput.addEventListener('input', function(e){
            width = parseInt(widthInput.value);
        })
        width = parseInt(widthInput.value);
        bombAmountInput.addEventListener('input', function(e){
            bombAmount = parseInt(bombAmountInput.value);
        })
        bombAmount = parseInt(bombAmountInput.value);
    }
    
}

// create Board
function makeBoard(){   
    gridChoosing();
    bombCounter=bombAmount;
    bombCounterDisplay.innerHTML = bombCounter;
    // setting up the grid
    grid.style.height = `${height*40}px`;
    grid.style.width = `${width*40}px`;
    
    
    // making an array with mixing bombs and blank
    let id = 0;
    let bombsArray = Array(bombAmount).fill('bomb');
    let emptyArray = Array(width*height - bombAmount).fill('valid');
    const gameArray = emptyArray.concat(bombsArray);
    const shuffleArray = gameArray.sort(()=> Math.random() -0.5);
    
    // setup each cell in
    for (let i = 0; i< height; i++){
        let rowCells = [];
        for(let j=0; j<width; j++){            
            let newCell = new Cell(shuffleArray[id],i,j);
            newCell.display.classList.add(shuffleArray[id++]);
            // setting click listener for each square
            newCell.display.addEventListener('click', function(e){
                click(newCell);
            })
            newCell.display.addEventListener('long-press', function(e) {
                e.preventDefault();
                addFlag(newCell);
            });
            newCell.display.oncontextmenu = function(e){
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



function addNumbers(){
    for(let i=0; i<height; i++){
        for (let j=0; j<width; j++){
            let numBombs=0;
            // do nothing when the cell is a bomb
            if(board[i][j].status === 'bomb'){
                continue;
            }
            // check for the right cell
            if (j<width-1 && board[i][j+1].status==='bomb') numBombs++;
            // check for the bottom right cell
            if (i<height-1 && j<width-1 && board[i+1][j+1].status==='bomb') numBombs++;
            //check for the bottom cell
            if (i<height-1 && board[i+1][j].status==='bomb') numBombs++;
            // check for the bottom left cell
            if (i<height-1 && j>0 && board[i+1][j-1].status==='bomb') numBombs++;
            // check for the left cell
            if (j>0 && board[i][j-1].status==='bomb') numBombs++;
            // check for the top left cell
            if (i>0 && j>0 && board[i-1][j-1].status==='bomb') numBombs++;
            // check for the top cell
            if (i>0 && board[i-1][j].status==='bomb') numBombs++;
            // check for the top right cell
            if (i>0 && j<width-1 && board[i-1][j+1].status==='bomb') numBombs++;
            board[i][j].numBombs = numBombs;
        }
    }
}



function addFlag(cell){
    if (isGameOver)return;
    if (cell.revealed===false){
        cell.flagged = !cell.flagged;
        if (cell.flagged===true){
            bombCounterDisplay.innerHTML = --bombCounter;
            cell.display.innerHTML = '🚩';
        }
        else{
            bombCounterDisplay.innerHTML = ++bombCounter;
            cell.display.innerHTML = '';
        }
    } 
}


// click on board actions
function click(cell){
    // base cases
    if (isGameOver) return;
    if (cell.revealed===true || cell.flagged===true) return;

    // start time on the first click
    if (clicked===1){
        timeCounter();
    }
    
    if (cell.status==='bomb'){
        gameOver(false);
    }

    else {
        clicked++;
        if (cell.numBombs!=0){
            showCell(cell);
            
        }
        else{
            // not neccessary
            checkCell(cell)
            cell.revealed=true;
            cell.display.classList.add('checked');
        }
    }
    if (clicked === width*height - bombAmount){
        gameOver(true)
    }  
}

function showCell(cell){
    cell.display.innerHTML = cell.numBombs;
    cell.revealed = true;
    cell.display.classList.add('checked');
}

// check neighbor cell when click the 0 cell
function checkCell(cell){
    setTimeout(()=> {        
        // check the right cell
        if (!isRightCell(cell)){
            click(board[cell.row][cell.col+1]);
        }
        //  check the bottom right cell
        if (!isRightCell(cell) && !isBottomCell(cell)){
            click(board[cell.row+1][cell.col+1]);
        }
        // check the bottom cell
        if (!isBottomCell(cell)){
            click(board[cell.row+1][cell.col]);
        }
        //  check the bottom left cell
        if (!isBottomCell(cell) && !isLeftCell(cell)){
            click(board[cell.row+1][cell.col-1]);
        }
        // check the left cell
        if (!isLeftCell(cell)){
            click(board[cell.row][cell.col-1]);
        }
        //  check the top left cell
        if (!isTopCell(cell) && !isLeftCell(cell)){
            click(board[cell.row-1][cell.col-1]);
        }
        //  check the top right cell
        if (!isTopCell(cell) && !isRightCell(cell)){
            click(board[cell.row-1][cell.col+1]);
        }
        // check the top cell
        if (!isTopCell(cell)){
            click(board[cell.row-1][cell.col]);
        }
    },10) 
}



function solve(){

}











function gameOver(win){
    clearInterval(timeCounterId);
    if (win){
        alert('YOU WON!!')
    }
    // reveal the bombs (unhide the cover)
    else{
        let bombCells = document.querySelectorAll('.bomb');
        for(let bombCell of bombCells){
            bombCell.innerHTML = '💣';
            bombCell.style.background = 'orange';
        }
    }
    isGameOver = true;
    
}

resetButton.addEventListener('click', function(){
    reset();
})

function reset(){
    isGameOver = false;
    const cells = document.querySelectorAll('.grid div');
    for (let chim of cells){
        chim.remove();
    }
    bombCounter = 0;
    board=[];
    makeBoard();
    clicked = 0; 
    time=0;
    timeDisplay.innerHTML=0;
}

makeBoard();
