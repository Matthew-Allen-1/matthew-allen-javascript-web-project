// Initialize variables.
let maxColumns = 6, colClick = 0, numClicked = 0, totalClicked = 0, 
columns = 6, turn = 1, winTotal = 20, level = 5,
counter = 0, index = 0, compIndex = 0, gameOver = 0;

// Set DOM elements.
const   
    getColumns = document.querySelector('.get-columns'),
    getFirst = document.querySelector('.get-first'),
    getLevel = document.querySelector('.get-level'),
    getPlrName = document.querySelector('.get-name'),
    settings = document.querySelector('#settings'),
    settingsButton = document.querySelector('#settings-button'),
    confirmMoveButton = document.querySelector('#confirm-move-button'),
    playAgainButton = document.querySelector('#play-again-button'),
    statsButton = document.querySelector('#see-stats-button'),
    changeSettingsButton = document.querySelector('#change-settings-button'),
    reloadButton = document.querySelector('#reload-button'),
    message1 = document.querySelector('.message1'),
    message2 = document.querySelector('.message2'),
    message3 = document.querySelector('.message3'),
    boxContainer = document.getElementById('box-container'),
    bookList = document.getElementById('book-list');
    

//Initialize arrays.
const 
    box = [], col = [], tempCol = [], compCol = [], rowsStruck = [],
    winValue = [], player = [], countArr = [], newList = [];
    for (let q = 0; q < 5040; q++) {winValue[q] = 0;}
    for (i = 0; i < maxColumns; i++) {
        box.push([]); col.push(i + 1); tempCol.push(i + 1); compCol.push(i + 1); rowsStruck.push(0);
    }

//Player constructor.
function Player(name, wins, losses) {
    this.name = name;
    this.wins = wins;
    this.losses = losses;
    this.increaseWins = function() {this.wins++;}
    this.increaseLosses = function() {this.losses++}
    this.reset = function () {this.name = ''; this.wins = 0; this.losses=0;}
}

// Set Default Values and Initialize Grid
player[0] = new Player('COMPUTER', 0, 0);
player[1] = new Player('Matthew', 0, 0);
confirmMoveButton.value = "Confirm My Move";
setMessage('Please select the boxes you would like to strike out.', 'black', 1);
setMessage(`${player[turn].name}, it is your turn!`, 'green', 2);
confirmMoveButton.disabled = true;
drawBoxes();

//Node constructor
class node {
    constructor (element, state) {
        this.element = element;
        this.x = element.querySelectorAll('.x');
        this.state = state;
    }
    clearBox() {this.element.style = "display: none;";}
    displayBox() {this.element.style = "display: table-cell;";}

    //Draw or clear out X's function
    drawX(state) {
        for (let q = 0; q < 2; q++) {
            switch (state) {
                case 0: this.state = 0; this.x[q].style = "display: none;"; break;
                case 1: this.state = 1; this.x[q].style = "display: inline-block; stroke: lightblue; stroke-width: 2;"; break;
                case 2: this.state = 2; this.x[q].style = "display: inline-block; stroke: darkblue; stroke-width: 3;"; break;
                case 3: this.state = 1; this.x[q].style = "display: inline-block; stroke: lightgreen; stroke-width: 2;"; break;
                case 4: this.state = 2; this.x[q].style = "display: inline-block; stroke: darkgreen; stroke-width: 3;"; break;
                case 5: this.state = 3; this.x[q].style = "display: inline-block; stroke: darkred; stroke-width: 3;"; break;
            }
        }
    }
    
     // Listen for the user to click on a box.
    listenBoxClick(i, j) {
        this.element.addEventListener('click', function() {
            if (turn == 1) {
                if(colClick != 0 && j + 1 != colClick && numClicked > 0) {setMessage(`I am sorry, but you may only strike out boxes in a single column.`, 'red', 2);}
                else {
                    setMessage(`${player[turn].name}, it is your turn!`, 'green', 2);
                    colClick = j + 1;
                    console.log(`The user just clicked on the row ${i + 1}, column ${j + 1} box.`);
                    console.log('This.state = ' + box[i][j].state);
                    if(box[i][j].state == 0) {box[i][j].drawX(1); numClicked++;}
                    else if(box[i][j].state == 1) {box[i][j].drawX(0); numClicked--;}
                    else {setMessage(`I am sorry, but that box has already been selected.`, 'red', 2);}
                }
            }
        });
    }
}

assignBoxElements();

