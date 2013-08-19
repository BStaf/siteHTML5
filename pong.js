
var pongCanvas;
var canvasObj;
var rPaddleObj;
var lPaddleObj;	
var ballObj;
var context;
var justbounced;
var mouseIsDownR;
var mouseIsDownL;

var mousePosXY;
	
function dToR(angle){return angle*Math.PI/180;}


function paddleBounds(){
	//Right Paddle
	//within x bounds
	if ((ballObj.xLoc+ballObj.radius > rPaddleObj.xLoc)&&(ballObj.xLoc+ballObj.radius < rPaddleObj.xLoc+rPaddleObj.width)){
		//within y bounds
		if ((ballObj.yLoc < rPaddleObj.yLoc+rPaddleObj.height)&&(ballObj.yLoc+ballObj.radius*2 > rPaddleObj.yLoc)){
			ballObj.ballSpeed = -ballObj.ballSpeed;
			ballObj.angle = -ballObj.angle - dToR(((ballObj.yLoc-rPaddleObj.yLoc)-rPaddleObj.height/2)/rPaddleObj.height/2*100);
		}
	}
	//Left Paddle
	//within x bounds
	if ((ballObj.xLoc-5 <= lPaddleObj.xLoc+lPaddleObj.width)){//&&(ballObj.xLoc > lPaddleObj.xLoc)){
		//within y bounds
		if ((ballObj.yLoc < lPaddleObj.yLoc+lPaddleObj.height)&&(ballObj.yLoc+ballObj.radius*2 > lPaddleObj.yLoc)){
			ballObj.ballSpeed = -ballObj.ballSpeed;
			ballObj.angle = -ballObj.angle + dToR(((ballObj.yLoc-lPaddleObj.yLoc)-lPaddleObj.height/2)/lPaddleObj.height/2*100);;
		}
	}
		
}

function gameLoop(){
	context.clearRect(0, 0, 480,300);
	ballObj.xLoc = ballObj.xLoc + ballObj.ballSpeed*Math.cos(ballObj.angle);
	ballObj.yLoc = ballObj.yLoc + ballObj.ballSpeed*Math.sin(ballObj.angle);
	//check if ball is in bounds of game
	if ((ballObj.yLoc >= (canvasObj.height-ballObj.radius*2)) || (ballObj.yLoc <= 0+ballObj.radius)){
		ballObj.angle = -ballObj.angle;
	}
	if ((ballObj.xLoc > canvasObj.width)||(ballObj.xLoc < 0)) {//(canvasObj.height-ballObj.radius*2)){
		makeBall();
	}
	paddleBounds();
	drawPong();
}	

function makeBall(){
	ballObj.xLoc = 40;
	ballObj.yLoc = 40;
	ballObj.radius = 5;
	ballObj.angle = dToR(54);
	ballObj.ballSpeed = 5;
}

function drawPong(){
	context = pongCanvas.getContext('2d');
	context.strokeStyle = "#000000";
	context.fillStyle = "#000000";
	context.beginPath();
	//context.arc(100,100,50,0,Math.PI*2,true);
	context.fillRect(rPaddleObj.xLoc, rPaddleObj.yLoc, rPaddleObj.width, rPaddleObj.height);
	context.fillRect(lPaddleObj.xLoc, lPaddleObj.yLoc, lPaddleObj.width, lPaddleObj.height);
	context.arc(ballObj.xLoc,ballObj.yLoc,ballObj.radius,0,Math.PI*2,true);
	
	context.fillText("ball at: "+ballObj.xLoc.toFixed(0)+","+ballObj.yLoc.toFixed(0),290,10);
	
	context.closePath();
	context.stroke();
	context.fill();
}

