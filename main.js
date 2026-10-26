var curent_timeline = 1
var curent_round = 1
var curent_turn = 0
var time_node_data
var timelines_data

document.addEventListener('DOMContentLoaded', () => {
	initialize()
	console.log("Loaded")
});

async function initialize(){
	timelines_data = await loadLocalData("Timelines/timelines_data.json")
	scale_objects_to_viewport()
	set_time_node(curent_timeline,curent_round)
}

function print_debug(){
	console.log("--- Printing debug ---")
}
function update_visuals(){
	update_battlemap()
	update_time_label()
}

function timeforward(){
	if (curent_turn == time_node_data.max_turn) {
		if (curent_round == 4) {  // make dynamic later
			console.log("can't go further forward")
		}else{
			set_time_node(curent_timeline,curent_round+1,0)
		}
	}else{
		set_time_node(curent_timeline,curent_round,curent_turn+1)
	}	
}
function timeback(){
	if (curent_turn == 0) {
		if (curent_round == 1) {
			console.log("can't go further back")
		}else{
			set_time_node(curent_timeline,curent_round-1,-1)
		}
	}else{
		set_time_node(curent_timeline,curent_round,curent_turn-1)
	}	
}

	// --- Scaling Functions ---
	function scale_objects_to_viewport(){
	//get info on viewport
	const w = document.documentElement.clientWidth;
	const h = document.documentElement.clientHeight;
	// scale battle map
	document.getElementById("battlemapimg").style.height = Math.floor(h*0.74)+"px"
	document.getElementById("battlemap").style.height = Math.floor(h*0.74)+"px"
	// scale turn slider
	document.getElementById("timescale-slider").style.width = Math.floor(h*0.75)+"px"
	document.getElementById("timescale-label").style.width = Math.floor(h*0.56)+"px"
	document.getElementById("move-forward").style.width = Math.floor(h*0.09)+"px"
	document.getElementById("move-back").style.width = Math.floor(h*0.09)+"px"
	//scale time ,ap
	document.getElementById("timemap").style.height = Math.floor(h*0.14)+"px"
	document.getElementById("timemapimg").style.height = Math.floor(h*0.14)+"px"
	// scale additional info box
	document.getElementById("additional-info").style.width = Math.floor(h*0.75)+"px"
	document.getElementById("additional-info").style.height = Math.floor(h*0.74)+"px"
	//scale turn log
	document.getElementById("turn-log").style.width = Math.floor(h*0.75)+"px"
	document.getElementById("turn-log").style.height = Math.floor(h*0.19)+"px"
	
	}
	// additional info function
	function set_additionalinfo_image(image_path){
		document.getElementById("additional-img").src = image_path
	}
	
async function set_time_node(timeline,round,turn){
	curent_timeline = timeline
	curent_round = round
	if (turn==null) {
		curent_turn = 0
	}else{
		if(turn==-1){
		curent_turn = time_node_data.max_turn
		}else{
		curent_turn=turn
		}
	}

	time_node_data = await loadLocalData("Timelines/Timeline_"+curent_timeline+"/Round_"+curent_round+"/time_node_data.json");
	document.getElementById("timescale-slider").value = curent_turn
	document.getElementById("timescale-slider").max = time_node_data.max_turn

	update_timemap()
	update_visuals()
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

	map.innerHTML =""

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
	var scale_factor = elem.height/600
	var map = document.getElementById("secondary")
	var current_time_node_id
	timelines_data.nodes.forEach(time_node=> {
		var child = document.createElement("area")
		child.shape ="rect"
		child.href = "#"
		child.coords = [Math.floor(time_node.bounds[0]*scale_factor),Math.floor(time_node.bounds[1]*scale_factor),Math.floor(time_node.bounds[2]*scale_factor),Math.floor(time_node.bounds[3]*scale_factor)]
		map.appendChild(child)
		map.lastChild.onclick=function () {set_time_node(time_node.timeline,time_node.round)}
		if ((time_node.timeline == curent_timeline) && (time_node.round==curent_round)){current_time_node=time_node}
	});

	current_time_node
	document.getElementById("curent-node").style.left  = Math.floor(current_time_node.bounds[0]*scale_factor)+5+"px"
	document.getElementById("curent-node").style.top = Math.floor(current_time_node.bounds[1]*scale_factor)+5+"px"
	document.getElementById("curent-node").style.width = 3+Math.floor(current_time_node.bounds[2]*scale_factor)-Math.floor(current_time_node.bounds[0]*scale_factor)+"px"
	
	
}

async function loadLocalData(file) {
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
	return data
  } catch (error) {
    console.error("Failed to load JSON:", error);
  }
}

function update_turn(value){
	curent_turn = parseInt(value)
	update_visuals()
}
