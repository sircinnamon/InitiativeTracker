function Card(){
	this.title = "";
	this.initiative = 0;

	this.element = function(){
		var element = document.createElement("div");
		element.classList.add("card")
		initiative = document.createElement("input")
		initiative.classList.add("initiative")
		initiative.type = "number"
		initiative.placeholder = "#"
		title = document.createElement("input")
		title.classList.add("title")
		title.type = "text"
		title.placeholder = "Name"
		element.appendChild(initiative)
		element.appendChild(title)
		return element
	}
}