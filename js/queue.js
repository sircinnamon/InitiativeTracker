// Mouse currently up or down
var mousedown = false;
//Long Press settings
var longPressTimer;
var longPressOrigin;
var LONG_PRESS_FORGIVENESS = 5;
var LONG_PRESS_VIBRATION = [75];
//Custom settings
var settings = {};
//Queue of cards
var queue = [];

function add_card(){
	new_card = new Card()
	queue.push(new_card)
	document.getElementById("cardDiv").appendChild(new_card.element())
}

function move_queue(direction){
	if(direction > 0){
		var shiftedCard = queue.shift()
		queue.push(shiftedCard)
		var shiftedElement = document.getElementById("cardDiv").firstChild
		document.getElementById("cardDiv").appendChild(shiftedElement)
	}else if (direction < 0){
		var shiftedCard = queue.pop()
		queue.unshift(shiftedCard)
		var shiftedElement = document.getElementById("cardDiv").lastChild
		document.getElementById("cardDiv").insertBefore(shiftedElement, document.getElementById("cardDiv").firstChild)
	}
}

function vibrate(events){
	navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
	//console.log(navigator.vibrate);
	if (navigator.vibrate) {
		navigator.vibrate(...events);
	}
}


function mousedown_func(evt) {
	evt.preventDefault();
	mousedown = true;
	var mousePos = getMousePos(canvasGrid, evt);
	if(unitPlacementMode){
		placeUnit(mousePos);
		return;
	}
	//console.log(mousedown, mousePos); 
	template.setOrigin(mousePos, board.getTileByCoord(mousePos.x, mousePos.y));
	if(template.originLocked || !template.terminusRequired){
		mousemove_func(evt);
	} else {
		clearAll();
	}
}

function mousemove_func(evt) {
	evt.preventDefault();
	if(mousedown){
		if(unitPlacementMode){
			return;
		}
		var mousePos = getMousePos(canvasGrid, evt);
		template.setVector(mousePos,board.tile_width*templateSize);
		paintTemplate();
	}
}

function mouseup_func(evt) {
	evt.preventDefault();
	mousedown = false;
}

function dblclick_func(evt) {
	evt.preventDefault();
	var mousePos = getMousePos(canvasGrid, evt);
	if(template.originLocked){
		template.unlockOrigin();
		//Move origin and draw new template
		board.clearTiles();
		mousedown_func(evt);
		mousedown=false;
	} else {
		template.lockOrigin();
		template.drawOrigin();
		if(!template.terminusRequired){
			mousemove_func(evt);
		}
	}
}

function touchstart_func(evt) {
	if(evt.touches.length == 1){
		//Start longpress
		longPressOrigin = {x:evt.touches[0].clientX, y:evt.touches[0].clientY};
		longPressTimer = setTimeout(function() {
			vibrate(LONG_PRESS_VIBRATION);
			dblclick_func(evt);
		}, 500);

		mousedown_func(evt);
	}
}

function touchmove_func(evt) {
	if(evt.touches.length == 1){
		//Cancel longpress if in progress & have moved enough away
		if(longPressOrigin){
			var dx = evt.touches[0].clientX - longPressOrigin.x
			var dy = evt.touches[0].clientY - longPressOrigin.y
			if(Math.sqrt(dx * dx + dy * dy) > LONG_PRESS_FORGIVENESS){
				clearTimeout(longPressTimer);
				longPressOrigin = null;
			}
		}

		mousemove_func(evt);
	}
}

function touchend_func(evt) {
	if(evt.touches.length <= 1){
		//Cancel longpress happening
		clearTimeout(longPressTimer);
		longPressOrigin = null;

		mouseup_func(evt);
	}
}

function resize_func(evt) {
	clearTimeout(resizeTimer);
	//console.log("resize event fired");
	var resizeTimer = setTimeout(function() {
		//console.log("resize event processed");
		init_canvases();
	}, 200);
}

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}