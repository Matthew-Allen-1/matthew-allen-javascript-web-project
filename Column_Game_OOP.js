// Initialize variables.
let maxColumns = 6, colClick = 0, numClicked = 0, totalClicked = 0, 
columns = 6, turn = 1, winTotal = 20, level = 5;
counter = 0, index = 0, compIndex = 0; gameOver = 0;

// Set DOM elements.
const   
    getColumns = document.querySelector('.get-columns'),
    getFirst = document.querySelector('.get-first'),
    getLevel = document.querySelector('.get-level'),
    getPlrName = document.querySelector('.get-name'),

    settingsButton = document.querySelector('#settings-button'),
    confirmMoveButton = document.querySelector('#confirm-move-button'),
    playAgainButton = document.querySelector('#play-again-button'),
    statsButton = document.querySelector('#see-stats-button'),
    changeSettingsButton = document.querySelector('#change-settings-button'),
    reloadButton = document.querySelector('#reload-button'),

    message1 = document.querySelector('.message1'),
    message2 = document.querySelector('.message2'),
    boxContainer = document.getElementById('box-container');

//Initialize arrays.
const 
    box = [], col = [], tempCol = [], compCol = [], rowsStruck = [];
    winValue = [], player = []; countArr = [];
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

// Draw Boxes
// for (let i = 0; i < columns; i++) {
//     let newRow = document.createElement('span');
//     newRow.id = `row${i+1}`;
//     for (let j = i; j < columns; j++) {
//         let newSvg = document.createElement('svg');
//         newSvg.id = `r${i+1}c${j+1}`;
//         newSvg.className = `r${i + 1} c${j+1}`;
//         newSvg.setAttribute('style', 'width="55", height="55"');
//         newSvg.innerHTML = `
//             <rect width="50" height="50" style="fill:rgb(178, 178, 207); stroke-width:1.5; stroke:rgb(0,0,0);"/>
//             <line class = "x" x1="10" y1="10" x2="40" y2="40" style="stroke:#000; stroke-width:3;"/>
//             <line class = "x" x1="40" y1="10" x2="10" y2="40" style="stroke:#000; stroke-width:3;"/>`;
//         console.log(newSvg);
//         newRow.appendChild(newSvg);
//     }
//     console.log(newRow);
//     boxContainer.appendChild(newRow);
// }

//Assign Box Elements
for (let i = 0; i < maxColumns; i++) {
    for (let j = i; j < maxColumns; j++) {
        box[i][j] = new node(document.getElementById(`r${i+1}c${j+1}`), 0); drawX(i, j, 0);
    }
}

 // Node constructor.
function node(element, state) {
    this.element = element;
    this.x = element.querySelectorAll('.x');
    this.state = state;
}

// Set Default Values
player[0] = new Player('COMPUTER', 0, 0);
player[1] = new Player('Matthew', 0, 0);
confirmMoveButton.value = "Confirm My Move";
setMessage('Please select the boxes you would like to strike out.', 'black', 1);
setMessage(`${player[turn].name}, it is your turn!`, 'green');
confirmMoveButton.disabled = true;

// Listen for user to confirm game settings.
settingsButton.addEventListener('click', function() {
    columns = parseInt(getColumns.value); level = parseInt(getLevel.value); 
    turn = Number(document.getElementById('yes').checked); player[1].name = String(getPlrName.value);
    winTotal = columns * (columns + 1) / 2 - 1;
    getColumns.disabled = true; getFirst.disabled = true; 
    getLevel.disabled = true; getPlrName.disabled = true; 
    settingsButton.disabled = true; confirmMoveButton.disabled = false;
    setWinValues();

    // Clear out unneeded columns.
    for (let i = 5; i > 0; i--) {
        if (columns < i + 1) {
            for (j = 0; j <= i; j++) {box[j][i].element.style = "display: none;";}
            col[i] = 0;
        }
    }
    playAgain();
});

