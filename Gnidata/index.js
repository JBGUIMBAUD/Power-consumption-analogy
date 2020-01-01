
function wattToDailyJoules(w, durationInHours) {
    return durationInHours * 3600 * w;
}

var gameUsage = 2, twitchUsage = 12, netflixUsage = 5, googleUsage = 2;
var pcUsage = 0;

var googleSlider, twitchSlider, netflixSlider, gameSlider, pcSlider;

var pcDetails = {
    "Google": googleUsage,
    "Twitch": twitchUsage,
    "Netflix": netflixUsage,
    "Jeux": gameUsage
}

var pcColors = d3.scaleOrdinal()
    .domain(["Google", "Twitch", "Netflix", "Jeux"])
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);


function key(d) { return d.data.label; };

function getData(data, colors) {
    var labels = colors.domain();
    return labels.map(function (label) {
        return { label: label, value: data[label] }
    });
}

function createTicks(tick, skipStep = 0) {
    var min = parseInt(tick.min)
    var max = parseInt(tick.max);
    var step = parseInt(tick.step); // can be empty string
    if (!step) step = 1;
    var div = document.createElement("div");
    div.className = "ticks"
    for (var i = min; i < max + 1; i = i + ((skipStep) ? skipStep : step)) {
        var span = document.createElement("span");
        span.className = "tick"
        span.innerHTML = i;
        div.appendChild(span);

    }

    tick.parentElement.appendChild(div);
}




window.onload = () => {
    var ticks = document.getElementsByClassName("slider");
    for (let tick of ticks) {
        createTicks(tick, 6);
    }
    googleSlider = document.getElementById("google");
    twitchSlider = document.getElementById("twitch");
    netflixSlider = document.getElementById("netflix");
    gameSlider = document.getElementById("jeux");
    pcSlider = document.getElementById("pc");



    googleSlider.value = googleUsage;
    twitchSlider.value = twitchUsage;
    netflixSlider.value = netflixUsage;
    gameSlider.value = gameUsage;

    gameSlider.oninput = () => {
        gameUsage = parseInt(gameSlider.value);
        refreshInterface();
    }
    netflixSlider.oninput = () => {
        netflixUsage = parseInt(netflixSlider.value);
        refreshInterface();
    }
    twitchSlider.oninput = () => {
        twitchUsage = parseInt(twitchSlider.value);
        refreshInterface();
    }
    googleSlider.oninput = () => {
        googleUsage = parseInt(googleSlider.value);
        refreshInterface();
    }
    pcSlider.oninput = () => {
        console.log("input");
    }

    var svg = d3.select("#visu").append("svg").append("g");
    svg.append("g")
        .attr("class", "slices");
    svg.append("g")
        .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");

    var width = 960,
        height = 450,
        radius = Math.min(width, height) / 2;

    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        });


    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var refreshPie = function (data, colors) {

        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data));
        slice.enter()
            .insert("path")
            .attr('d', d3.arc()
                .innerRadius(radius* 0.8)
                .outerRadius(radius)
            )
            .attr('fill', function (d) { return (colors(d.data.label)) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 1)
        /* slice		
            .transition().duration(1000)
            .attrTween("d", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return arc(interpolate(t));
                };
            })*/
        slice.exit()
            .remove();
    }

    var refreshInterface = function () {
        var newPcUsage = gameUsage + twitchUsage + netflixUsage + googleUsage;
        //TODO: check validitiy (SUM <= 24h)
        pcUsage = newPcUsage;
        pcSlider.value = pcUsage;
        pcDetails = {
            "Google": googleUsage,
            "Twitch": twitchUsage,
            "Netflix": netflixUsage,
            "Jeux": gameUsage
        }
        
        //TODO refresh D3
        console.log(getData(pcDetails, pcColors));
        refreshPie(getData(pcDetails, pcColors), pcColors);

    }

    refreshInterface();

}