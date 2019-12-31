
function wattToDailyJoules(w) {
    return 86400*w;
}

function createTicks(tick, skipStep=0) {
    var min = parseInt(tick.min)
    var max = parseInt(tick.max);
    var step = parseInt(tick.step); // can be empty string
    if(!step) step = 1;
    var div = document.createElement("div");
    div.className = "ticks"
    for(var i = min; i < max+1; i=i+((skipStep)?skipStep:step)) {
        var span = document.createElement("span");
        span.className = "tick"
        span.innerHTML = i;
        div.appendChild(span);
        
      }
  
    tick.parentElement.appendChild(div);
  }
  


  window.onload = () => {
    var ticks = document.getElementsByClassName("slider");
    for(let tick of ticks) {
        createTicks(tick, 6);
    }
  }