function initPong(){
	rPaddleObj = new Object();
	lPaddleObj = new Object();
	ballObj = new Object();
	canvasObj = new Object;
	
	mouseIsDownR = false;
	mouseIsDownL = false;
	
	canvasObj.width = 480;
	canvasObj.height = 300;
	
	lPaddleObj.xLoc = 10;
	lPaddleObj.yLoc = 10;
	lPaddleObj.width = 15;
	lPaddleObj.height = 70;
	lPaddleObj.mouseOn = 0;//lPaddleObj.height/2+lPaddleObj.yLoc;
	
	rPaddleObj.xLoc = 455;
	rPaddleObj.yLoc = 10;
	rPaddleObj.width = 15;
	rPaddleObj.height = 70;
	rPaddleObj.mouseOn = 0;//rPaddleObj.height/2+rPaddleObj.yLoc;
	
	makeBall();
	
	pongCanvas =  document.getElementById('pongScreen');
	context = pongCanvas.getContext('2d');
    
	pongCanvas.addEventListener("mousedown", mouseDown, false);
	pongCanvas.addEventListener("mousemove", mouseMove, false);
	pongCanvas.addEventListener("mouseup", mouseUp, false);
	
	pongCanvas.addEventListener("touchstart", touchesDown, false);
	pongCanvas.addEventListener("touchmove", touchesMove, false);
	pongCanvas.addEventListener("touchend", touchesUp, false);//*/
	window.onorientationchange = resetCanvas;  
	window.onresize = resetCanvas;
	
	//find canvas position. This is used to find the mouse position inside the canvas
	var tempCanvasRect = pongCanvas.getBoundingClientRect(); 
	
	mousePosXY = {
		x: tempCanvasRect.left,
		y: tempCanvasRect.top
	};
	//pongCanvas.scale3d(2, 2, 0);
	/*pongCanvas.ontouchstart = touchesDown;
	pongCanvas.ontouchmove = touchesMove;
	pongCanvas.ontouchend = touchesMove;*/
	
	drawPong();
	setInterval(this.gameLoop,5)
}
function resetCanvas (e) {  
 	// resize the canvas - but remember - this clears the canvas too. 
  	pongCanvas.width = window.innerWidth; 
	pongCanvas.height = window.innerHeight;
	
	//halfWidth = pongCanvas.width/2; 
	//halfHeight = pongCanvas.height/2;
	
	//make sure we scroll to the top left. 
	window.scrollTo(0,0); 
}
//control operations
function mouseDown(e){
	initMouseSelect(e);
}	
function touchesDown(e){
	e.preventDefault();
	initMouseSelect(e.touches[0]);
}
function initMouseSelect(mousePos){
	var xPos = mousePos.pageX - mousePosXY.x;
	var yPos = mousePos.pageY - mousePosXY.y;
	if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
		xPos = xPos/2;
		yPos = yPos/2;
	}
	if ((xPos+10  >= rPaddleObj.xLoc)&&(xPos-10  < rPaddleObj.xLoc+rPaddleObj.width)){
		//within y bounds
		if ((yPos < rPaddleObj.yLoc+rPaddleObj.height)&&(yPos > rPaddleObj.yLoc)){
			mouseIsDownR = true;
			rPaddleObj.mouseOn = yPos - rPaddleObj.yLoc;
		}
	}
	if ((xPos+10  >= lPaddleObj.xLoc)&&(xPos-10  < lPaddleObj.xLoc+lPaddleObj.width)){
		//within y bounds
		if ((yPos < lPaddleObj.yLoc+lPaddleObj.height)&&(yPos > lPaddleObj.yLoc)){
			mouseIsDownL = true;
			lPaddleObj.mouseOn = yPos - lPaddleObj.yLoc;
		}
	}
}
function mouseMove(e){
	mouseMoveHandler(e);
}	
function touchesMove(e){
	e.preventDefault();
	mouseMoveHandler(e.touches[0]);
}
function mouseMoveHandler(mousePos){
	var xPos = mousePos.pageX - mousePosXY.x;
	var yPos = mousePos.pageY - mousePosXY.y;
	if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
		xPos = xPos/2;
		yPos = yPos/2;
	}
	if (mouseIsDownR){
		rPaddleObj.yLoc = yPos - rPaddleObj.mouseOn;
	}
	if (mouseIsDownL){
		lPaddleObj.yLoc = yPos - lPaddleObj.mouseOn;
	}
}

function mouseUp(e){
	mouseIsDownR = false;
	mouseIsDownL = false;
}
function touchesUp(e){
	e.preventDefault();
	mouseIsDownR = false;
	mouseIsDownL = false;
}