// Listen for the user to click on a box.
for (let i = 0; i < maxColumns; i++) {
    for (let j = i; j < maxColumns; j++) {
        box[i][j].element.addEventListener('click', function() {
            if (turn == 1) {
                if(colClick != 0 && j + 1 != colClick && numClicked > 0) {setMessage(`I am sorry, but you may only strike out boxes in a single column.`, 'red');}
                else {
                    setMessage(`${player[turn].name}, it is your turn!`, 'green');
                    colClick = j + 1;
                    console.log(`The user just clicked on the row ${i + 1}, column ${j + 1} box.`);
                    if(box[i][j].state == 0) {box[i][j].state = 1; drawX(i, j, 1); numClicked++;}
                    else if(box[i][j].state == 1) {box[i][j].state = 0; drawX(i, j, 0); numClicked--;}
                    else {setMessage(`I am sorry, but that box has already been selected.`, 'red');}
                }
            }
        });
    };
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
        if (numClicked == 0) {setMessage ('You must click at least one box, you Bozo!', 'red'); return;}
        if (numClicked > (winTotal - totalClicked)) {setMessage ('You are not allowed to click all the boxes, you ingrate!', 'red'); return;};
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
        col[i] = i + 1; rowsStruck[i] = 0; tempCol[i] = i + 1; compCol[i] = i + 1
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
    counter = 0; index = 0; compIndex = 0;
    gameOver = 0;

    for (i = 0; i < maxColumns; i++) {
        
    }
    // Reset all the columns.
    for (let i = 0; i < maxColumns; i++) {
        rowsStruck[i] = 0; col[i] = i + 1; tempCol[i] = i + 1; compCol[i] = i + 1;
        for (j = 0; j <= i; j++) {box[j][i].element.style = "display: inline-block;";}
        }

    // Clear out the x's.
    for (let i = 0; i < maxColumns; i++) {
        for (let j = i; j < maxColumns; j++) {box[i][j].state = 0; drawX(i, j, 0);}
    }
    confirmMoveButton.disabled = true;

});

// Listen for the user to see game stats.
statsButton.addEventListener('click', function() {
    alert(`${player[0].name} has ${player[0].wins} wins and ${player[0].losses} losses.  ${player[1].name} has ${player[1].wins} wins and ${player[1].losses} losses.`);
});

// Listen for the user to reload the page.
reloadButton.addEventListener('mousedown', function() {window.location.reload();});

