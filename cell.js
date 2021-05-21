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

