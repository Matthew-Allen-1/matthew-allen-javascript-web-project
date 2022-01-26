// Initialize variables.
let columns = 6,  turn = 1, oppType = 0, winTotal = 20, 
colClick = 0, numClicked = 0, totalClicked = 0, 
counter = 0, index = 0, compIndex = 0; gameOver = 0;

// Set DOM elements.
const   
    getColumns = document.querySelector('.get-columns'),
    getFirst = document.querySelector('.get-first'),
    getPlrName = document.querySelector('.get-name'),
    getOppType = document.querySelector('.get-opp-type'),
    settingsButton = document.querySelector('#settings-button'),
    confirmMoveButton = document.querySelector('#confirm-move-button'),
    message1 = document.querySelector('.message1'),
    message2 = document.querySelector('.message2'),
    playAgainButton = document.querySelector('#play-again-button'),
    statsButton = document.querySelector('#stats-button'),
    changeSettingsButton = document.querySelector('#restart-button'),
    reloadButton = document.querySelector('#reload-button');

//Initialize arrays.
const 
    plrName = ['COMPUTER', 'Matthew'],
    box = [[], [], [], [], [], []],
    col = [1, 2, 3, 4, 5, 6], rowsStruck = [0, 0, 0, 0, 0, 0], 
    tempCol = [1, 2, 3, 4, 5, 6], compCol = [1, 2, 3, 4, 5, 6],
    winValue = []; player = [];
    for (let q = 0; q < 5040; q++) {winValue[q] = 0;}
 
//Player constructor.
function Player(name, wins, losses) {
    this.name = name;
    this.wins = wins;
    this.losses = losses;
    this.increaseWins = function() {this.wins++;}
    this.increaseLosses = function() {this.losses++}
    this.reset = function () {this.name = ''; this.wins = 0; this.losses=0;}
}

// Node constructor.
function node(element, state) {
    this.element = element;
    this.x = element.querySelectorAll('.x');
    this.state = state;
}

//Assign Box Elements
for (let i = 0; i < columns; i++) {
    for (let j = i; j < columns; j++) {
        switch (i) {
            case 0: switch(j) {
                case 0: box[i][j] = new node(document.querySelector('#r1c1'), 0); break;
                case 1: box[i][j] = new node(document.querySelector('#r1c2'), 0); break;
                case 2: box[i][j] = new node(document.querySelector('#r1c3'), 0); break;
                case 3: box[i][j] = new node(document.querySelector('#r1c4'), 0); break;
                case 4: box[i][j] = new node(document.querySelector('#r1c5'), 0); break;
                case 5: box[i][j] = new node(document.querySelector('#r1c6'), 0); break;
            };
            break;
            case 1: switch(j) {
                case 1: box[i][j] = new node(document.querySelector('#r2c2'), 0); break;
                case 2: box[i][j] = new node(document.querySelector('#r2c3'), 0); break;
                case 3: box[i][j] = new node(document.querySelector('#r2c4'), 0); break;
                case 4: box[i][j] = new node(document.querySelector('#r2c5'), 0); break;
                case 5: box[i][j] = new node(document.querySelector('#r2c6'), 0); break;
            };
            break;
            case 2: switch(j) {
                case 2: box[i][j] = new node(document.querySelector('#r3c3'), 0); break;
                case 3: box[i][j] = new node(document.querySelector('#r3c4'), 0); break;
                case 4: box[i][j] = new node(document.querySelector('#r3c5'), 0); break;
                case 5: box[i][j] = new node(document.querySelector('#r3c6'), 0); break;
            };
            break;
            case 3: switch(j) {
                case 3: box[i][j] = new node(document.querySelector('#r4c4'), 0); break;
                case 4: box[i][j] = new node(document.querySelector('#r4c5'), 0); break;
                case 5: box[i][j] = new node(document.querySelector('#r4c6'), 0); break;
            };
            break;
            case 4: switch(j) {
                case 4: box[i][j] = new node(document.querySelector('#r5c5'), 0); break;
                case 5: box[i][j] = new node(document.querySelector('#r5c6'), 0); break;
            };
            break;
            case 5: switch(j) {
                case 5: box[i][j] = new node(document.querySelector('#r6c6'), 0); break;
            };
            break;
        };
        box[i][j].x[0].style = "display: none;"; box[i][j].x[1].style = "display: none;"
    }
}