// Listen for user to confirm game settings.
settingsButton.addEventListener('click', function() {
    columns = parseInt(getColumns.value); level = parseInt(getLevel.value); 
    turn = Number(document.getElementById('yes').checked); player[1].name = String(getPlrName.value);
    if (isNaN(columns) ) {setMessage('Please enter the number of columns!', 'red', 3);}
    else if (columns > 6 || columns < 2) {setMessage('Please enter a number of columns between 2 and 6!', 'red', 3);}
    else if (isNaN(level)) {setMessage('Please enter the level of difficulty!', 'red', 3);}
    else if (level < 0 || level > 10) {setMessage('Please enter a level of difficulty between 0 and 10!', 'red', 3);}
    else if (player[1].name == '') {setMessage("Please enter the player's name!", 'red', 3);}
    else {
        setMessage("Thank you for selecting your game settings!", 'green', 3);
        winTotal = columns * (columns + 1) / 2 - 1;
        getColumns.disabled = true; getFirst.disabled = true; 
        getLevel.disabled = true; getPlrName.disabled = true; 
        settingsButton.disabled = true; confirmMoveButton.disabled = false;
        setWinValues();

        // Clear out any unwanted columns.
        for (let i = maxColumns; i > 1; i--) {
            if (columns < i) {
                newList.push(bookList.childNodes[0]);
                bookList.removeChild(bookList.childNodes[0]);
                for (j = 0; j <= i - 1; j++) {box[j][i-1].clearBox();}
                col[i - 1] = 0;
            }
        }
        playAgain();
    }
});

 // Listen for the user to click on a box.
for (let i = 0; i < maxColumns; i++) {
    for (let j = i; j < maxColumns; j++) {box[i][j].listenBoxClick(i, j);};
}

// Listen for the user to confirm their move.
confirmMoveButton.addEventListener('click', function() {
    if (turn == 0) {
        //Complete Computer's Previous Turn
        confirmMove();
        if (totalClicked == winTotal) {gameWon(turn); return;}
        confirmMoveButton.value = "Confirm My Move";
        setMessage('Please select the boxes you would like to strike out.', 'black', 1);
    }
    else {
        //Confirm the user's move.
        if (numClicked == 0) {setMessage ('You must click at least one box, you Bozo!', 'red', 2); return;}
        if (numClicked > (winTotal - totalClicked)) {setMessage ('You are not allowed to click all the boxes, you ingrate!', 'red', 2); return;};
        confirmMove();
        if (totalClicked == winTotal) {gameWon(turn); return;}
        confirmMoveButton.value = "Confirm Computer's Move";

        //Determine computer behavior.
        computerDecision();
    }
});

// Listen for the user to play again.
playAgainButton.addEventListener('click', function() {
    if (gameOver == 0) {setMessage('The game is not over yet, you malcontent!', 'red', 2); return;}
    for (i = 0; i < columns; i++) {
        col[i] = i + 1; rowsStruck[i] = 0; tempCol[i] = i + 1; compCol[i] = i + 1;
    }
    turn = Number(getFirst.checked);
    confirmMoveButton.disabled = false;
    playAgain();
});

// Listen for the user to change settings.
changeSettingsButton.addEventListener('click', function() {
    if (gameOver == 0) {setMessage('You cannot change settings in the middle of a game!', 'red', 2); return;}

    getColumns.disabled = false; getFirst.disabled = false; getLevel.disabled = false;
    getPlrName.disabled = false; settingsButton.disabled = false;
    colClick = 0; numClicked = 0; totalClicked = 0; 
    counter = 0; index = 0; compIndex = 0; gameOver = 0;

     // Add back cleared-out columns.
     for (let i = maxColumns; i > 1; i--) {}

    // Reset all the columns and add back the cleared-out columns.
    for (let i = 0; i < maxColumns; i++) {
        rowsStruck[i] = 0; col[i] = i + 1; tempCol[i] = i + 1; compCol[i] = i + 1;
        if (columns < i+1) {
            bookList.prepend(newList[newList.length - 1]);
            newList.pop();
        }
        for (j = 0; j <= i; j++) {box[j][i].displayBox();}
    }

    // Clear out the x's.
    for (let i = 0; i < maxColumns; i++) {
        for (let j = i; j < maxColumns; j++) {box[i][j].drawX(0);}
    }
    confirmMoveButton.disabled = true;

});

// Listen for the user to see game stats.
statsButton.addEventListener('click', function() {
    alert(`${player[0].name} has ${player[0].wins} wins and ${player[0].losses} losses.  ${player[1].name} has ${player[1].wins} wins and ${player[1].losses} losses.`);
});

// Listen for the user to reload the page.
reloadButton.addEventListener('mousedown', function() {window.location.reload();});

// Functions

