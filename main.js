var curent_timeline = 1
var curent_round = 1
var curent_turn = 0
var time_node_data
var timelines_data

console.log("Loaded")
document.addEventListener('DOMContentLoaded', () => {
    console.log('The DOM is fully built. Run your initialization code here!');
	initialize()
	
});

async function initialize(){
	timelines_data = await loadLocalData("Timelines/timelines_data.json")
	scale_map()
	set_time_node(curent_timeline,curent_round)
}

function print_debug(){
	console.log("--- Printing debug ---")
}

function creature_click(id){
	console.log("--- Printing clicked Creature ---")
	var creature_name =""
	switch (id) {
		case 1:
			console.log("Clicked on archer")
			creature_name = "archer";
			break;
		case 2:
			console.log("Clicked on dragonborn")
			creature_name = "dragonborn";
			break;
		case 3:
			console.log("Clicked on monk")
			creature_name = "monk";
			break;
		default:
			console.log("incorrect id")
			creature_name = "error";
			break;
	}
	document.getElementById("last_clicked_creature").innerHTML = creature_name
}

function scale_map()
{
const viewportWidthMinusScrollbar = document.documentElement.clientWidth;
const viewportHeightMinusScrollbar = document.documentElement.clientHeight;

document.getElementById("battlemapimg").style.height = Math.floor(viewportHeightMinusScrollbar*0.75)+"px"
document.getElementById("timemapimg").style.height = Math.floor(viewportHeightMinusScrollbar*0.75)+"px"
document.getElementById("battlemap").style.height = Math.floor(viewportHeightMinusScrollbar*0.75)+"px"
document.getElementById("timemap").style.height = Math.floor(viewportHeightMinusScrollbar*0.75)+"px"
document.getElementById("timescale").style.height = Math.floor(viewportHeightMinusScrollbar*0.75)+"px"
console.log(`Content Area: ${viewportWidthMinusScrollbar}x${viewportHeightMinusScrollbar}`);
update_timemap()
}

async function set_time_node(timeline,round,turn){
	curent_timeline = timeline
	curent_round = round
	time_node_data = await loadLocalData("Timelines/Timeline_"+curent_timeline+"/Round_"+curent_round+"/time_node_data.json");
	if (turn==null){curent_turn = 0}else{curent_turn = turn}
	console.log("Setting timenode"+timeline+"  "+round)
	document.getElementById("timescale-slider").value = curent_turn
	document.getElementById("timescale-slider").max = time_node_data.max_turn
	update_battlemap()
	update_time_label()
	
}

function updatetutrn(value){
	curent_turn = value
	update_battlemap()
	update_time_label()
}

function update_time_label(){
	document.getElementById("timescale-label").innerHTML = "Timeline "+curent_timeline+" Round "+curent_round+" Turn "+curent_turn
}


function update_battlemap(){
	var battlemap_path = "Timelines/Timeline_"+curent_timeline+"/Round_"+curent_round+"/BoardStateTurn"+curent_turn+".jpg"
	document.getElementById("battlemapimg").src = battlemap_path
	document.getElementById("turn-log").innerText  = time_node_data.logs[curent_turn]

	var elem = document.getElementById("battlemapimg")
	var scale_factor = elem.height/1500
	var map = document.getElementById("primary")

	time_node_data.map_area_links[curent_turn].forEach(map_area=> {
		var child = document.createElement("area")
		child.shape ="rect"
		child.href = "#"
		child.coords = [Math.floor(map_area.bounds[0]*scale_factor),Math.floor(map_area.bounds[1]*scale_factor),Math.floor(map_area.bounds[2]*scale_factor),Math.floor(map_area.bounds[3]*scale_factor)]
		map.appendChild(child)
		map.lastChild.onclick=function () {eval(map_area.onclick)}
	});
}

function update_timemap(){
	var elem = document.getElementById("timemapimg")
	var scale_factor = elem.height/1000
	var map = document.getElementById("secondary")
	timelines_data.nodes.forEach(time_node=> {
		var child = document.createElement("area")
		child.shape ="rect"
		child.href = "#"
		child.coords = [Math.floor(time_node.bounds[0]*scale_factor),Math.floor(time_node.bounds[1]*scale_factor),Math.floor(time_node.bounds[2]*scale_factor),Math.floor(time_node.bounds[3]*scale_factor)]
		map.appendChild(child)
		map.lastChild.onclick=function () {set_time_node(time_node.timeline,time_node.round)}
	});
	
	
}

async function loadLocalData(file) {
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
	return data
  } catch (error) {
    console.error("Failed to load JSON:", error);
  }
}