// Set Default Values
player[0] = new Player('COMPUTER', 0, 0);
player[1] = new Player('Matthew', 0, 0);
confirmMoveButton.value = "Confirm My Move";
setMessage('Please select the boxes you would like to strike out.', 'black', 1);
setMessage(`${player[turn].name}, it is your turn!`, 'green');
confirmMoveButton.disabled = false;

//Calculate the Win Value of Every Possible Game State
let tempIndex = 0;
for (let i = 0; i <= 1; i++) {
    for (let j = i; j <= 2; j++) {
        for (let k = j; k <= 3; k++) {
            for(let l = k; l <= 4; l++) {
                for(let m = l; m <= 5; m++) {
                    for(let n = Math.max(m, 1); n <= 6; n++) {
                        tempCol[0] = i; tempCol[1] = j; tempCol[2] = k; tempCol[3] = l; tempCol[4] = m; tempCol[5] = n;
                        // console.log('Temp col = ' + tempCol);
                        tempIndex = calcIndex(tempCol);
                        // console.log('Temp Index = ' + tempIndex);
                        if(winValue[tempIndex] == 0) {winValue[tempIndex] = calcWinValue(tempIndex);}
                        // console.log(`Win value (${tempIndex}) = ${winValue[tempIndex]}`);
                    }
                }
            }
        }
    }
}