// Draw Boxes Function
function drawBoxes() {
    for (let i = maxColumns - 1; i >= 0; i--) {
        const newRow = document.createElement('tr');
        newRow.id = `row${i+1}`;
        for (let j = 0; j < columns; j++) {
            const newCell = document.createElement('td');
            newCell.id = `r${i+1}c${j+1}`;
            newCell.className = `r${i + 1} c${j + 1}`;
            if (j >= i) {
                newCell.innerHTML = `<svg>
                <rect width="50" height="50" style="fill:rgb(178, 178, 207); stroke-width:1.5; stroke:rgb(0,0,0);"></rect>
                <line class = "x" x1="10" y1="10" x2="40" y2="40" style="stroke:#000; stroke-width:3;"></line>
                <line class = "x" x1="40" y1="10" x2="10" y2="40" style="stroke:#000; stroke-width:3;"></line>
                </svg>`;
            }
            newRow.appendChild(newCell);
        }
        bookList.appendChild(newRow);
    }
}

//Assign Box Elements to Box Array Function
function assignBoxElements() {
    for (let i = 0; i < maxColumns; i++) {
        for (let j = i; j < maxColumns; j++) {
        box[i][j] = new node(document.getElementById(`r${i+1}c${j+1}`), 0);
        box[i][j].drawX(0);
        }
    }
}

// Set Win Values Function (Calculate the Win Value of Every Possible Game State)
function setWinValues() {
    subWinValues(0);
    for (countArr[0] = 0; countArr[0] <= 1; countArr[0]++) {subWinValues(1);}
}

    //Sub Win Values Function
    function subWinValues(num) {
        for (countArr[num] = countArr[num - 1]; countArr[num] <= num + 1; countArr[num]++) {
            if (columns == num + 1 || num == 5) {runWinValue(num + 1);}
            else{subWinValues(num + 1);}
        }
    }

        // Run WinValue Function
        function runWinValue(col) {
            for (let i = 0; i < maxColumns - col; i++) {tempCol[i] = 0;}
            for (let i = maxColumns - col; i < maxColumns; i++) {tempCol[i] = countArr[i - (maxColumns - col)];}
            tempIndex = calcIndex(tempCol);
            if(winValue[tempIndex] == 0) {winValue[tempIndex] = calcWinValue(tempIndex);}
        }

            //Calculate Win Value Function
            function calcWinValue(index) {
                let localIndex = index;
                const localCol = deconstructArray(localIndex);
                const newCol = [];
                if (localIndex == 1) {return 1;}
                else {
                    for (i = 0; i < maxColumns; i++) {
                        if(localCol[i] > 0) {
                            for (j = 1; j <= localCol[i]; j++) {
                                for (let q = 0; q < maxColumns; q++) {newCol[q] = localCol[q];}
                                newCol[i] -= j;
                                newCol.sort(function(a, b){return a - b});
                                let newIndex = calcIndex(newCol);
                                if (winValue[newIndex] == 1) {
                                    return -1;}
                                else if (winValue[newIndex] == -1) {}
                                else {winValue[newIndex] = calcWinValue(newIndex);}
                            }
                        }
                    }
                    if (winValue[localIndex] == 0) {return 1;}
                }
            }

            //Calculate Index Function
            function calcIndex (tempCol) {
                let tempIndex = 0;
                for (let i = 0; i < maxColumns; i++) {
                    let factorial = 1;
                    for (let j = 7; j > i + 2; j--) {factorial *= j;}
                    tempIndex += tempCol[i] * factorial;
                }
                return tempIndex;
            }

            //Deconstruct Array Function
            function deconstructArray (index) {
                let localIndex = index;
                const localCol =[0, 0, 0, 0, 0, 0];
                for (i = 0; i < maxColumns; i++) {
                    let factorial = 1;
                    for (let j = 7; j > i + 2; j--) {factorial *= j;}
                    localCol[i] = Math.floor(localIndex / factorial);
                    localIndex = localIndex % factorial;
                }
                localCol.sort(function(a, b){return a - b});
                return localCol;
            }

