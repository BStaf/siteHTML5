//this prgram uses a Box class called from boxClass.js on the web page
var BoxesApp = function() {

	var context;
	var canvasId;
	
	//box objects
	var blueBox;
	var redBox;
	var yelBox;
	var grnBox;
	
	//canvas position on webpage. This is needed to calculate the mouse X,Y position
	//when a click happens
	var canvasPosXY;

	var dToR = function(angle){return angle*Math.PI/180;};

	/********************************************************************************
	*			Functions added to Rounded Box class								*
	*********************************************************************************/
	//this initializes animation properties
	Box.prototype.initAnimation = function(growDirection) {
		this.animateUp = this.animateDown = this.isBig = false;
		this.growTMR = 0;
		this.growDirection = growDirection;
	};
	//set box to grow or shrink if clicked on
	Box.prototype.animateOnClick = function(xPos,yPos) {
		if (this.pointInBounds(xPos,yPos)){
			if (!this.isBig){//box is small. make it grow
				this.animateUp = true;
				this.animateDown = false;
				this.isBig = true;
				this.growTMR = 20 - this.growTMR;
			}
			else{//box is big. make it shrink
				this.animateUp = false;
				this.animateDown = true;
				this.isBig = false;
				this.growTMR = 20 - this.growTMR;
			}
		}
	}
	//animates a box object 
	Box.prototype.resizeBox = function() {
		if (this.animateUp){
			//box will grow. increase height and width by to
			this.updateSize(10,10);
			//if box is growing towards the left, decrease the X position
			if (this.growDirection == 1 || this.growDirection == 3)
				this.updatePos(-10,0);
			//if box is growing down, decrease the Y position
			if (this.growDirection == 2 || this.growDirection == 3)
				this.updatePos(0,-10);
			this.growTMR--;
			if (this.growTMR <= 0)
				this.animateUp = false;
		}
		else if (this.animateDown){
			this.updateSize(-10,-10);
			//if box is shrinking towards the right, increase the X position
			if (this.growDirection == 1 || this.growDirection == 3)
				this.updatePos(10,0);
			//if box is shrinking Upward, increase the Y position
			if (this.growDirection == 2 || this.growDirection == 3)
				this.updatePos(0,10);
			//decriment the animation timer
			this.growTMR--;
			//if animation timer is complete, stop animation of this box
			if (this.growTMR <= 0)
				this.animateDown = false;
		}
	};
	/********************************************************************************
	*						Main App Functions										*
	*********************************************************************************/
	//Main Loop this is called indefinitely while web page is open
	var gameLoop = function(){
		//call box animations if activated
		blueBox.resizeBox();
		redBox.resizeBox();
		yelBox.resizeBox();
		grnBox.resizeBox();
		//draw boxes
		draw();
	};	
	//main draw function
	var draw = function(){
		//clear the screen
		context.clearRect(0,0, 320,480);
		//draw each box
		blueBox.makeBox(context);
		redBox.makeBox(context);
		yelBox.makeBox(context);
		grnBox.makeBox(context);

	};
	//app initialization function
	var init = function(canvasName){
		
		//get canvas ID & context so that we can draw to it
		//and use mouse control
		canvasId =  document.getElementById(canvasName);
		context = canvasId.getContext('2d');
		
		//find canvas position. This is used to find the mouse position inside the canvas
		var tempCanvasRect = canvasId.getBoundingClientRect(); 
		canvasPosXY = {
			x: tempCanvasRect.left,
			y: tempCanvasRect.top
		};
		//initalize rounded box objexts
		blueBox = new Box (new Rect(5,5,50,50),"#6666cc","#ccccff",7)
		blueBox.initAnimation(0);
		redBox = new Box (new Rect(265,5,50,50),"#990000","#ff3333",7)
		redBox.initAnimation(1);
		yelBox = new Box (new Rect(5,330,50,50),"#fad000","#ffff66",7)
		yelBox.initAnimation(2);
		grnBox = new Box (new Rect(265,330,50,50),"#009900","#33ff99",7)
		grnBox.initAnimation(3);
	
		//set up mouse listeners
		canvasId.addEventListener("mousedown", mouseDown, false);
		canvasId.addEventListener("mousemove", mouseMove, false);
		canvasId.addEventListener("mouseup", mouseUp, false);
		//set up touch listeners if using a smart phone
		canvasId.addEventListener("touchstart", touchesDown, false);
		canvasId.addEventListener("touchmove", touchesMove, false);
		canvasId.addEventListener("touchend", touchesUp, false);//

	};
	/********************************************************************************
	*						Input Control Functions									*
	*********************************************************************************/
	//Mouse or touches down will call the same Mouse select Function
	function mouseDown(e){
		initMouseSelect(e);
	}	
	function touchesDown(e){
		e.preventDefault();
		initMouseSelect(e.touches[0]);
	}
	function initMouseSelect(mousePos){
		//get click position on the canvas
		var xPos = mousePos.pageX - canvasPosXY.x;//2;
		var yPos = mousePos.pageY - canvasPosXY.y;//2;
		
		//make adjustments if using an iphone
		if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
			xPos = xPos/2;
			yPos = yPos/2;
		}
		//call click/animation functions for each box if the X,Y
		//position of the click is within the boxes bounds, it will animate
		blueBox.animateOnClick(xPos,yPos);
		redBox.animateOnClick(xPos,yPos);
		yelBox.animateOnClick(xPos,yPos);
		grnBox.animateOnClick(xPos,yPos);

	}
	//Mouse or touches move will call the same Mouse select Function
	//Unused
	function mouseMove(e){
		mouseMoveHandler(e);
	}	
	function touchesMove(e){
		e.preventDefault();
		mouseMoveHandler(e.touches[0]);
	}
	function mouseMoveHandler(mousePos){

	}

	function mouseUp(e){
		//mouseIsDownR = false;
		//mouseIsDownL = false;
	}
	function touchesUp(e){
		e.preventDefault();
		//mouseIsDownR = false;
		//mouseIsDownL = false;
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