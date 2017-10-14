//object with properties of constant color and sound data for buttons, and additional sound data for other sound effect
const buttons = {
	red: {initial: '#cc0606', clicked: '#ed8782', sound: 'Assets/Sounds/simonSound1.mp3' },
	green: {initial: '#12990d', clicked: '#89ff94', sound: 'Assets/Sounds/simonSound2.mp3' },
	blue: {initial: '#060b9b', clicked: '#89c9ff', sound: 'Assets/Sounds/simonSound3.mp3'},
	yellow: {initial: '#cccc06', clicked: '#fbff89', sound: 'Assets/Sounds/simonSound4.mp3' },
	wrong: {sound: 'Assets/Sounds/leisure_retro_arcade_game_incorrect_error_tone.mp3' }, //audio for wrong answer/loser buzzer added here for simplicity/compatability with the sound function
	win: {sound: 'Assets/Sounds/zapsplat_multimedia_game_star_win_gain_x4_12390.mp3'} //audio for win also included here
}
//declares global variable and assigns initial values
let round = 1; //initial round of play number
let speed = 700; //sets initial "slow" speed
let speedFast = false; // fast mode indicator
let strict = false; //strict mode on/off indicator
let strictButtonActive = true; //strict mode button availability
let colorsActive = false; //game button clikc availabililty
let playList = [] //empty computer array for accepting random sequence generation
let userClicks = []; //empty array for accepting data on user clicks in game
//targeting buttons and game status elements
const roundNumber = document.querySelector('#roundNumber');
const strictStatus = document.querySelector('#strictStatus');
const speedStatus = document.querySelector('#speedStatus');
const h1 = document.querySelector('h1');
//gives functionality to strict button
const strictButton = document.querySelector('#strict');
strictButton.addEventListener('click', function() {
	//toggles status of strict button based on current button mode
	if(strictButtonActive) {
		if (!strict) {strict = true; strictStatus.innerText = 'On';}
		else {strict = false; strictStatus.innerText = 'Off';}
	}
});
//gives functionality to the start button
const startButton = document.querySelector('#start');
startButton.addEventListener('click', function() {
	this.setAttribute('disabled', '');
	strictButtonActive = false; //disengages strict toggle button during play
	//disables strict and speed buttons
	strictButton.setAttribute('disabled', ''); 
	speedButton.setAttribute('disabled', '');
	h1.style.display = 'none';
	setTimeout(function() {
		init(); //initializes play with slight delay for user 
	}, 500);
});
//gives functionality to speed button and toggles speed/changes display for speed selection
const speedButton = document.querySelector('#speed');
speedButton.addEventListener('click', function() {
	if (speedFast === false) {speed = 400; speedStatus.innerText = 'Fast'; speedFast = true;}
	else {speed = 700; speedStatus.innerText = 'Slow'; speedFast = false;}
});
//gives functionality to the reset button
document.querySelector('#reset').addEventListener('click', function() {
	reset(); //calls reset function
});
//targets the four game playing buttons
const red = document.querySelector('#red');
const green = document.querySelector('#green');
const blue = document.querySelector('#blue');
const yellow = document.querySelector('#yellow');
//array of arrays with constant button data for use in function call arguments and DOM manipulation
const ref = [[red, 'red'], [green, 'green'], [blue, 'blue'], [yellow, 'yellow']];
//adds functionality to game playing buttons if their current use status is allowed
red.addEventListener('click', function() {
	if (colorsActive) {
		fire(this, 'red'); //calls fire() to play tone and temporarily "light up" button
		userClicks.push(0); //"pushes" button click data to array for later comparison to computer generated sequence data
		clickCheck(); //calls clickCheck() to check if user has completed their total entry of button clicks for the round
	}
});
//see above
green.addEventListener('click', function() {
	if (colorsActive) {
		fire(this, 'green');
		userClicks.push(1);
		clickCheck();
	}
});
//see above
blue.addEventListener('click', function() {
	if (colorsActive) {
		fire(this, 'blue');
		userClicks.push(2);
		clickCheck();
	}
});
//see above
yellow.addEventListener('click', function() {
	if (colorsActive) {
		fire(this, 'yellow');
		userClicks.push(3)
		clickCheck();
	}
});
//function initializing starting play and then individual round play
function init() {
	userClicks = []; //clears array of previous button click data for new round
	random(); //calls for random button addition to computer play sequence per round 
	execute(); //calls function to play back current current sequence after addition
}
//function resetting game 
function reset() {
	colorsActive = false; //disengages game buttons
	strictButtonActive = true; //allows toggling of strict mode button
	round = 1; //resets round number
	roundNumber.innerText = '1'; //resets round number display
	playList = []; //clears aggregate computer data for button play
	//enables strict, start, and speed buttons
	strictButton.removeAttribute('disabled'); 
	startButton.removeAttribute('disabled');
	speedButton.removeAttribute('disabled');
	h1.style.display = 'block';
	h1.innerText = 'Ready To Play!'
}
//random number function that generates a number between 0 and 3 that corresponds to constant ref index numbers for game play buttons
function random() {
	//creates random number and pushes it to the playList for game use
	playList.push(Math.floor(Math.random() * 4)); 
}
//executes the current aggregate playlist
function execute() {
	//iterates over the playlist based on list length
	for (let i = 0, t = speed; i <  playList.length; i++, t += speed) {
		//uses incrementing timeout (based on t increasing 400ms/loop to space the timing of buttons in generated sequence presented to the user)
		setTimeout(function() {
			//plays tone and flashes button for each sequence entry
			fire(ref[playList[i]][0], ref[playList[i]][1]);
		}, t);
		//activates buttons for user use 700ms after sequence is done playing by computer
		if (i === playList.length - 1) {
			setTimeout(function() {
				colorsActive = true;
			}, t + 700);
		}
	}
}
//accepts arguments of data for button pushed/played and it's variable, and passes this data to functions for tone and color change
function fire(x, y) {
	sound(buttons[y]); //tone based on object data
	color(x, buttons[y]); //temporary color change based on object data and target button variable
}
//invokes tone for button pushed/played
function sound(x) {
	let audio = new Audio(x.sound); //uses data from object based on argument
	audio.play();
}
//changes pushed/played button color for 150ms, "lighting it up", based on object data for that button
function color(x, y) {
	x.style.backgroundColor = y.clicked; //"lights up" button
	setTimeout(function() {
		x.style.backgroundColor = y.initial; //returns button to static color after 150ms
	}, 250);
}
//function that compares user click sequence to actual sequence presented in round
function clickCheck() {
	//if user has completed their entry, deactivates buttons and calls compare()
	if (userClicks.length === playList.length) {colorsActive = false; compare();} 
}
//function that compares user clicks to computer generated sequence and accordingly takes action
function compare() {
	let correct = true; //reassigns value of variable for each function call
	//iterates over computer game sequence data 
	for (i = 0; i < playList.length; i++) {
		//compares user click data to sequence data for each index 
		if (userClicks[i] !== playList[i]) {
			correct = false; //reassigns correct if user entry had "mistake"
			break; //breaks out of loop on first invalid entry detected
		}
	}
	//if user entries matched sequence entries
	if (correct) { 
		//if round is equal to game length, accounts for game being won
		if (playList.length === 20) {win();}
		//else advances to next round of game
		else {nextRound();}
    }
    //else if user entries did not perfectly match
    else {
    	//if strict mode is active, resets the game
    	if (strict) {lose();}
    	//else, replays the current round/sequence
    	else {replayRound();}
    }
}
//game win
function win() {
	sound(buttons.win); //plays winning sound
	h1.innerText = 'YOU WIN!!!' 
	h1.style.display = 'block'; //displays winning message
	setTimeout(function() {
		reset(); //resets game on delay
	}, 2000);
}
//advances to next round
function nextRound() {
	round++; //increments round number
	roundNumber.innerText = round; //adjusts round number display
	setTimeout(function() { 
		init(); //initializes another round of play with 1 sec delay
	}, 1000);
}
//game loss
function lose() {
	sound(buttons.wrong); //plays buzzer for loss
	h1.innerText = 'You Lose! Play Again!!'
	h1.style.display = 'block'; //displays losing message
	setTimeout(function() {
		reset(); //resets game on delay
	}, 2000);
}
//replays round after wrong answer outside strict mode
function replayRound() {
	sound(buttons.wrong); //plays buzzer for wrong answer
	h1.innerText = 'Wrong, Try Again!';
	h1.style.display = 'block'; //diplays wrong answer message
	setTimeout(function() {
		userClicks = []; //resets user click data
		h1.style.display = 'none'; //hides message
		execute(); //replays round on delay
	}, 2000);
}