// Computer Decision Function.
function computerDecision() {

    //Calculate the computer's win probability and determine n.
    let movesRemaining = winTotal - totalClicked + 1, probWin = 0, totalMoves = 0;
    for (i = 0; i < columns; i++) {totalMoves += i + 1;}
    console.log('Total moves = ' + totalMoves); console.log('Moves remaining = ' + movesRemaining);
    let probChooseWin = 0.1 * level + (1 - movesRemaining/totalMoves)*(1 - 0.1 * level); console.log('Prob choose win = ' + probChooseWin);    
    probWin = calcProbWin(movesRemaining); console.log('Prob win = ' + probWin);
    let n = Math.max(Math.round(Math.log(1.00001 - probChooseWin) / Math.log(1.00001 - probWin)), 1);
    win = winValue[index];
    if (level == 0 || win == 1) {n = 1;} 
    console.log('n = ' + n);
    
    //The computer chooses its move.
    counter = 0;
    do {
        do {colClick = Math.floor(columns * Math.random() + 1); console.log(`Column ${colClick} has ${colClick - rowsStruck[colClick - 1]} boxes available.`);} while ((colClick - rowsStruck[colClick - 1]) <= 0);
        do {
            numClicked = Math.floor((colClick - rowsStruck[colClick - 1]) * Math.random() + 1);
            console.log('winTotal = ' + winTotal); console.log('totalClicked = ' + totalClicked);
            setTimeout(function() {console.log(`NumClicked = ${numClicked}`);}, 500);
        }
        while (numClicked > (winTotal - totalClicked) || numClicked < 1);

        for(let i = 0; i < maxColumns; i++) {compCol[i] = col[i];}
        compCol[colClick - 1] -= numClicked; console.log('Comp col = ' + compCol);
        compCol.sort(function(a, b){return a - b}); 
        compIndex = calcIndex(compCol);
        let compWin = winValue[compIndex]; console.log('Comp win = ' + compWin);
        counter++;
    } 
    while (winValue[compIndex] != 1 && counter < n);

    //Apply computer's move conditionally
    counter = 0;
    for (let i = 0; i < colClick; i++) {
        if(box[i][colClick - 1].state != 2 && counter < numClicked) {box[i][colClick - 1].drawX(3); counter++;}
    };

}    

    // Calculate Probability of a Win Function.
    function calcProbWin(movesRemaining) {
        const newCol = [];
        let newIndex = 0, newWin = 0;
        counter = 0;
        for (let i = 0; i < maxColumns; i++) {
            for (let j = 1; j <= col[i]; j++) {
                for(let k = 0; k < maxColumns; k++) {newCol[k] = col[k];}
                newCol[i] -= j;
                newCol.sort(function(a, b){return a - b}); 
                newIndex = calcIndex(newCol);
                newWin = winValue[newIndex];
                if (newWin == 1) {counter++;}
            }
        }
        console.log('There are ' + counter + ' winning moves.');
        return counter / movesRemaining;
    }

// Confirm Move Function.
function confirmMove() {
    totalClicked += numClicked;
    rowsStruck[colClick - 1] += numClicked;
    for (let i = 0; i < colClick; i++) {
        if(box[i][colClick - 1].state == 1 && turn == 0) {box[i][colClick - 1].drawX(4);}
        else if(box[i][colClick - 1].state == 1 && turn == 1) {box[i][colClick - 1].drawX(2);}
    }
    col[colClick - 1] -= numClicked;
    colClick = 0; numClicked = 0; turn = -1 * (turn - 1); 

     //Reset tempCol and output the results.
    resetTempCol();
    setMessage(`${player[turn].name}, it is your turn!`, 'green', 2);
}

//Game Won Function
function gameWon() {
    turn = -1 * (turn - 1); 
    player[turn].increaseWins();
    player[-1 * (turn - 1)].increaseLosses();
    setMessage(`${player[turn].name} is the winner!!!`, 'green', 2);
    for (i = 0; i < columns; i++) {
        if (rowsStruck[i] < i + 1) {
            for (j = 0; j < i + 1; j++) {
                if(box[j][i].state == 0) {box[j][i].drawX(5);}
            }
        }
    }
    confirmMoveButton.disabled = true;
    gameOver = 1;
}

// Play Again Function.
function playAgain() {
    colClick = 0; numClicked = 0; totalClicked = 0; 
    counter = 0; index = 0; compIndex = 0;

    // Clear out all X's.
    for (let i = 0; i < columns; i++) {
        for (let j = i; j < columns; j++) {box[i][j].drawX(0);}}
    
    // Reset and sort tempCol.
    resetTempCol();

    //Begin play
    setMessage(`${player[turn].name}, it is your turn!`, 'green', 2);
    if (turn == 0) {computerDecision(); confirmMoveButton.value = "Confirm Computer's Move";}
    else {confirmMoveButton.value = "Confirm My Move";}
    gameOver = 0;
}

    // Reset TempCol Function
    function resetTempCol() {
        for (let i = 0; i < maxColumns; i++) {tempCol[i] = col[i];}
        console.log('Col = ' + col); 
        tempCol.sort(function(a, b){return a - b}); console.log('Temp col = ' + tempCol);
        index = calcIndex(tempCol); console.log('Index = ' + index);
        win = winValue[index]; console.log('Win value = ' + win);
    }

//Set Message Function
function setMessage(msg, color, q) {
    if (q == 1) {message1.textContent = msg; message1.style.color = color;}
    else if (q == 2) {message2.textContent = msg; message2.style.color = color;}
    else if (q == 3) {message3.textContent = msg; message3.style.color = color;}
}