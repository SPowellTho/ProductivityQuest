//Player variables
var playerMot = 100;
var playerEng = 100;
var playerAction = 1; //1=Go 2=Nap 3=Read ///Used for changing animations

//Enemy variables
var enemyProgress = 0;
var enemyPN = 1000; //Progress Needed
var energyCost = 0;
var motivationCost = 0;
var enemyType = -1;

var playerTurn = true; //determines if the player can click buttons
var animate = true; //determines which frame of animation is used

var projectsCompleted = 0;
var day = 0; // 0=Sunday 6=Saturday

window.onload = function() {
	createEnemy();
	updateHud();
	setInterval(animateImages,500);
	
	//Add functionality to buttons
	var clickable = document.getElementById("GO");
	clickable.addEventListener("click", makeProgress);
	
	clickable = document.getElementById("NAP");
	clickable.addEventListener("click", takeNap);
	
	clickable = document.getElementById("READ");
	clickable.addEventListener("click", readSomething);
	
	//Color the first day in the deadline display 
	var deadline = document.getElementById("deadline");
	clean(deadline);
	var arr = deadline.childNodes;
	arr[0].style.backgroundColor = '#795663';
	
};

function animateImages() {
	if (playerAction == 1)
	{
		if (animate)
		document.getElementById("playerImage").firstChild.src = "images/playerGO-1.png";
		else
		document.getElementById("playerImage").firstChild.src = "images/playerGO-2.png";
	}
	
	if (playerAction == 2)
	{
		if (animate)
		document.getElementById("playerImage").firstChild.src = "images/playerNAP-1.png";
		else
		document.getElementById("playerImage").firstChild.src = "images/playerNAP-2.png";
	}
	
	if (playerAction == 3)
	{
		if (animate)
		document.getElementById("playerImage").firstChild.src = "images/playerREAD-1.png";
		else
		document.getElementById("playerImage").firstChild.src = "images/playerREAD-2.png";
	}
	
	animate = !animate; //toggle between frames of the animation
}

function makeProgress() {
	if (playerTurn) {
		if (enemyType != -1)
		{
			var tasksDone = Math.ceil(playerMot / 10);
			var progressDone = (Math.ceil(playerEng / 6) * tasksDone);
			enemyProgress += progressDone;

			var bg = document.getElementById("topField");
			bg.style.backgroundColor = '#795663';

			//Updating the text feed
			var textBox = document.getElementById("textBox");
			while (textBox.firstChild) {
				textBox.removeChild(textBox.firstChild); //clears the current feed
			}

			var p = document.createElement("p");
			p.innerHTML = "You completed " + tasksDone + " task(s)!";
			textBox.appendChild(p);

			p = document.createElement("p");
			p.innerHTML = ">>" + Math.round(Math.min(100,((progressDone / enemyPN) * 100))) + "% of the project was just completed!";
			textBox.appendChild(p);

			p = document.createElement("p");
			p.innerHTML = ">>" + energyCost + " energy was lost!";
			textBox.appendChild(p);

			p = document.createElement("p");
			p.innerHTML = ">>" + motivationCost + " motivation was lost!";
			textBox.appendChild(p);

			if (enemyProgress >= enemyPN)//finishing a project
			{
				p = document.createElement("p");
				p.innerHTML = ">>You completed the project!!";
				textBox.appendChild(p);
				document.getElementById("enemyImage").firstChild.src = "images/projectImages/blank.png";
				
				enemyType = -1;
				enemyProgress = 0;
				projectsCompleted++;
			}
			
			p = document.createElement("p");
			p.innerHTML = "Select your next action...";
			textBox.appendChild(p);

			playerMot = Math.max(0, playerMot - motivationCost);
			playerEng = Math.max(0, playerEng - energyCost);
		}
		
		else
		
		{
			var textBox = document.getElementById("textBox");
			while (textBox.firstChild) {
				textBox.removeChild(textBox.firstChild);
			}
			
			var p = document.createElement("p");
			p.innerHTML = "There was nothing to do...";
			textBox.appendChild(p);
		}
		setTimeout(clearProgress, 300);
		updateHud();
		flipTurn();
		advanceDay();
		playerAction = 1;
	}
}

function takeNap() {
	if (playerTurn) {
		playerEng = 100;
		
		var bg = document.getElementById("topField");
		bg.style.backgroundColor = '#F1ECCE';

		//crlearing the feed
		var textBox = document.getElementById("textBox");
		while (textBox.firstChild) {
			textBox.removeChild(textBox.firstChild);
		}

		var p = document.createElement("p");
		p.innerHTML = "You napped the day away!";
		textBox.appendChild(p);

		p = document.createElement("p");
		p.innerHTML = ">>Your energy has been fully restored!";
		textBox.appendChild(p);

		p = document.createElement("p");
		p.innerHTML = "Select your next action...";
		textBox.appendChild(p);
		
		setTimeout(clearProgress, 300);

		updateHud();
		flipTurn();
		advanceDay();
		playerAction = 2;
	}
}

