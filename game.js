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
            const square = document.createElement('div');
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
            });

            //cntrl and left click
            square.oncontextmenu = function(e){
                e.preventDefault();
                addFlag(square);
            }

        }

         //**calculate number of bombs
        for (let i = 0; i < squares.length; i++){
            let total = 0;
            const isLeftEdge =(i % width === 0);
            const isRightEdge = (i % width === width -1);
            
            if (squares[i].classList.contains('valid')) {
                //if squares index is greater than zero, and is not LeftEdge, check if square to left is bomb.
                if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')){
                    total ++
                }
                //if squares index is greater than 9, and is not RightEdge, check if square to up-right is bomb.
                if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')){
                    total ++
                }
                //if squares index is greater than 10, check if square to up is bomb. - should trigger
                if (i > 10 && squares[i -width].classList.contains('bomb')){
                    total ++
                }
                //if squares index is greater than 11, and is not LeftEdge, check if square to up-left is bomb.
                if(i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')){
                    total ++
                }
                //if squares index is less than 98, and is not RightEdge, check if square to right is bomb.
                if(i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')){
                    total++
                }
                //if squares index is less than 90 and is not LeftEdge, check if square to down-left is bomb.
                if(i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')){
                    total++
                }
                //if squares index is less than 88 and is not LeftEdge, check if square to down-right is bomb.
                if(i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')){
                    total++
                }
                //if squares index is less than 89, check if square to down is bomb.
                if (i < 89 && squares[i +width].classList.contains('bomb')){
                    total++
                }
                squares[i].setAttribute('totalBombs', total);
            }
        }

    }
    createBoard();

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
        let currentId = square.id
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
            checkSquare(square, currentId)
        }
        square.classList.add('checked');
    }    

    //check neigboring squares once square is clicked.
    function checkSquare(square,currentId){
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width -1)

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 9 && !isRightEdge){
                const newId = squares[parseInt(currentId) +1 -width].id
                const newSquare = document.getElementById(newId)
                click(newSquare);
            }
            if (currentId > 10){
                const newId = squares[parseInt(currentId) -width].id // keep an eye on this line.
                const newSquare = document.getElementById(newId)
                click(newSquare);
            } 
            if (currentId > 11 && !isLeftEdge){
                const newId = squares[parseInt(currentId) -1 -width].id
                const newSquare = document.getElementById(newId)
                click(newSquare);
            }                         
            if (currentId < 98 && !isRightEdge){
                const newId = squares[parseInt(currentId) +1].id
                const newSquare = document.getElementById(newId)
                click(newSquare);
            }
            if (currentId < 90 && !isLeftEdge){
                const newId = squares[parseInt(currentId) -1 +width].id
                const newSquare = document.getElementById(newId)
                click(newSquare);
            }
            if (currentId < 88 && !isRightEdge){
                const newId = squares[parseInt(currentId) +1 +width].id
                const newSquare = document.getElementById(newId)
                click(newSquare);
            }    
            if (currentId < 89){
                const newId = squares[parseInt(currentId) +width].id
                const newSquare = document.getElementById(newId)
                click(newSquare);
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