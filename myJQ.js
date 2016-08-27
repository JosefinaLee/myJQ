function JQuery(arg){
	this.elements = [];
	switch(typeof arg){//arg: function, object, string
		case 'function': //文档就绪函数
			window.addEventListener('load', arg, false);
			break;
		case 'object':
			this.elements.push(arg);
			break;
		case 'string': //arg: #aa, .aa, aa
			var prefix = arg.charAt(0);
			switch(prefix){
				case '#': //id
					var domObj = document.getElementById(arg.substring(1));
					if(domObj){
						this.elements.push(domObj);
					}
					break;
				case '.': //class
					this.elements = document.getElementsByClassName(arg.substring(1));
						// return this.elements;
					break;
				default://tag
					this.elements = document.getElementsByTagName(arg);
					break;
			}
			break;
	}
}
function getStyle(elem, prop){
	if(elem.currentStyle){
		return elem.currentStyle[prop];
	}else{
		return getComputedStyle(elem, null)[prop];
	}
}
function setCss(elem, attr, value){
	switch(attr){
		case 'width':
		case 'height':
		case 'padding':
		case 'paddingLeft':
		case 'paddingRight':
		case 'paddingTop':
		case 'paddingBottom':
			value = /\%/.test(value)?value:Math.max(parseInt(value), 0) + "px";
			break;

		case 'left':
		case 'right':
		case 'top':
		case 'bottom':
		case 'margin':
		case 'marginLeft':
		case 'marginRight':
		case 'marginTop':
		case 'marginBottom':
			value = /\%/.test(value) ? value : parseInt(value) + "px";
			break;
	}

		elem.style[attr] = value;
}

JQuery.prototype.on = function(type, selector, fn){
	for(var i=0; i<this.elements.length; i++){
		if(typeof selector == "function"){
			fn = selector;
			this.elements[i].addEventListener(type, fn, false);
		}else if(typeof selector == "string"){
			this.elements[i].addEventListener(type, function(e){
				var prefix = selector.charAt(0);
				switch(prefix){
					case "#":
						if(e.target.id == selector.substring(1)){
							fn.call(e.target);
						}
						break;

					case ".":
						if(e.target.className == selector.substring(1)){
							fn.call(e.target);
						}
						break;

					default:
						if(e.target.tagName == selector.toUpperCase()){
							fn.call(e.target);
						}
						break;
				
				}
			}, false);
		}
	}
	return this;
};

JQuery.prototype.css = function(propName, value){
	if(value){
		for(var i=0; i<this.elements.length; i++){
			this.elements[i].style[propName] = value;
		}
	}else{
		if(typeof propName == "string"){
			return getStyle(this.elements[0], propName);
		}else if(typeof propName == "object"){
			for(var p in propName){

				for(var i=0; i<this.elements.length; i++){

					setCss(this.elements[i], p, propName[p]);
				}
			}
		}
	}
	return this;

};

JQuery.prototype.offset = function(coordinates){
	if(coordinates){
		for(var i=0; i<this.elements.length; i++){
			var elem = this.elements[i];
			if(getStyle(elem, "position") == "static"){
				elem.style.position = "relative";

			}
			
			setCss(elem, "left", coordinates.left);
			setCss(elem, "top", coordinates.top);
		}
	}else{
		var elem = this.elements[0];
		var iLeft = iTop = 0;
		do{
			iTop += elem.offsetTop;
			iLeft += elem.offsetLeft;
			elem = elem.offsetParent;
		}while(elem);
		return {
			left: iLeft,
			top: iTop
		}
		
	}
	return this;
};


function $(arg){
	return new JQuery(arg);
}




























