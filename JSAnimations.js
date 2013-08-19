/************************************************************************************
*	Animation object. This handles multiple animations of Rect objects				*
*		user will add the inital, final position rects and timers					*
*		for how long the animation should take.										*
************************************************************************************/

//animation system constructor
function AnimationSystem(lTime) {
	this.loopTime = lTime;
	this.AnimationQueue = new Array();
	//this.AQCnt = 0;
}
//starts from the top of the array. If animation is disabled, it removes the element from the queue
//this will work its way down until it finds an object with active animation, it will then quit
AnimationSystem.prototype.cleanAnimationQueue = function() {
	var i;
	for (i=this.AQCnt-1;i>=0;i--){
		if (this.AnimationQueue[i].isActive == false){
			this.AnimationQueue[i].Pop
		}
	}
		
}
//This will run through all active animations.
//All animations are affecting the position and size of Rect objects.
//The object being animated will hold the index of its animated rect.
//It can then retrieve its current position/size values
AnimationSystem.prototype.runAnimations = function() {
	var animatedObj;
	var i;
	
	//var interval;// = this.loopTime;
	for (i=0;i<this.AnimationQueue.length;i++){
		animatedObj = this.AnimationQueue[i];
		if (animatedObj.isActive){//check if animation is active
			if (animatedObj.delayCntr < animatedObj.delay) animatedObj.delayCntr++;
			else{
				//interval = this.loopTime*animatedObj.time;
				if (animatedObj.timeCntr >= animatedObj.interval-1)
					animatedObj.isActive = false;	
				
				animatedObj.rectCur.xPos += animatedObj.xInc;
				animatedObj.rectCur.yPos += animatedObj.yInc;
				animatedObj.rectCur.width += animatedObj.wInc;
				animatedObj.rectCur.height += animatedObj.hInc;
				animatedObj.timeCntr++;
			}
		}
	}
	//this.cleanAnimationQueue();
}

//adds a new animation object and returns the array index of it.
AnimationSystem.prototype.addAnimation = function(objectID,rectFinal,rectInit,time,delay){
	var exisitingObjectIndex = -1;
	for (var i =0;i<this.AnimationQueue.length;i++){
		if (this.AnimationQueue[i].ID == objectID){
			exisitingObjectIndex = i;
			break;
		}
	}
	if (exisitingObjectIndex == -1){
		this.AnimationQueue.push(new AnimationObject(rectFinal, rectInit,time,delay,this.loopTime,objectID));
		return this.AnimationQueue.length-1;
	}
	else
		this.AnimationQueue[exisitingObjectIndex].updateAnimation(rectFinal, rectInit,time,delay);
	return exisitingObjectIndex;
}
//returns the current animated object rect
AnimationSystem.prototype.getAnimatedRect = function(index){
	if (index < this.AnimationQueue.length){
		if (this.AnimationQueue[index].isActive){
			return this.AnimationQueue[index].rectCur;
		}
	}
	return null;
}
	
//anmiation object.
// this holds object rects initial, current and final position throughout the animation
// also the animation timer and delay
function AnimationObject(rectFinal, rectInit,time,delay,loopTime, anID) {
	this.interval = loopTime*time
	this.rectFinal = rectFinal; //where object will be
	//this.rectCur = rectInit; //where object is at the beginning
	this.rectCur = rectInit; //where object is during the animation
	//this.time = time;
	this.timeCntr = 0;
	this.delay = delay;
	this.delayCntr = 0;
	this.xInc = ((this.rectFinal.xPos - this.rectCur.xPos) / this.interval);
	this.yInc = ((this.rectFinal.yPos - this.rectCur.yPos) / this.interval);
	this.wInc = ((this.rectFinal.width - this.rectCur.width) / this.interval);
	this.hInc = ((this.rectFinal.height - this.rectCur.height) / this.interval);
	this.isActive = true;
	this.ID = anID;
}
//upadte values on an exisiting
AnimationObject.prototype.updateAnimation = function(rectFinal, rectInit,time,delay){
	this.rectFinal = rectFinal; //where object will be
	this.rectCur = rectInit; //where object is during the animation
	this.timeCntr = 0;
	this.delay = delay;
	this.delayCntr = 0;
	this.xInc = ((this.rectFinal.xPos - this.rectCur.xPos) / this.interval);
	this.yInc = ((this.rectFinal.yPos - this.rectCur.yPos) / this.interval);
	this.wInc = ((this.rectFinal.width - this.rectCur.width) / this.interval);
	this.hInc = ((this.rectFinal.height - this.rectCur.height) / this.interval);
	this.isActive = true;
}