// Set Win Values Function (Calculate the Win Value of Every Possible Game State)
function setWinValues() {
    for (countArr[0] = 0; countArr[0] <= 1; countArr[0]++) {
        for (countArr[1] = countArr[0]; countArr[1] <= 2; countArr[1]++) {
            if (columns == 2) {runWinValue(2);}
            else{
                for (countArr[2] = countArr[1]; countArr[2] <= 3; countArr[2]++) {
                    if (columns == 3) {runWinValue(3);}
                    else {
                        for(countArr[3] = countArr[2]; countArr[3] <= 4; countArr[3]++) {
                            if (columns == 4) {runWinValue(4);}
                            else {
                                for(countArr[4] = countArr[3]; countArr[4] <= 5; countArr[4]++) {
                                    if (columns == 5) {runWinValue(5);}
                                    else {
                                        for(countArr[5] = Math.max(countArr[4], 1); countArr[5] <= 6; countArr[5]++) {
                                            runWinValue(6);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }       
        }
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

// Computer decision function.
function computerDecision() {
    let movesRemaining = winTotal - totalClicked + 1, probWin = 0, totalMoves = 0;
    for (i = 0; i < columns; i++) {totalMoves += i + 1;}
    console.log('Total moves = ' + totalMoves); console.log('Moves remaining = ' + movesRemaining);
    let probChooseWin = 0.1 * level + (1 - movesRemaining/totalMoves)*(1 - 0.1 * level); console.log('Prob choose win = ' + probChooseWin);    
    probWin = calcProbWin(movesRemaining); console.log('Prob win = ' + probWin);
    let n = Math.max(Math.round(Math.log(1.00001 - probChooseWin) / Math.log(1.00001 - probWin)), 1);
    win = winValue[index];
    if (level == 0 || win == 1) {n = 1;} 
    console.log('n = ' + n);
 
    counter = 0;

    //The computer chooses its move.
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
        compWin = winValue[compIndex]; console.log('Comp win = ' + compWin);
        counter++;
    } 
    while (winValue[compIndex] != 1 && counter < n);

    //Apply computer's move conditionally
    counter = 0;
    for (let i = 0; i < colClick; i++) {
        if(box[i][colClick - 1].state != 2 && counter < numClicked) {box[i][colClick - 1].state = 1; drawX(i, colClick - 1, 3); counter++;}
    };
    setMessage('The computer has selected the boxes they would like to strike out.', 'black', 1);
}

// Calculate the probability of the computer choosing the correct move.
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

// Confirm move function.
function confirmMove() {
    totalClicked += numClicked;
    rowsStruck[colClick - 1] += numClicked;
    for (let i = 0; i < colClick; i++) {
        if(box[i][colClick - 1].state == 1 && turn == 0) {box[i][colClick - 1].state = 2; drawX(i, colClick - 1, 4);}
        else if(box[i][colClick - 1].state == 1 && turn == 1) {box[i][colClick - 1].state = 2; drawX(i, colClick - 1, 2);}
    }
    col[colClick - 1] -= numClicked;
    colClick = 0; numClicked = 0; turn = -1 * (turn - 1); 

     //Reset tempCol and output the results.
    resetTempCol();
    setMessage(`${player[turn].name}, it is your turn!`, 'green');
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
                if(box[j][i].state == 0) {box[j][i].state = 3; drawX(j, i, 5);}
            }
        }
    }
    confirmMoveButton.disabled = true;
    gameOver = 1;
}
    
//Set Message Function
function setMessage(msg, color, q) {
    if (q == 1) {message1.textContent = msg; message1.style.color = color;}
    else {message2.textContent = msg; message2.style.color = color;}
}

// Play again function.
function playAgain() {
    colClick = 0; numClicked = 0; totalClicked = 0; 
    counter = 0; index = 0; compIndex = 0;

    // Clear out all X's.
    for (let i = 0; i < columns; i++) {
        for (let j = i; j < columns; j++) {box[i][j].state = 0; drawX(i, j, 0);}
    }
    // Reset and sort tempCol.
    resetTempCol();

    //Begin play
    setMessage(`${player[turn].name}, it is your turn!`, 'green');
    if (turn == 0) {computerDecision(); confirmMoveButton.value = "Confirm Computer's Move";}
    else {confirmMoveButton.value = "Confirm My Move";}
    gameOver = 0;
    
}

// Reset tempCol function
function resetTempCol() {
    for (let i = 0; i < maxColumns; i++) {tempCol[i] = col[i];}
    console.log('Col = ' + col); 
    tempCol.sort(function(a, b){return a - b}); console.log('Temp col = ' + tempCol);
    index = calcIndex(tempCol); console.log('Index = ' + index);
    win = winValue[index]; console.log('Win value = ' + win);
}

//Draw or clear out X's function
function drawX(row, column, state) {
    for (let q = 0; q < 2; q++) {
        switch (state) {
            case 0: box[row][column].x[q].style = "display: none;"; break;
            case 1: box[row][column].x[q].style = "display: inline-block; stroke: lightblue; stroke-width: 2;"; break;
            case 2: box[row][column].x[q].style = "display: inline-block; stroke: darkblue; stroke-width: 3;"; break;
            case 3: box[row][column].x[q].style = "display: inline-block; stroke: lightgreen; stroke-width: 2;"; break;
            case 4: box[row][column].x[q].style = "display: inline-block; stroke: darkgreen; stroke-width: 3;"; break;
            case 5: box[row][column].x[q].style = "display: inline-block; stroke: darkred; stroke-width: 3;"; break;
        }
    }
}