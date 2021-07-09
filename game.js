//DOMContentLoaded allows the HTML file to fully load before running the JS. One can also do this by placing the <script> at the bottom of HTML file.
document.addEventListener('DOMContentLoaded', () => {
    //cache - set variable grid to select the .grid class in the HTML/DOM file
    const grid = document.querySelector('.grid');
    //cache - set variable width to 10 squares
    let width = 10;
    let bombAmount = 20;
    let flags = 0;
    let squares = [];
    let isGameOver = false;

    // This function returns a 9 element list with all of the surrounding
    // squares. It starts at the top left and goes in a clock wise direction.
    // If a square in that position doesn't exist, it will return null in that
    // position.
    function getNearbySquares(square) {
        let surroundingSquares = []
        squareId = parseInt(square.id);

        const isLeftEdge = (squareId % width === 0);
        const isRightEdge = (squareId % width === width - 1);
        const isTopEdge = (squareId <= 9);
        const isBottomEdge = (squareId >= width * (width - 1));

        if (!isTopEdge && !isLeftEdge ) {
            surroundingSquares.push(squares[squareId - width - 1]);
        } else {
            surroundingSquares.push(null);
        }

        if (!isTopEdge) {
            surroundingSquares.push(squares[squareId - width]);
        } else {
            surroundingSquares.push(null);
        }

        if (!isTopEdge && !isRightEdge) {
            surroundingSquares.push(squares[squareId - width + 1]);
        } else {
            surroundingSquares.push(null);
        }

        if (!isRightEdge) {
            surroundingSquares.push(squares[squareId + 1]);
        } else {
            surroundingSquares.push(null);
        }

        if (!isBottomEdge && !isRightEdge) {
            surroundingSquares.push(squares[squareId + width + 1]);
        } else {
            surroundingSquares.push(null);
        }

        if (!isBottomEdge) {
            surroundingSquares.push(squares[squareId + width]);
        } else {
            surroundingSquares.push(null);
        }

        if (!isBottomEdge && !isLeftEdge) {
            surroundingSquares.push(squares[squareId + width - 1]);
        } else {
            surroundingSquares.push(null);
        }

        if (!isLeftEdge) {
            surroundingSquares.push(squares[squareId - 1]);
        } else {
            surroundingSquares.push(null);
        }

        console.log(squareId);
        console.log(isLeftEdge);
        console.log(isTopEdge);
        console.log(isRightEdge);
        console.log(isBottomEdge);
        console.log(surroundingSquares);

        return surroundingSquares;
    }

    function countNearbyBombs(square){
        if (square.classList.contains('valid')) {
            let total = 0;
            let sqs = getNearbySquares(square);

            // Why can't I do
            // for (sq in sqs) { ?
            for (let i = 0; i <= 9; i++) {
                if (sqs[i] == null) {
                    continue;
                }

                if (sqs[i].classList.contains('bomb')) {
                    total++;
                }
            }

            square.setAttribute('totalBombs', total);
        }
    }


    //**create board
    function createBoard() {
        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width*width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() -0.5);

        //for loop to append divs/create squares
        for (let i = 0; i < width * width; i++) {
            //creates a div/square
            let square = document.createElement('div');
            //sets an ID to select and manipulate div later. The 'i' in setAttribute() gives square an ID equivelant to the current iteration count.
            square.setAttribute('id', i);
            //selects the new square/div element on line 22, per new square/div element we add a class equivelant to the relevant string in the shuffledArray on line 16.
            square.classList.add(shuffledArray[i])
            //use the grid constant to append the new child within the parent grid/div in the HTML/DOM file.
            grid.appendChild(square);
            //push the newly created square to the squares array on line 8 for later selection and manipulation
            squares.push(square);

            //**normal click
            square.addEventListener('click', function(e) {
                click(square);
                console.log(square);
            });

            //cntrl and left click
            square.oncontextmenu = function(e){
                e.preventDefault();
                addFlag(square);
            }

        }
    }

    createBoard();

    for (let i = 0; i < squares.length; i++) {
        countNearbyBombs(squares[i]);
    }

    //add flag with right click
    function addFlag(square){
        if(isGameOver){
            return;
        }
        if(!square.classList.contains('checked') && (flags < bombAmount)) {
            if(!square.classList.contains('flag')){
                square.classList.add('flag');
                square.innerHTML ='🚩'
                flags ++;
                checkForWin();
            } else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags --;
            }
        }
    }

    //click on square actions
    function click(square) {
        if(isGameOver) {
            return;
        };
        if (square.classList.contains('checked') || square.classList.contains('flag')){
            return;
        };
        if(square.classList.contains('bomb')){
           gameOver(square); //STYLE THIS LATER!!!
        } else {
            let total = square.getAttribute('totalBombs');
            if (total != 0) {
                square.classList.add('checked');
                square.innerHTML = total;
                return;
            }
            checkSquare(square)
        }
        square.classList.add('checked');
    }    

    //check neigboring squares once square is clicked.
    function checkSquare(square){
        setTimeout(() => {
            sqs = getNearbySquares(square)

            for (let i = 0; i <= 9; i++) {
                console.log(sqs[i])
                if (sqs[i] === null) {
                    continue;
                }

                click(sqs[i]);
            }
        }, 10)
    }

    //game over
    function gameOver(square) {
        console.log('BOOM! Game Over!');
        isGameOver = true;

        //show ALL the bombs
        squares.forEach(square => {
         if (square.classList.contains('bomb')) {
             square.innerHTML = '💣'
         }   
        })
    }

    //check for win
    function checkForWin() {
        let matches = 0
        for (let i = 0; i < squares.length; i++){
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
                matches ++
            }
            if (matches === bombAmount){
                console.log('YOU WON!');
            }
        }
    }
})