//Calculate Win Value Function
function calcWinValue(index) {
    let localIndex = index;
    const localCol = deconstructArray(localIndex);
    const newCol = [];
    if (localIndex == 1) {return 1;}
    else {
        for (i = 0; i < 6; i++) {
            if(localCol[i] > 0) {
                for (j = 1; j <= localCol[i]; j++) {
                    for (let q = 0; q < 6; q++) {newCol[q] = localCol[q];}
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

// Listen for user to confirm game settings.
settingsButton.addEventListener('click', function() {
    columns = parseInt(getColumns.value); player[1].name = String(getPlrName.value);
    turn = Number(getFirst.checked); oppType = Number(getOppType.checked); 
    winTotal = columns * (columns + 1) / 2 - 1;
    getColumns.disabled = true; getFirst.disabled = true;
    getPlrName.disabled = true; getOppType.disabled = true;
    settingsButton.disabled = true; confirmMoveButton.disabled = false;
    playAgain()

    //Define computer behavior if the computer is going first.
    if (turn == 0) {computerDecision();} 

    //Apply computer's move conditionally
    counter = 0;
    for (let i = 0; i < colClick; i++) {
        if(box[i][colClick - 1].state != 2 && counter < numClicked) {box[i][colClick - 1].state = 1; box[i][colClick - 1].x[0].style = "display: inline-block; stroke:#666; stroke-width:2;"; box[i][colClick - 1].x[1].style = "display: inline-block; stroke:#666; stroke-width:2;"; counter++;}
    };
});

// Listen for the user to click on a box.
for (let i = 0; i < columns; i++) {
    for (let j = i; j < columns; j++) {
        box[i][j].element.addEventListener('click', function() {
            if (turn == 1) {
                if(colClick != 0 && j + 1 != colClick && numClicked > 0) {
                    setMessage(`I am sorry, but you may only strike out boxes in a single column.`, 'red');
                }
                else {
                    colClick = j + 1; setMessage('');
                    console.log(`The user just clicked on the row ${i + 1}, column ${j + 1} box.`);
                    if(box[i][j].state == 0) {
                        box[i][j].state = 1; 
                        numClicked++; 
                        box[i][j].x[0].style = "display: inline-block; stroke:#666; stroke-width:2;"; 
                        box[i][j].x[1].style = "display: inline-block; stroke:#666; stroke-width:2;";
                    }
                    else if(box[i][j].state == 1) {
                        box[i][j].state = 0; 
                        numClicked--; 
                        box[i][j].x[0].style = "display: none;"; 
                        box[i][j].x[1].style = "display: none;";
                    }
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
        confirmComputerMove();
        if (totalClicked == winTotal) {gameWon(turn); return;}
        col[colClick - 1] -= numClicked;
        colClick = 0; numClicked = 0; turn = -1 * (turn - 1); 

        //Reset tempCol and output the results.
        for (let i = 0; i < 6; i++) {tempCol[i] = col[i];}
        console.log('Col = ' + col); 
        tempCol.sort(function(a, b){return a - b}); console.log('Temp col = ' + tempCol);
        index = calcIndex(tempCol); console.log('Index = ' + index);
        win = winValue[index];
        console.log('Win value = ' + win);

        setMessage(`${player[turn].name}, it is your turn!`, 'green');
        confirmMoveButton.value = "Confirm My Move";
        setMessage('Please select the boxes you would like to strike out.', 'black', 1);
    }

    else {
        //Confirm the user's move.
        if (numClicked == 0) {setMessage ('You must click at least one box, you Bozo!', 'red'); return;}
        if (numClicked > (winTotal - totalClicked)) {setMessage ('You are not allowed to click all the boxes, you ingrate!', 'red'); return;};
        totalClicked += numClicked;
        rowsStruck[colClick - 1] += numClicked;
        for (let i = 0; i < colClick; i++) {
            if(box[i][colClick - 1].state == 1) {
                box[i][colClick - 1].state = 2; 
                box[i][colClick - 1].x[0].style = "display: inline-block; stroke:#111; stroke-width:3;"; 
                box[i][colClick - 1].x[1].style = "display: inline-block; stroke:#111; stroke-width:3;"; 
            }
            else if (box[i][colClick - 1].state == 1 && counter == numClicked) {box[i][colClick - 1].state = 0; box[i][colClick - 1].x[0].style = "display: none;"; box[i][colClick - 1].x[1].style = "display: none;";}
        };

        if (totalClicked == winTotal) {gameWon(turn); return;}
        col[colClick - 1] -= numClicked;
        colClick = 0; numClicked = 0; turn = -1 * (turn - 1); 

        for (let i = 0; i < 6; i++) {tempCol[i] = col[i];}
        console.log('Col = ' + col); 
        tempCol.sort(function(a, b){return a - b}); console.log('Temp col = ' + tempCol);
        index = calcIndex(tempCol); console.log('Index = ' + index);
        win = winValue[index];
        console.log('Win value = ' + win);
        setMessage(`${player[turn].name}, it is your turn!`, 'green');

        //Define computer behavior.
        computerDecision();

         //Apply computer's move conditionally
        counter = 0;
        for (let i = 0; i < colClick; i++) {
            if(box[i][colClick - 1].state != 2 && counter < numClicked) {
                box[i][colClick - 1].state = 1; 
                box[i][colClick - 1].x[0].style = "display: inline-block; stroke:#666; stroke-width:2;"; 
                box[i][colClick - 1].x[1].style = "display: inline-block; stroke:#666; stroke-width:2;"; 
                counter++;
            }
        };
    }
});
    
// Computer decision function.
function computerDecision() {
    confirmMoveButton.value = "Confirm Computer's Move";
    setMessage('The computer has selected the boxes they would like to strike out.', 'black', 1);
    
    if (oppType == 0) {
        do {colClick = Math.floor(columns * Math.random() + 1); console.log(`Column ${colClick} has ${colClick - rowsStruck[colClick - 1]} boxes available.`);} while ((colClick - rowsStruck[colClick - 1]) <= 0);
        do {numClicked = Math.floor((colClick - rowsStruck[colClick - 1]) * Math.random() + 1); console.log(`NumClicked = ${numClicked}`);} while (numClicked > (winTotal - totalClicked) || numClicked < 1);
    }
    else {
        win = winValue[index];
        if (win == 1) {
            do {colClick = Math.floor(columns * Math.random() + 1); console.log(`Column ${colClick} has ${colClick - rowsStruck[colClick - 1]} boxes available.`);} while ((colClick - rowsStruck[colClick - 1]) <= 0);
            do {numClicked = Math.floor((colClick - rowsStruck[colClick - 1]) * Math.random() + 1); console.log(`NumClicked = ${numClicked}`);} while (numClicked > (winTotal - totalClicked) || numClicked < 1);
        }
        else {
            let counter = 0;
            do {
                do {colClick = Math.floor(columns * Math.random() + 1); console.log(`Column ${colClick} has ${colClick - rowsStruck[colClick - 1]} boxes available.`);} while ((colClick - rowsStruck[colClick - 1]) <= 0);
                do {numClicked = Math.floor((colClick - rowsStruck[colClick - 1]) * Math.random() + 1); console.log(`NumClicked = ${numClicked}`);} while (numClicked > (winTotal - totalClicked) || numClicked < 1);
                for(let i = 0; i < 6; i++) {compCol[i] = col[i];}
                compCol[colClick - 1] -= numClicked; console.log('Comp col = ' + compCol);
                compCol.sort(function(a, b){return a - b}); 
                compIndex = calcIndex(compCol);
                compWin = winValue[compIndex]; console.log('Comp win = ' + compWin);
                counter++;
            } 
            while (winValue[compIndex] != 1 && counter < 200);
        }
    }
}

// Confirm computer's move function.
function confirmComputerMove() {
    totalClicked += numClicked;
    rowsStruck[colClick - 1] += numClicked;

    for (let i = 0; i < colClick; i++) {
        if(box[i][colClick - 1].state == 1 ) {
            box[i][colClick - 1].state = 2; 
            box[i][colClick - 1].x[0].style = "display: inline-block; stroke:#111; stroke-width:3;"; 
            box[i][colClick - 1].x[1].style = "display: inline-block; stroke:#111; stroke-width:3;"; 
        
        }
    };
}

// Listen for the user to play again.
playAgainButton.addEventListener('click', function() {
    if (gameOver == 0) {setMessage('The game is not over yet, you malcontent!', 'red', 2); return;}
    colClick = 0, numClicked = 0, totalClicked = 0, 
    counter = 0, index = 0, compIndex = 0;
    for (i = 0; i < 6; i++) {
        col[i]=i+1; rowsStruck[i]=0; tempCol[i]=i+1; compCol[i] = i + 1
    }
    turn = Number(getFirst.checked);
    confirmMoveButton.disabled = false;
    playAgain();
});

// Listen for the user to change settings.
changeSettingsButton.addEventListener('click', function() {

    getColumns.disabled = false; getFirst.disabled = false;
    getPlrName.disabled = false; settingsButton.disabled = false;

    colClick = 0, numClicked = 0, totalClicked = 0, counter = 0;
    // Clear out the x's.
    for (let i = 0; i < columns; i++) {
        for (let j = i; j < columns; j++) {
            box[i][j].state = 0;
            box[i][j].x[0].style = "display: none;"; box[i][j].x[1].style = "display: none;";            
        }
    }
});


// Listen for the user to see game stats.
statsButton.addEventListener('click', function() {
    alert(`${player[0].name} has ${player[0].wins} wins and ${player[0].losses} losses.  ${player[1].name} has ${player[1].wins} wins and ${player[1].losses} losses.`);
});


// Listen for the user to reload the page.
reloadButton.addEventListener('mousedown', function() {window.location.reload();});

//Calculate Index Function
function calcIndex (tempCol) {
    let tempIndex = 0;
    for (let i = 0; i < 6; i++) {
        let factorial = 1;
        for (let j = 7; j > i + 2; j--) {factorial *= j;}
        tempIndex += tempCol[i] * factorial;
    }
    return tempIndex;
}

// Play again function.
function playAgain() {
    // Clear out unneeded columns.
    for (let i = 5; i > 0; i--) {
        if (columns < i + 1) {
            for (j = 0; j <= i; j++) {box[j][i].element.style = "display: none;";}
            col[i] = 0;
        }
    }

    // Clear out all X's.
    for (let i = 0; i < columns; i++) {
        for (let j = i; j < columns; j++) {
            box[i][j].state = 0;
            box[i][j].x[0].style = "display: none;"; box[i][j].x[1].style = "display: none;";            
        }
    }

    // Reset and sort tempCol.
    for (let i = 0; i < 6; i++) {tempCol[i] = col[i];}
    console.log('Col = ' + col); 
    tempCol.sort(function(a, b){return a - b}); console.log('Temp col = ' + tempCol);
    index = calcIndex(tempCol); console.log('Index = ' + index);

    //Begin play
    setMessage(`${player[turn].name}, it is your turn!`, 'green');
    if (turn == 0) {computerDecision();}
    gameOver = 0;
}

//Deconstruct Array Function
function deconstructArray (index) {
    let localIndex = index;
    const localCol =[0, 0, 0, 0, 0, 0];
    for (i = 0; i < 6; i++) {
        let factorial = 1;
        for (let j = 7; j > i + 2; j--) {factorial *= j;}
        localCol[i] = Math.floor(localIndex / factorial);
        localIndex = localIndex % factorial;
    }
    localCol.sort(function(a, b){return a - b});
    return localCol;
}

//Game Won Function
function gameWon() {
    player[turn].increaseWins();
    player[-1 * (turn - 1)].increaseLosses();
    setMessage(`${player[turn].name} is the winner!!!`, 'green', 2);
    for (i = 0; i < columns; i++) {
        if (rowsStruck[i] < i + 1) {
            for (j = 0; j < i + 1; j++) {
                if(box[j][i].state == 0) {
                    box[i][i].state = 2; 
                    box[j][i].x[0].style = "display: inline-block; stroke: darkred; stroke-width:3;"; 
                    box[j][i].x[1].style = "display: inline-block; stroke: darkred; stroke-width:3;";
                }
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

