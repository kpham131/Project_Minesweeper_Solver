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

!function(e,t){"use strict";var n=null,a="ontouchstart"in e||navigator.MaxTouchPoints>0||navigator.msMaxTouchPoints>0,i=a?"touchstart":"mousedown",o=a?"touchend":"mouseup",m=a?"touchmove":"mousemove",r=0,u=0,s=10,c=10;function l(e){var n;d(),n=e,e=a&&n.touches&&n.touches[0]?n.touches[0]:n,this.dispatchEvent(new CustomEvent("long-press",{bubbles:!0,cancelable:!0,detail:{clientX:e.clientX,clientY:e.clientY},clientX:e.clientX,clientY:e.clientY,offsetX:e.offsetX,offsetY:e.offsetY,pageX:e.pageX,pageY:e.pageY,screenX:e.screenX,screenY:e.screenY}))||t.addEventListener("click",function e(n){t.removeEventListener("click",e,!0),function(e){e.stopImmediatePropagation(),e.preventDefault(),e.stopPropagation()}(n)},!0)}function v(a){d(a);var i=a.target,o=parseInt(function(e,n,a){for(;e&&e!==t.documentElement;){var i=e.getAttribute(n);if(i)return i;e=e.parentNode}return a}(i,"data-long-press-delay","1500"),10);n=function(t,n){if(!(e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame&&e.mozCancelRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame))return e.setTimeout(t,n);var a=(new Date).getTime(),i={},o=function(){(new Date).getTime()-a>=n?t.call():i.value=requestAnimFrame(o)};return i.value=requestAnimFrame(o),i}(l.bind(i,a),o)}function d(t){var a;(a=n)&&(e.cancelAnimationFrame?e.cancelAnimationFrame(a.value):e.webkitCancelAnimationFrame?e.webkitCancelAnimationFrame(a.value):e.webkitCancelRequestAnimationFrame?e.webkitCancelRequestAnimationFrame(a.value):e.mozCancelRequestAnimationFrame?e.mozCancelRequestAnimationFrame(a.value):e.oCancelRequestAnimationFrame?e.oCancelRequestAnimationFrame(a.value):e.msCancelRequestAnimationFrame?e.msCancelRequestAnimationFrame(a.value):clearTimeout(a)),n=null}"function"!=typeof e.CustomEvent&&(e.CustomEvent=function(e,n){n=n||{bubbles:!1,cancelable:!1,detail:void 0};var a=t.createEvent("CustomEvent");return a.initCustomEvent(e,n.bubbles,n.cancelable,n.detail),a},e.CustomEvent.prototype=e.Event.prototype),e.requestAnimFrame=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||function(t){e.setTimeout(t,1e3/60)},t.addEventListener(o,d,!0),t.addEventListener(m,function(e){var t=Math.abs(r-e.clientX),n=Math.abs(u-e.clientY);(t>=s||n>=c)&&d()},!0),t.addEventListener("wheel",d,!0),t.addEventListener("scroll",d,!0),t.addEventListener(i,function(e){r=e.clientX,u=e.clientY,v(e)},!0)}(window,document);

class Cell{
    constructor(status,row,col){
        this.status = status;
        this.row= row;
        this.col=col;
        this.revealed = false;
        this.flagged = false;
        this.display = document.createElement('div');
        this.numBombs = 0;
    }
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
        widthInput.addEventListener('input', function(e){
            width = parseInt(widthInput.value);
        })
        bombAmountInput.addEventListener('input', function(e){
            bombAmount = parseInt(bombAmountInput.value);
        })
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

    clicked++;
    if (clicked===1){
        timeCounter();
    }
    

    if (cell.status==='bomb'){
        gameOver(false);
    }
    else {
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
        if (cell.col<width-1){
            click(board[cell.row][cell.col+1]);
        }
        //  check the bottom right cell
        if (cell.col<width-1 && cell.row<height-1){
            click(board[cell.row+1][cell.col+1]);
        }
        // check the bottom cell
        if (cell.row<height-1){
            click(board[cell.row+1][cell.col]);
        }
        //  check the bottom left cell
        if (cell.row<height-1 && cell.col>0){
            click(board[cell.row+1][cell.col-1]);
        }
        // check the left cell
        if (cell.col>0){
            click(board[cell.row][cell.col-1]);
        }
        //  check the top left cell
        if (cell.row>0 && cell.col>0){
            click(board[cell.row-1][cell.col-1]);
        }
        //  check the top right cell
        if (cell.row>0 && cell.col<width-1){
            click(board[cell.row-1][cell.col+1]);
        }
        // check the top cell
        if (cell.row>0){
            click(board[cell.row-1][cell.col]);
        }
    },10) 
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