function readSomething() {
	if (playerTurn) {
		playerMot = 100;

		var bg = document.getElementById("topField");
		bg.style.backgroundColor = '#E08D79';

		//clearing the feed
		var textBox = document.getElementById("textBox");
		while (textBox.firstChild) {
			textBox.removeChild(textBox.firstChild);
	}

	var p = document.createElement("p");
	p.innerHTML = "You read some interesting articles!";
	textBox.appendChild(p);

	p = document.createElement("p");
	p.innerHTML = ">>Your motivation has been fully restored!";
	textBox.appendChild(p);

	p = document.createElement("p");
	p.innerHTML = "Select your next action...";
	textBox.appendChild(p);

	setTimeout(clearProgress, 300);

	updateHud();
	flipTurn();
	advanceDay();
	playerAction = 3;
	}
}

function clearProgress() {
	var bg = document.getElementById("topField");
	bg.style.backgroundColor = '#9FC2CC';
	flipTurn();
}

function updateHud() {
	var progress = ((enemyProgress / enemyPN) * 100);
	progress = progress.toPrecision(3);

	var hud = document.getElementById("HUD");
	while (hud.firstChild) {
		hud.removeChild(hud.firstChild);
	}
	var p = document.createElement("p");
	
	if (enemyType != -1)
	{
		p.innerHTML = "Progress//" + progress + "%";
		hud.appendChild(p);
	}
	else
	{
		p.innerHTML = "No Current Project";
		hud.appendChild(p);
	}
	
	var p = document.createElement("p");
	p.innerHTML = "Energy//" + playerEng;
	hud.appendChild(p);

	p = document.createElement("p");
	p.innerHTML = "Motivation//" + playerMot;
	hud.appendChild(p);

	
}

function flipTurn() {
	playerTurn = !playerTurn;
}

function createEnemy() {
	enemyType = Math.floor(Math.random() * Math.floor(7)); //creates a random number from 0 to 7
	
	var p = document.createElement("p");
	p.innerHTML = "A new project approaches!!";
	var textBox = document.getElementById("textBox");

	enemyProgress = 0; //Resets the Progress value

	switch (enemyType) {
		case 0:
			{
				enemyPN = 550;
				energyCost = 10;
				motivationCost = 10;

				p = document.createElement("p");
				p.innerHTML = ">>A Common Side Project has appeared!";
				textBox.appendChild(p);
				document.getElementById("enemyImage").firstChild.src = "images/projectImages/common-side.png";
			}
			break;

		case 1:
			{
				enemyPN = 400;
				energyCost = 7;
				motivationCost = 73;

				p = document.createElement("p");
				p.innerHTML = ">>A Self Taught Disaster has appeared!";
				textBox.appendChild(p);
				document.getElementById("enemyImage").firstChild.src = "images/projectImages/self-taught.png";
			}
			break;

		case 2:
			{
				enemyPN = 470;
				energyCost = 52;
				motivationCost = 8;

				p = document.createElement("p");
				p.innerHTML = ">>A Portfolio Builder has appeared!";
				textBox.appendChild(p);
				document.getElementById("enemyImage").firstChild.src = "images/projectImages/portfolio-builder.png";
			}
			break;

		case 3:
			{
				enemyPN = 410;
				energyCost = 70;
				motivationCost = 5;

				p = document.createElement("p");
				p.innerHTML = ">>A Raging Passion Project has appeared!";
				textBox.appendChild(p);
				document.getElementById("enemyImage").firstChild.src = "images/projectImages/raging-passion.png";
			}
			break;

		case 4:
			{
				enemyPN = 470;
				energyCost = 12;
				motivationCost = 48;

				p = document.createElement("p");
				p.innerHTML = ">>A Menial Ordeal has appeared!";
				textBox.appendChild(p);
				document.getElementById("enemyImage").firstChild.src = "images/projectImages/menial-ordeal.png";
			}
			break;
			
		case 5:
			{
				enemyPN = 175;
				energyCost = 100;
				motivationCost = 11;

				p = document.createElement("p");
				p.innerHTML = ">>An Enjoyable Learning Experience has appeared!";
				textBox.appendChild(p);
				document.getElementById("enemyImage").firstChild.src = "images/projectImages/enjoyable-learning.png";
			}
			break;
			
		case 6:
			{
				enemyPN = 175;
				energyCost = 11;
				motivationCost = 100;

				p = document.createElement("p");
				p.innerHTML = ">>A Demoralizing Future Defeat  has appeared!";
				textBox.appendChild(p);
				document.getElementById("enemyImage").firstChild.src = "images/projectImages/demoralizing-future.png";
			}
			break;
	}
	updateHud();
}

function advanceDay() {
	if (day < 6)
		day++;
	else
	{
		day = 0;
		if (enemyType != -1) //If the current project isnt complete
		{
			alert("Game Over! \nYou didn't finish before the deadline! \nYou completed " + projectsCompleted + " projects though!");
			location.reload(); 
		}
		else
		{
			createEnemy();
		}
	}

	var deadline = document.getElementById("deadline");
	clean(deadline);
	
	var arr = deadline.childNodes;
	for (var i = 0; i < arr.length; i++) {
		arr[i].style.backgroundColor = "";
	}

	arr[day].style.backgroundColor = '#795663';
}

function clean(node) {	//to remove white spaces from the DOM

  for(var n = 0; n < node.childNodes.length; n ++)
  {
    var child = node.childNodes[n];
    if
    (child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue)))
    {
      node.removeChild(child);
      n --;
    }
    else if(child.nodeType === 1)
    {
      clean(child);
    }
  }
}