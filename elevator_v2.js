//Init elevator properties
class elevator {
  constructor(names, min_floor, max_floor) {
    this.names = names;
    this.current_floors = [];
    this.destination_floor = [];
    this.min_floor = min_floor;
    this.max_floor =  max_floor;
    this.states = [];
    this.position = [];
  }
  floor_names(i){
    if (i==0) {
      return 'Ground Floor';
    } else {
      return 'Floor '.concat(i);
    }
  }
  panel_buttons(i){
    if (i==0) {
      return 'G';
    } else {
      return i;
    }
  }
  get_status(i){
    return this.states[i];
  }

  move_position(destination,source,direction){
    var step_element=destination.split("_");
    var destination_floor=Number(step_element[1]);
    if (isNaN(step_element[0])) {
      var elevator_name=step_element[0];
    } else {
      if ((this.destination_floor['A'] == destination_floor) || (this.destination_floor['B'] ==destination_floor)){
        return;
        }
      if ((this.get_status('A') == 'ready') && (this.get_status('B') == 'ready')){
        if (direction=='up') {
          if (((this.position['A']< destination_floor) && ((this.position['B']< this.position['A']) || (this.position['B']>destination_floor))) || ((this.position['A'] < this.position['B']) && (destination_floor<this.position['A']))){
            var elevator_name='A';
          } else var elevator_name='B';
        } else if (direction=='down') {
          if (((this.position['A']> destination_floor) && ((this.position['B']> this.position['A']) || (this.position['B']<destination_floor))) || ((this.position['A'] > this.position['B']) && (destination_floor > this.position['A']))){
            var elevator_name='A';
          } else {
            var elevator_name='B';
          }
        }
      } else if ((this.get_status('A') == 'ready') && (this.get_status('B') == 'busy')){
          var elevator_name='A';
      } else if ((this.get_status('B') == 'ready') && (this.get_status('A') == 'busy')){
        var elevator_name='B';
      } 
      else {
//        alert('Elevator in movement');
        return;  
      }
    }
    if (this.get_status(elevator_name) == 'busy'){
      alert('Elevator in movement');
      return;
    }
    
 
    var current_position=this.position[elevator_name];

    if (current_position != destination_floor) {
      this.states[elevator_name]='busy';
    }
    this.destination_floor[elevator_name]=destination_floor;
      
    //loop to reach each floor
    function in_move(direction) { 
      setTimeout(function() {
        if (direction=='up'){
          var next_floor=current_position+1;
        } else {
          var next_floor=current_position-1;
        }
        elevator_properties.update_color(elevator_name, next_floor, 'busy', direction); 
        current_position=next_floor;
        
        if ((direction=='up') && (current_position < destination_floor)) {
          in_move('up');
        }          
        if ((direction=='down') && (current_position > destination_floor)) {
          in_move('down');
        }
        if (current_position == destination_floor) {
          elevator_properties.update_color(elevator_name, destination_floor, 'ready', '');
          if (source =="from_panel"){
            document.getElementById('button_'+elevator_name +'_'+ destination_floor).style.backgroundColor ='white';
            document.getElementById('button_'+elevator_name +'_'+ destination_floor).style.color ='black';
            document.getElementById('button_'+elevator_name +'_'+ destination_floor).style.border ='none';
          }
        }
      }, 1000)
    }
    //inital loop start
    if (current_position < destination_floor) {
      if (source=="from_panel"){
        document.getElementById('button_'+elevator_name +'_'+ destination_floor).style.backgroundColor ='green';
        document.getElementById('button_'+elevator_name +'_'+ destination_floor).style.color ='white';
        document.getElementById('button_'+elevator_name +'_'+ destination_floor).style.border ='2px solid red';
      }
      in_move('up');      
    }          
    if (current_position > destination_floor) {
      if (source=="from_panel"){
          document.getElementById('button_'+elevator_name +'_'+ destination_floor).style.backgroundColor ='green';
          document.getElementById('button_'+elevator_name +'_'+ destination_floor).style.color ='white';
          document.getElementById('button_'+elevator_name +'_'+ destination_floor).style.border ='2px solid red';
      }
      in_move('down');             
    }
   
  }

