//this prgram uses a Box class called from boxClass.js on the web page
var BoxGameApp = function() {

	var context;
	var canvasId;
	
	//canvas position on webpage. This is needed to calculate the mouse X,Y position
	//when a click happens
	var canvasPosXY;

	var loopTime;
	var addImgObj;

	//mouse event booleans used in game handling functions that need to know what the user is doing
	var isMouseDown;
	var isMouseMove;
	var isMouseUp;

	//var itemActive; //true when a box is selected

	var curBoxActiveObj;

	//var lowestBoxBottom;
	
	//box object that is used as the base game board area
	//var gameBox;
	
	var boxAr;
	var boxCnt;

	var animations;
	var gameBoard;
	//var animationAr;
	//var animationCnt;

	//var defaultWidth;

	var dyScrnMoveObj;
	
	var TEMPVALUE;

/*var levelAr=new Array(  0,0,0,0,0,
                        0,0,0,1,0,
                        0,0,0,1,0,
                        0,0,0,1,0,
                        0,0,0,1,0,
                        0,0,0,1,1);*/
	var levelAr=new Array(  5,6,12,0,0, //top row for level data
							0,0,0,0,0, //bottom rows are the game design
							0,0,1,0,0,
							0,0,1,0,0,
							0,0,1,0,0,
							0,0,1,0,0,
							0,0,1,0,1);
						//*/
	var levelGamePeices = 12;
	//var levelArSize = new Array( 5,6); //x length, y length
	//var levelBlockSize = new Array(35,35); //block width, block height
	//var boardPosition = new Array(30,200);//x position, y position

	var gameHandlerObj;

	var shadowBox; 				//this box shows up where a playable box would go if the user lets go
	var shadowBoxShow;
	
	var xIndex;
	var yIndex;
	//var dynamicHeight;
	//var dynamicCurBottom;
	//var dyMoveStartPos;
	//var dyMoveCBStart;

	function dToR(angle){return angle*Math.PI/180;}
	/***************************************************************************************
	*                                  Board Object                                        *
	*     Holds game board size, size of elements, position on canvas                      *
	****************************************************************************************/
	//constructor
	function Board(){
		this.pWidth = 36;
		this.pHeight = 36;
		this.xPos =20;
		this.yPos =200;
		this.col =5;
		this.row =6;
		this.box = new Box(new Rect(this.xPos,this.yPos,(this.pWidth*this.col),(this.pHeight*this.row)),"#ffff00","#ffffff", 1);
		//this.gamePeices = 12;
	}
	//funtion to resize game Board box object
	Board.prototype.resizeBox = function(){
		this.box = new Box(new Rect(this.xPos,this.yPos,(this.pWidth*this.col),(this.pHeight*this.row)),"#ffff00","#ffffff", 1);
	}
	

	/***************************************************************************************
	*                                  Gabbed Box Object                                   *
	*     Grabbed box object used when a puzzle peice is grabbed by the user               *
	****************************************************************************************/	
	//constructor
	//boxGrabbed set to true when a plable box is selected by mouse / touch
	//boxGrabbedIndex is the box array index of the grabbed box
	//indexOnBoard is the puzzle board index that the grabbed peice can be played
	//xGrab values are used in moving the box properlly from where its grabbed
	
	function GrabbedBox(){
		this.boxGrabbed = false;
		this.boxGrabbedIndex = -1;
		this.overObstacleIndex = -1;
		this.indexOnBoard = -1
		this.xInitial = 0;
		this.yInitial = 0;
		this.xGrabOffset = 0;
		this.yGrabOffset = 0;
	}
	/***************************************************************************************
	*                            Extended Box Object Functions                              *
	****************************************************************************************/	
	//adds extra objects to the box object used in this game
	Box.prototype.initGameBox = function(boxType,bIndex) {
		//boxAr[boxCnt] = new Box(xPos,yPos,levelBlockSize[0],levelBlockSize[1],fillCol,lineCol,1);
		this.boxType = boxType
		//boxAr[boxCnt].tempAdjust = false;
		this.initLocX = this.rect.xPos;
		this.initLocY = this.rect.yPos;
		this.boardIndex = bIndex;
		//boxAr[boxCnt].inPlay = false;
		this.moveDir = NOMOVE;
		this.movedDir = NOMOVE;
		//this.initPosRect = ;
		this.emptyBoxHasPuzzlePeice = false;
		this.animationID = -1;//index ID to this objects animations if any
		//boxCnt++;
	}
	/* //calls boxes animation if used and then draws the box
	Box.prototype.drawAnBox = function(){
		var updatedRect;
		if (this.animationID > -1){
			updatedRect = animations.getAnimatedRect(this.animationID) != -1;
			if (updatedRect = animations.getAnimatedRect(this.animationID) != -){
				this.updateBox(updatedRect);
			}
		}
		this.makeBox(context);
	}*/


	//-----------------------------------------------------------------------------------------------------------------	
	//drawing functions
	//-----------------------------------------------------------------------------------------------------------------

	function draw(){
		var anRect;
		context.clearRect(0, 0, 320,480);

		gameBoard.box.makeBox(context);
		//run all queued animations
		animations.runAnimations();
		for(i=0;i<boxCnt;i++){
			//check if this box has an animation associated with it
			if (boxAr[i].animationID > -1){
				//get the current Rect dimensions
				anRect = animations.getAnimatedRect(boxAr[i].animationID);
				//if this function returns null, the animation is complete, reset animationID
				//if it is not null, relace the boxes current rect with the animation's one.
				if (!anRect)
					boxAr[i].animationID = -1;
				else
					boxAr[i].rect = anRect;
					
			}
			boxAr[i].makeBox(context);
			/*if (boxAr[i].boxType != EMPTYBOX){
				if (boxAr[i].emptyBoxHasPuzzlePeice == true){
					boxAr[i].updateColors( "#000000", "#000000");
				}
				boxAr[i].drawAnBox();
			}*/
			
		}
		/*if (animations.AnimationQueue[boxAr[0].animationID])
			TEMPVALUE = animations.AnimationQueue[boxAr[0].animationID].rectFinal.xPos;
		context.fillText(TEMPVALUE.toFixed(0),100,10);
		context.fillText(boxAr[0].moveDir.toFixed(0)+" - "+boxAr[0].movedDir.toFixed(0),100,20);
		context.fillText(boxAr[0].animationID.toFixed(0),100,30);
		context.fillText(xIndex.toFixed(0) + " - "+yIndex.toFixed(0),100,40);*/
		//var imageObj = new Image();
		//imageObj.src = "chute.png"; 
		//context.globalAlpha = 1;
		//context.drawImage(imageObj, 218,13);

	}

	//initialize objects
	function initImg(imgObj, imgSrc,xPos,yPos,width,height){
		imgObj.xPos = xPos;
		imgObj.yPos = yPos;
		imgObj.width = width;
		imgObj.height = height;
		imgObj.img = new Image();
		imgObj.img.src = imgSrc;
	}


	//same function as above, but sets extra fields
	//boxType means its invisible, a board eice, or a playabloe peice
	//board index is a saved index of where this square is on the game board
	//	this is referenced to see if the game is complete
	var EMPTYBOX = 0;
	var BOARDBOX = 1;
	var PLAYABLEBOX = 2;
	var NOMOVE = 0;
	var MOVERIGHT = 1;
	var MOVELEFT = 2;
	

	function makeGameBox(xPos,yPos,width,height,fillCol,lineCol,boxType,bIndex){
		boxAr[boxCnt] = new Box(new Rect(xPos,yPos,width,height),fillCol,lineCol,1);
		boxAr[boxCnt].initGameBox(boxType,bIndex); 
		boxCnt++;
	}
	/**
			this.pWidth = 35;
		this.pHeight = 35;
		this.xPos =30;
		this.yPos =200;
		this.col =5;
		this.row =6;
	*/
	//initializes block objects for a level
	function initLevel(){
		var xPos;
		var yPos;
		var playablePeices;
		//create obstacle ojects
		if (levelAr.length > 5){
			//first two elements are the game boards dimensions
			gameBoard.col = levelAr[0];
			gameBoard.row = levelAr[1];
			//remake the game board with this new information
			gameBoard.resizeBox();
			playablePeices = levelAr[2];
			for (i=5;i<levelAr.length;i++){
				yPos = Math.floor((i-5)/gameBoard.col)* gameBoard.pHeight + gameBoard.yPos;
				xPos = ((i-5) - (Math.floor((i-5)/gameBoard.col) *gameBoard.col)) * gameBoard.pWidth + gameBoard.xPos;
				if (levelAr[i] == 1)
					makeGameBox(xPos ,yPos,gameBoard.pWidth,gameBoard.pHeight,"#990000","#ff3333",BOARDBOX,(i-5));//red
			}
			for (i=0;i<playablePeices;i++){
				yPos = (gameBoard.box.rect.height + gameBoard.yPos) - ((i+1) * gameBoard.pHeight);
				//yPos = (levelArSize[1]*levelBlockSize[1]) - ((i+1) * levelBlockSize[1])+ boardPosition[1];//     Math.floor(i/levelArSize[0])* levelBlockSize[1] + boardPosition[1];
				xPos = 250;
				//make playable blocks. their board index is -1 because they are not on the board yet
				makeGameBox(xPos ,yPos,gameBoard.pWidth,gameBoard.pHeight,"#6666cc","#ccccff",PLAYABLEBOX,-1);//blue
			}
		}
	}
			
		/*for (i=0;i<levelAr.length;i++){
		   // if (levelAr[i] > 0){
				yPos = Math.floor(i/levelArSize[0])* levelBlockSize[1] + boardPosition[1];
				xPos = (i - (Math.floor(i/levelArSize[0]) *levelArSize[0])) * levelBlockSize[0] + boardPosition[0];
				//check if box is a board peice or not
				if (levelAr[i] == 1) bType = BOARDBOX;
				else bType = EMPTYBOX;
				makeGameBox(xPos ,yPos,levelBlockSize[0],levelBlockSize[1],"#990000","#ff3333",bType,i);// red
			//}
		}
		//create moveable game objects
		for (i=0;i<levelGamePeices;i++){
			yPos = (levelArSize[1]*levelBlockSize[1]) - ((i+1) * levelBlockSize[1])+ boardPosition[1];//     Math.floor(i/levelArSize[0])* levelBlockSize[1] + boardPosition[1];
			xPos = 250;
			//make playable blocks. their board index is -1 because they are not on the board yet
			makeGameBox(xPos ,yPos,levelBlockSize[0],levelBlockSize[1],"#6666cc","#ccccff",PLAYABLEBOX,-1);//blue
		}
		//create shadowBox object
		//initBox(shadowBox,0,0,levelBlockSize[0],levelBlockSize[1],"#6666cc","#ccccff",0);

	}*/

	//------------------------------------------------------------------------------------------------------------
	//main app functions
	//------------------------------------------------------------------------------------------------------------
	//app initialization function
	var init = function(canvasName){
		
		//var tmpBox = new Object;
		canvasId =  document.getElementById(canvasName);
		context = canvasId.getContext('2d');
		//find canvas position. This is used to find the mouse position inside the canvas
		var tempCanvasRect = canvasId.getBoundingClientRect(); 
		canvasPosXY = {
			x: tempCanvasRect.left,
			y: tempCanvasRect.top
		};
		TEMPVALUE = 0;
		xIndex = 0;
		yIndex = 0;
		
		
		loopTime = 20;
		
		boxAr = new Array();
		//animationAr = new Array();
		
		gameBoard = new Board();
		boxCnt=0;
		
		//lowestBoxBottom = 0;

		isMouseDown = false;
		isMouseMove = false;
		isMouseUp = false;

		gameHandlerObj = new Object;
		gameHandlerObj.boxSelected = 0;
		gameHandlerObj.levelComplete = false;
		grabbedBox = new GrabbedBox();

		gameHandlerObj.boardPeiceOrigXPos = 0;
		gameHandlerObj.boardPeiceOrigYPos = 0;
		gameHandlerObj.boardIndex = -1;
		gameHandlerObj.boardBlockIndex = 0;
		gameHandlerObj.boardPeiceInPlay = false;

		gameHandlerObj.boardPeicePushed = 0;

		shadowBox = new Object;

		//makeListBox(10,40,"#6666cc","#ccccff");
		
		//addImgObj = new Object;
		//initImg(addImgObj, "addBtn2.jpg",0,410,320,30);
		//context.strokeStyle = "#ffff00";
		//context.fillStyle = "#ffffff";
		//roundBox(boardPosition[0], boardPosition[1], levelArSize[0]* levelBlockSize[0], levelArSize[1]* levelBlockSize[1], 1,1);
		//gameBox = new Box(new Rect(boardPosition[0], boardPosition[1], levelArSize[0]* levelBlockSize[0], levelArSize[1]* levelBlockSize[1]),"#ffff00","#ffffff", 1);
		initLevel();
		
		
		
		canvasId.addEventListener("mousedown", mouseDown, false);
		canvasId.addEventListener("mousemove", mouseMove, false);
		canvasId.addEventListener("mouseup", mouseUp, false);
		
		canvasId.addEventListener("touchstart", touchesDown, false);
		canvasId.addEventListener("touchmove", touchesMove, false);
		canvasId.addEventListener("touchend", touchesUp, false);//*/
		//window.onorientationchange = resetCanvas;  
		//window.onresize = resetCanvas;
		animations = new AnimationSystem(20);
		setInterval(gameLoop,20);
		
		
	};
	

	function gameLoop(){

		var insertBtwDB = 20;
		var bottomBounds;
		var moveDown = false;
		var moveDownFrom = 0;	
		gameHandlerFunc();
		draw();
	}
	
	function whereOnBox(boxObj){
		var rowsDown = Math.floor(boxObj.boardIndex/gameBoard.col);
		var rect = new Rect(
			(boxObj.boardIndex - rowsDown * gameBoard.col) * gameBoard.pWidth,// x pos
			rowsDown * gameBoard.pHeight, // y pos
			gameBoard.pWidth, gameBoard.pHeight); // width and height
			
		return boxObj.checkBoxToBox(rect);
	}
	
	function getBoxPosFromIndex(index){
		var rowsDown = Math.floor(index/gameBoard.col);
		var rect = new Rect(
			((index - rowsDown * gameBoard.col) * gameBoard.pWidth) + gameBoard.xPos,// x pos
			rowsDown * gameBoard.pHeight + gameBoard.yPos, // y pos
			gameBoard.pWidth, gameBoard.pHeight); // width and height
			
		return rect;
	}
	
	var PUZZLEPEICEINPLAY = 1;
	var PUZZLEPEICERELEASED = 2;
	var PUZZLEPEICEMOVED = 3;
	function gameHandlerFunc(){
		var puzzlePeiceHandler=0;
		var selectedBoxObj;
		//var tempXindex;
		//var tempYindex;
		var boxSurroundedType;
		var rectFinal;
		var rectOnBoard; //the position of a obstacle on the board, not when animated
		var ObstacleNewIndex;
		/*var touchedside;
		
		var lowestOpenSpaceIndex;
		var columnAr;
		var columnArCnt;
		var boardBoxToBeReplacedIndex;
		var newXPosition;
		var newYPosition;
		var tempV1;
		var tempV2;*/



		//columnAr = new Array(10);
		//columnArCnt = 0;

		if ((grabbedBox.boxGrabbed) &&(isMouseDown))
			puzzlePeiceHandler = PUZZLEPEICEINPLAY;
		else if ((grabbedBox.boxGrabbed)&&(isMouseUp))
			puzzlePeiceHandler = PUZZLEPEICERELEASED;
		//else if ((grabbedBox.boxGrabbed)&&(isMouseMove))
			//puzzlePeiceHandler = PUZZLEPEICEMOVED;
		isMouseUp = false;
		
		switch (puzzlePeiceHandler){
			case PUZZLEPEICEINPLAY:
				selectedBoxObj = boxAr[grabbedBox.boxGrabbedIndex];
				var xCenter = selectedBoxObj.rect.xPos + selectedBoxObj.rect.width/2;
				var yCenter = selectedBoxObj.rect.yPos + selectedBoxObj.rect.height/2;
				xIndex = Math.floor((xCenter-gameBoard.xPos)/gameBoard.pWidth)+1;
				yIndex = Math.floor((yCenter-gameBoard.yPos)/gameBoard.pHeight)+1;
				var checkIndex = -1;
				if ((xIndex <= gameBoard.col)&&(yIndex <= gameBoard.row)&&(xIndex > 0)&&(yIndex>0))
					checkIndex = xIndex+((yIndex-1)*gameBoard.col)-1;
				grabbedBox.indexOnBoard = checkIndex;//checkIndex is a playable spot, set the grabbedBox value
				
				for(var i=0;i<boxCnt;i++){
					//check if board index has anything on it.
					if ((boxAr[i].boardIndex == checkIndex) && (boxAr[i].boardIndex > 0)){	
						if (boxAr[i].boxType == BOARDBOX){
							rectOnBoard = getBoxPosFromIndex(boxAr[i].boardIndex);
							touchedside = selectedBoxObj.checkBoxToBox(rectOnBoard);
							rectFinal = getBoxPosFromIndex(boxAr[i].boardIndex);
							boxSurroundedType = checkBoxSurrounded(i);
							grabbedBox.indexOnBoard = boxAr[i].boardIndex;
							grabbedBox.overObstacleIndex = i;
							
							if ((boxSurroundedType == BOXONTHERIGHT)||((boxSurroundedType == BOXALONE)&&(touchedside == 1)))
								boxAr[i].moveDir = MOVERIGHT;
							else if ((boxSurroundedType == BOXONTHELEFT)||((boxSurroundedType == BOXALONE)&&(touchedside != 1)))
								boxAr[i].moveDir = MOVELEFT;
							else{
								boxAr[i].moveDir = NOMOVE;
								grabbedBox.indexOnBoard = -1;//can't use this spot, unset the brabbedBox board index
							}
							//call for animation to move box
							if (boxAr[i].movedDir != boxAr[i].moveDir){
								boxAr[i].movedDir = boxAr[i].moveDir;
								if (boxAr[i].moveDir == MOVERIGHT) rectFinal.xPos += 10;
								else if (boxAr[i].moveDir == MOVELEFT) rectFinal.xPos -= 10;
								boxAr[i].animationID = animations.addAnimation(i,rectFinal,boxAr[i].rect,1,0);
							}
						}
						else if (boxAr[i].boxType == PLAYABLEBOX){//spot already has a playable box
							grabbedBox.indexOnBoard = -1;//can't use this spot, unset the brabbedBox board index
						}
					}
					else{
						if (boxAr[i].movedDir != NOMOVE){
							rectOnBoard = getBoxPosFromIndex(boxAr[i].boardIndex);
							boxAr[i].animationID = animations.addAnimation(i,rectOnBoard,boxAr[i].rect,1,0);
							boxAr[i].movedDir = NOMOVE;
							boxAr[i].moveDir = NOMOVE;
						}
						//empty spot. Do it up
					}
				}
				if (grabbedBox.indexOnBoard == -1)
					grabbedBox.overObstacleIndex = -1;
				 
				break;
			case PUZZLEPEICERELEASED:
				if (grabbedBox.indexOnBoard == -1)
					grabbedBox.overObstacleIndex = -1;
				grabbedBox.boxGrabbed = false;
				selectedBoxObj = boxAr[grabbedBox.boxGrabbedIndex];
				if (grabbedBox.indexOnBoard >= 0){
					selectedBoxObj.boardIndex = grabbedBox.indexOnBoard;
					var onBoardRect = getBoxPosFromIndex(selectedBoxObj.boardIndex);
					selectedBoxObj.animationID = animations.addAnimation(grabbedBox.boxGrabbedIndex,onBoardRect,selectedBoxObj.rect,0.5,0);
					//if tyhere is an obstacle that can be moved, move it
					if (grabbedBox.overObstacleIndex > -1){
						var obstacleObj = boxAr[grabbedBox.overObstacleIndex];//pointer to obstacle array object
						//find the lowest index on the board that the box can drop to.
						if (obstacleObj.moveDir == MOVERIGHT)//adjust index +1 if moving to the right and down
							ObstacleNewIndex = findLowestOpenSpot(selectedBoxObj.boardIndex+1);
						else//adjust index to the left if moving left and down
							ObstacleNewIndex = findLowestOpenSpot(selectedBoxObj.boardIndex-1);
						var newObstaclePosRect = getBoxPosFromIndex(ObstacleNewIndex);
						obstacleObj.boardIndex = ObstacleNewIndex;
						obstacleObj.animationID = animations.addAnimation(grabbedBox.overObstacleIndex,newObstaclePosRect,obstacleObj.rect,0.5,0);
						obstacleObj.moveDir = NOMOVE;
					}
				}
				else{
					var backRect = new Rect(grabbedBox.xInitial, grabbedBox.yInitial, gameBoard.pWidth, gameBoard.pHeight);
					selectedBoxObj.animationID = animations.addAnimation(grabbedBox.boxGrabbedIndex,backRect,selectedBoxObj.rect,1,0);
				}
				break;
			//case PUZZLEPEICEMOVED:
				//break;
				//___.animationID = addAnimation(rectFinal,rectInit,time,delay)
		}
	}
/*
	var PUZZLEPEICEINPLAY = 1;
	var PUZZLEPEICERELEASED = 2
	function gameHandlerFunc(){
		var puzzlePeiceHandler=0;
		var touchedside;
		var boxSurroundedType;
		var selectedBoxObj;
		var lowestOpenSpaceIndex;
		var columnAr;
		var columnArCnt;
		var boardBoxToBeReplacedIndex;
		var newXPosition;
		var newYPosition;
		var tempV1;
		var tempV2;



		columnAr = new Array(10);
		columnArCnt = 0;

		if ((grabbedBox.boxGrabbed) &&(isMouseDown))
			puzzlePeiceHandler = PUZZLEPEICEINPLAY;
		else if ((grabbedBox.boxGrabbed)&&(isMouseUp))
			puzzlePeiceHandler = PUZZLEPEICERELEASED;
		isMouseUp = false;
		switch (puzzlePeiceHandler){
			case PUZZLEPEICEINPLAY:
				//set board spot index to none. this will get set later if the puzzle peice is over a game board.
				gameHandlerObj.boardBlockIndex = -1;
				//check if in playable board
				selectedBoxObj = boxAr[grabbedBox.boxGrabbedIndex];
				for(var i=0;i<boxCnt;i++){
					if (boxAr[i].boxType != PLAYABLEBOX){
						touchedside = selectedBoxObj.checkBoxToBox(new Rect(boxAr[i].initLocX,boxAr[i].initLocY,boxAr[i].rect.width,boxAr[i].rect.height));
						//is puzzel peice inside a board position
						if (touchedside > 0){
							
							//set this boxes index as where the puzzle box will move to
							gameHandlerObj.boardBlockIndex = i;
							//check if board location has an obstacle.
							if (boxAr[i].boxType == BOARDBOX){
								//I need to make sure that this box is not blocked
								//If it is, I will set the index back to -1
								//Can Puzzle peice be placed here?
								boxSurroundedType = checkBoxSurrounded(boxAr[i]);
								if ((boxSurroundedType != BOXESONBOTHSIDES)  ){
									//hadle obstacle animation
									//this board box must be marked as being slected. It should also have a direction
									//this box will just be marked with a direction, or none at all
									//I need to make sure, out side of all of these conditionals that 
									//another box that was animated	goes back to its origional position
									switch (boxSurroundedType){
										case BOXONTHERIGHT: 
											boxAr[i].moveDir = MOVELEFT; 
											break;
										case BOXONTHELEFT: 
											boxAr[i].moveDir = MOVERIGHT;
											break;
										case BOXALONE:
											//box can move either way, we will figure this out based on what side 
											//the puzzle box is on
											if (touchedside == 1)//left side
												boxAr[i].moveDir = MOVERIGHT;	
											else//right side
												boxAr[i].moveDir = MOVELEFT;
											break;
									}
								}
								else
									gameHandlerObj.boardBlockIndex = -1;	
							}	
						}
						//boardBLockIndex is the spot of the puzzle board that the selected box may be positioned
						//this will move the board obstacle to the right or left demonstrating which way it will 
						//fall. I should use my animation logic for this. baby steps
						if (gameHandlerObj.boardBlockIndex == i){
							if (boxAr[i].moveDir == MOVERIGHT)
								boxAr[i].rect.xPos = boxAr[i].initLocX+10;
							else if (boxAr[i].moveDir == MOVELEFT)
								boxAr[i].rect.xPos = boxAr[i].initLocX-10;
						}
						else if (boxAr[i].moveDir != NOMOVE){
							boxAr[i].moveDir = NOMOVE;	
							boxAr[i].rect.xPos = boxAr[i].initLocX;
							//boxAr[i].yPos = boxAr[i].initLocY;
						}

						//make sure another board box that was selected animates back to its normal position
							 
					}
					
				}
				break;
			case PUZZLEPEICERELEASED:
				//handle selected puzzle peice location
				selectedBoxObj = boxAr[grabbedBox.boxGrabbedIndex];
				if (gameHandlerObj.boardBlockIndex != -1){
					if (boxAr[gameHandlerObj.boardBlockIndex].emptyBoxHasPuzzlePeice == false){
						//puzzle peice has been placed, update with new info
						
						selectedBoxObj.rect.xPos = boxAr[gameHandlerObj.boardBlockIndex].initLocX;
						selectedBoxObj.rect.yPos = boxAr[gameHandlerObj.boardBlockIndex].initLocY;
						selectedBoxObj.initLocX = boxAr[gameHandlerObj.boardBlockIndex].initLocX;
						selectedBoxObj.initLocY = boxAr[gameHandlerObj.boardBlockIndex].initLocY;
						//boxAr[gameHandlerObj.boardBlockIndex].emptyBoxHasPuzzlePeice = true;
						//if puzzle peice can be placed, place it. If not, return to puzzle peice pile.
						//calculate where obstacle will fall if applicable. and set animation
						//check if puzzle is finished

						//is this puzzle area an obstacle. If so I will move it


						if (boxAr[gameHandlerObj.boardBlockIndex].boxType == BOARDBOX){
							//set lowest postion index to current board box position
							if (boxAr[gameHandlerObj.boardBlockIndex].moveDir != NOMOVE){
								lowestOpenSpaceIndex = 0;//gameHandlerObj.boardBlockIndex;
								//move to the right
								if (boxAr[gameHandlerObj.boardBlockIndex].moveDir == MOVERIGHT)	
									//move current xposition one block's length to the right
									newXPosition = boxAr[gameHandlerObj.boardBlockIndex].initLocX +levelBlockSize[0];
									//boxAr[gameHandlerObj.boardBlockIndex].xPos = boxAr[gameHandlerObj.boardBlockIndex].initLocX +levelBlockSize[0];

								if (boxAr[gameHandlerObj.boardBlockIndex].moveDir == MOVELEFT)	
									//move current xposition one block's length to the left
									//boxAr[gameHandlerObj.boardBlockIndex].xPos = boxAr[gameHandlerObj.boardBlockIndex].initLocX -levelBlockSize[0];
									newXPosition = boxAr[gameHandlerObj.boardBlockIndex].initLocX -levelBlockSize[0];

								//check if there are other obstacles beneath thisone
								//this first loop creates an array of each box in the column. It is ordered
								for (var i=0;i<boxCnt;i++){
									//box is in the same column
									if (boxAr[i].initLocX == newXPosition){
										//make sure that the box is playable and not covered by a puzzle peice
										if ((boxAr[i].boxType != PLAYABLEBOX)){//&&(boxAr[i].emptyBoxHasPuzzlePeice == false)){
											tempV1 = (boxAr[i].rect.yPos - boardPosition[1])/levelBlockSize[1];
											columnAr[tempV1] = i;
											columnArCnt++;
										}
									}
								}
								//check every box from the top down to find the lowest empty box
								for (var i=0;i<columnArCnt;i++){
									tempV1 = columnAr[i];
									tempV1 = boxAr[tempV1].initLocY;
									tempV2 =  boxAr[gameHandlerObj.boardBlockIndex].initLocY;
									if (boxAr[columnAr[i]].initLocY >= boxAr[gameHandlerObj.boardBlockIndex].initLocY){
										if ((boxAr[columnAr[i]].boxType == EMPTYBOX)&&(boxAr[columnAr[i]].emptyBoxHasPuzzlePeice == false))
											lowestOpenSpaceIndex = columnAr[i];
										else
											break;
									}
								}	
								if (lowestOpenSpaceIndex >= 0){
									//boxAr[gameHandlerObj.boardBlockIndex].yPos = boxAr[lowestOpenSpaceIndex].yPos;/////////////newXPosition
									newYPosition = boxAr[lowestOpenSpaceIndex].yPos;
									boxAr[lowestOpenSpaceIndex].rect.yPos = boxAr[gameHandlerObj.boardBlockIndex].initLocY;
									boxAr[lowestOpenSpaceIndex].initLocY = boxAr[gameHandlerObj.boardBlockIndex].initLocY;
									boxAr[lowestOpenSpaceIndex].rect.xPos = boxAr[gameHandlerObj.boardBlockIndex].initLocX;
									boxAr[lowestOpenSpaceIndex].initLocX = boxAr[gameHandlerObj.boardBlockIndex].initLocX;
									boxAr[gameHandlerObj.boardBlockIndex].initLocX = newXPosition//boxAr[gameHandlerObj.boardBlockIndex].xPos;
									boxAr[gameHandlerObj.boardBlockIndex].initLocY = newYPosition;//boxAr[gameHandlerObj.boardBlockIndex].yPos;
									boxAr[lowestOpenSpaceIndex].emptyBoxHasPuzzlePeice = true;

									setAnimation(boxAr[gameHandlerObj.boardBlockIndex],newXPosition,newYPosition,0,0,.5,0);
								}
								
							}
						}
						else // empty box, assign as having apuzzle peice.
							boxAr[gameHandlerObj.boardBlockIndex].emptyBoxHasPuzzlePeice = true;
					}
					else{
						//puzzle peice has not been placed. Return to its original loaction
						selectedBoxObj.rect.xPos = selectedBoxObj.initLocX;
						selectedBoxObj.rect.yPos = selectedBoxObj.initLocY;
					}
				}
				else {
					//puzzle peice has not been placed. Return to its original loaction
					selectedBoxObj.rect.xPos = selectedBoxObj.initLocX;
					selectedBoxObj.rect.yPos = selectedBoxObj.initLocY;
				}
				//release puzzle box
				grabbedBox.boxGrabbed = false;
				break;
			
		}

	}
*/
	//returns 3 if surrounded on both sides
	//returns 1 if only on right
	//returns 2 if onl on left
	//function uses blocks initial location as opposed to current Xpos/YPos to handle animations
	var BOXESONBOTHSIDES = 3;
	var BOXONTHELEFT = 2;
	var BOXONTHERIGHT = 1;
	var BOXALONE = 0;
	function checkBoxSurrounded(index){
		var hasLeft = false;
		var hasRight = false;
		var rowPos = Math.floor(boxAr[index].boardIndex/gameBoard.col);
		var colPos = boxAr[index].boardIndex - rowPos*gameBoard.col;
		if (colPos == 0) hasLeft = true;
		if (colPos == gameBoard.col) hasRight = true;
		for(var i=0;i<boxCnt;i++){
			if (boxAr[i].boardIndex == boxAr[index].boardIndex-1)
				hasRight = true;
			if (boxAr[i].boardIndex == boxAr[index].boardIndex+1)
				hasLeft = true;
		}
		if ((hasRight)&&(hasLeft))
			return 3;
		else if (hasRight)
			return 1;
		else if (hasLeft)
			return 2;
		return 0;
	}

	//finds if there is any open board spots
	//the inex is the index on the game board, not the boxAr index
	function findLowestOpenSpot(index){
		var retIndex = -1;
		var nextDown = 0;
		var rowPos = Math.floor(index/gameBoard.col);
		var colPos = index - rowPos*gameBoard.col;
		
		for(var i=0;i<boxCnt;i++){
			if (boxAr[i].boardIndex > index){
				var maxX = ((gameBoard.col*gameBoard.row)-(gameBoard.col-colPos)-index)/gameBoard.col;
				for (var x=1;x<=maxX;x++){
					nextDown = index+x*gameBoard.col;
					if (boxAr[i].boardIndex == nextDown){
						retIndex = index+(x-1)*gameBoard.col;
						return retIndex;
					}
				}
				
			}
		}
		if (retIndex == -1)
			retIndex = index+maxX*gameBoard.col;
		return retIndex;
	}
	//-----------------------------------------------------------------------------------------------------------------
	//control operations
	//-----------------------------------------------------------------------------------------------------------------

	function initMouseSelect(mousePos){
		var inBounds = false;
		var xPos = mousePos.pageX - canvasPosXY.x;//2;
		var yPos = mousePos.pageY - canvasPosXY.y;//2;

		isMouseDown = true;
		
		//ind if a box is selected then check if it is selectable
		//if so, set game to move this box
		for (i=0;i<boxCnt;i++){
			if (boxAr[i].pointInBounds(xPos,yPos)){
				if (!grabbedBox.boxGrabbed){
					if (boxAr[i].boxType == PLAYABLEBOX){
						//grabbedBoxPos
						grabbedBox.boxGrabbed = true;
						grabbedBox.boxGrabbedIndex = i;
						//offset uset to position box relative to where it was grabbed
						grabbedBox.xGrabOffset = boxAr[i].rect.xPos - xPos;
						grabbedBox.yGrabOffset = boxAr[i].rect.yPos - yPos;
						//saved last position for animation to return box
						grabbedBox.xInitial = boxAr[i].rect.xPos;
						grabbedBox.yInitial = boxAr[i].rect.yPos;
					}
				}
			}
		}
	}
	//mouse move handler
	function mouseMoveHandler(mousePos){
		var xPos;
		var yPos;
		
		if (isMouseDown){
		    xPos = mousePos.pageX - canvasPosXY.x;//2;
		    yPos = mousePos.pageY - canvasPosXY.y;//2;

		    isMouseMove = true;
		    //if a puzzle piece is currently selected, move it with the mouse cursor
		    //there is an offset from whereever the mouse grabbed the box to the (x,y) position
		    if ((grabbedBox.boxGrabbed)&&(grabbedBox.boxGrabbedIndex >= 0)){
			    boxAr[grabbedBox.boxGrabbedIndex].rect.xPos = xPos + grabbedBox.xGrabOffset;
			    boxAr[grabbedBox.boxGrabbedIndex].rect.yPos = yPos + grabbedBox.xGrabOffset;
          }
		}
	}
	function mouseUpHandler(mousePos){

		isMouseUp = true;
		isMouseDown = false;
		isMouseMove = false;

	}


	//interupt handlers. these pass mouse/touch data to appropriate handlers above
	function mouseDown(e){
		initMouseSelect(e);
	}	
	function touchesDown(e){
		e.preventDefault();
		initMouseSelect(e.touches[0]);
	}
	function mouseUp(e){
		mouseUpHandler(e);
	}
	function touchesUp(e){
		e.preventDefault();
		mouseUpHandler(e.touches[0]);
	}
	function mouseMove(e){
		mouseMoveHandler(e);
	}	
	function touchesMove(e){
		e.preventDefault();
		mouseMoveHandler(e.touches[0]);
	}
	/********************************************************************************
	*							Public Functions									*
	*********************************************************************************/
	return {
		//called by web browser
		runApp : function(canvasName){
			init(canvasName);
			setInterval(gameLoop,20);
		}
	};
}();