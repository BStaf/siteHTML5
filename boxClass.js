//Box class
//this class handles a rounded edge box that has an outline
function Rect(X,Y,W,H) {
	this.xPos = X;
	this.yPos = Y;
	this.width = W;
	this.height = H;
}
/*Rect.prototype.copyRect(){
	var newRect = new Rect(0,0,0,0);
	
	return newRect;
}*/
//constructor
function Box (rect,sCol,fCol,radius) {
	//set box position and size
	this.rect = rect;
    //this.xPos = xPos; 
	//this.yPos = yPos;
	//this.width = width;
	//this.height = height;
	//radius of rounded corner
	this.radius = radius
	//set color of box, outline and fill
	this.strokeCol = sCol;
	this.fillCol = fCol;
}

Box.prototype.makeBox = function(context) {
	context.strokeStyle = this.strokeCol;
	context.fillStyle = this.fillCol;
    context.globalAlpha = 0.7;
	context.lineWidth=5;
	var X = this.rect.xPos + context.lineWidth/2;
	var Y = this.rect.yPos + context.lineWidth/2;
	var W = this.rect.width - context.lineWidth;
	var H = this.rect.height - context.lineWidth;
	context.beginPath();
		/*context.moveTo(this.rect.xPos+this.radius, this.rect.yPos);
		context.lineTo(this.rect.xPos+this.rect.width-this.radius, this.rect.yPos);
		context.arcTo(this.rect.xPos+this.rect.width, this.rect.yPos, this.rect.xPos+this.rect.width, this.rect.yPos+this.radius, this.radius);
		context.lineTo(this.rect.xPos+this.rect.width, this.rect.yPos+this.rect.height-this.radius);
		context.arcTo(this.rect.xPos+this.rect.width, this.rect.yPos+this.rect.height, this.rect.xPos+this.rect.width-this.radius, this.rect.yPos+this.rect.height, this.radius);
		context.lineTo(this.rect.xPos+this.radius, this.rect.yPos+this.rect.height);
		context.arcTo(this.rect.xPos, this.rect.yPos+this.rect.height, this.rect.xPos, this.rect.yPos+this.rect.height-this.radius, this.radius);
		context.lineTo(this.rect.xPos, this.rect.yPos+this.radius);
		context.arcTo(this.rect.xPos, this.rect.yPos, this.rect.xPos+this.radius, this.rect.yPos, this.radius);*/
		context.moveTo(X+this.radius, Y);
		context.lineTo(X+W-this.radius, Y);
		context.arcTo(X+W, Y, X+W, Y+this.radius, this.radius);
		context.lineTo(X+W, Y+H-this.radius);
		context.arcTo(X+W, Y+H, X+W-this.radius, Y+H, this.radius);
		context.lineTo(X+this.radius, Y+H);
		context.arcTo(X, Y+H, X, Y+H-this.radius, this.radius);
		context.lineTo(X, Y+this.radius);
		context.arcTo(X, Y, X+this.radius, Y, this.radius);
	context.closePath();
	context.stroke(); context.fill();
};
Box.prototype.updateBox = function(newRect){
	this.rect = this.newRect;
}
Box.prototype.updateColors = function(sCol,fCol){
	this.strokeCol = sCol;
	this.fillCol = fCol;
}

Box.prototype.updateSize = function(W,H) {
	this.rect.width = this.rect.width+W;
	this.rect.height = this.rect.height+H;
};
Box.prototype.updatePos = function(X,Y) {
	this.rect.xPos = this.rect.xPos+X; 
	this.rect.yPos = this.rect.yPos+Y;
};
//returns true if X,Y position is within the boxes bounds 
Box.prototype.pointInBounds = function(X,Y){
	//within Y Bounds
	if ((X  >= this.rect.xPos)&&(X  < this.rect.xPos+this.rect.width)){
		//within y bounds
		if ((Y < this.rect.yPos+this.rect.height)&&(Y > this.rect.yPos)){
			return true;
		}
	}
	return false;
};

//returns 0 if center coordinate of box1 is outside bounds of box2
//returns 	1 if left
//			2 if right
//unused
Box.prototype.checkBoxToBox = function(boxRect){
		var b1CenterX = this.rect.xPos + this.rect.width/2;
		var b1CenterY = this.rect.yPos + this.rect.height/2;
		var returnType = 0;

		//if over another playable box, ignore
		//if (boxObj2.boxType == PLAYABLEBOX) return 0;
		if ((b1CenterX > boxRect.xPos)&&(b1CenterX < boxRect.xPos + boxRect.width)){
			if (b1CenterX > boxRect.xPos + boxRect.width/2)
				returnType = 2;
			else
				returnType = 1;
			//ensure 
			if ((b1CenterY > boxRect.yPos)&&(b1CenterY < boxRect.yPos + boxRect.height)){
				//returnType = 0;
			}
			else returnType = 0;
		}
		return returnType;
	}
				