  update_color(elevator, position, status, direction){
    //select new floor
    var arrow=''
    if (direction=='up'){
      arrow='▲';
    } else if (direction=='down'){
      arrow='▼';
    }
    document.getElementById(elevator +'_'+ position).style.backgroundColor ='yellow';
    document.getElementById(elevator +'_'+ position).innerHTML = elevator;
    document.getElementById('display_' + elevator).value = this.panel_buttons(position) + ' '+ arrow;
    
    

    for (let i = this.max_floor; i >= this.min_floor; i--) {
      if (elevator=='A'){
      document.getElementById('display_' + elevator + '_' + i).value = arrow + ' ' + this.panel_buttons(position);    
      } else {
      document.getElementById('display_' + elevator + '_' + i).value = this.panel_buttons(position) + ' ' + arrow;    
      }
      
    }
    //restore previous floor
    if ((typeof this.position[elevator] === 'number') && (this.position[elevator] !=position)) {
      document.getElementById(elevator +'_'+ this.position[elevator]).style.backgroundColor ='white';
      document.getElementById(elevator +'_'+ this.position[elevator]).innerHTML = '';  
    }
    this.position[elevator]=position;
    this.states[elevator]=status;
    if (status=='init'){
      this.destination_floor[elevator]=position;
      this.states[elevator]='ready';
    }
  }

}    

//draw left side
function draw_system() {
  const body = document.body, 
  tbl = document.createElement('table');
//  tbl.style.width = '250px';
  tbl.style.marginTop = '0px';
  tbl.style.position = 'absolute';
  tbl.style.marginLeft = '0px';
  tbl.style.textAlign ='center';
  for (let i = max_floor; i >= min_floor; i--) {
    const tr = tbl.insertRow();
    for (let j = 0; j < design_column; j++) {
      const td = tr.insertCell();
      if (j == 0){
        td.appendChild(document.createTextNode(elevator_properties.floor_names(i)));
      }
      if (j == 1) {
        td.style.border = '1px solid black';
        td.style.width ='40px';
        td.style.height ='80px';    
        td.id='A_'.concat(i);
      }
      if (j==2){
        td.style.width ='140px';
        var html_innerHTML_construct_2='';
        var html_innerHTML_construct_3='';
        var html_innerHTML_construct_1=`<input type="text" style="text-align: right; background-color: white; font-weight:bold; border: 0;" id="display_A_${i}" size="1" disabled>`;
        if (elevator_properties.max_floor>i){
          var html_innerHTML_construct_2=`<input type = "button" onclick = "elevator_properties.move_position('_${i}','main_panel','up')" value = "­▲">`;
        }
        if (elevator_properties.min_floor<i){
          html_innerHTML_construct_3=`<input type = "button" onclick = "elevator_properties.move_position('_${i}','main_panel','down')" value = "▼­">`;
        } 
        var html_innerHTML_construct_4=`<input type="text" style="text-align: left; background-color: white; font-weight:bold; border: 0;" id="display_B_${i}" size="1" disabled>`;

        td.innerHTML= html_innerHTML_construct_1+html_innerHTML_construct_2+html_innerHTML_construct_3+html_innerHTML_construct_4;
      }
      if (j == 3) {          
        td.style.border = '1px solid black';
        td.style.width ='40px';
        td.style.height ='80px';          
        td.id='B_'.concat(i);
      }
    }
  }
  body.appendChild(tbl);
}

//draw right side
function draw_panels(panels) {
var position_push = 30;

  for (let k = panels.length-1; k >= Object.keys(panels)[0]; k--) {
    var panel_name = panels.at(k); 
    const body = document.body,
      panel = document.createElement('table');
      panel.style.marginTop = '0px';
      panel.style.position = 'fixed';
      panel.style.right = position_push+'px';
      panel.style.marginRight = '0px';
      panel.style.width = '70px';
      panel.style.border = '1px solid black';
      panel.style.backgroundColor="gray";
      header = panel.createTHead();
      row = header.insertRow(0);    
      cell = row.insertCell(0);
      cell.style.textAlign ='center';
      cell.innerHTML=`Panel ${panel_name}<br><input type="text" style="text-align: center; background-color: white;font-weight:bold;" id="display_${panel_name}" size="2" disabled>`;
    for (let i = max_floor; i >= min_floor; i--) {
      const tr = panel.insertRow();
      const td = tr.insertCell();
      td.innerHTML=`<input type = "button" style="padding :5px 10px; border:0px"; id=${'button_'+panel_name+'_'+i} onclick = "elevator_properties.move_position('${panel_name+'_'+i}','from_panel')" value = "${elevator_properties.panel_buttons(i)}" style="border-style: none">`; 
      td.style.width = '0px';
      td.style.textAlign ='center';
      td.style.overflow = 'hidden';
      body.appendChild(panel);
    }
    //fix panel overlap
    position_push=position_push+90;
  }
}

const elevator_names=['A','B'];
let design_column =4;
const max_floor = 6;
const min_floor=0;
let elevator_properties = new elevator(elevator_names, min_floor, max_floor);

draw_panels(elevator_names);
draw_system();
elevator_properties.update_color('A',0,'init')
elevator_properties.update_color('B',6,'init');


