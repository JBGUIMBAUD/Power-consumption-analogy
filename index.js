
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
    renderViz(getData(pcDetails, pcColors));
}

function renderViz(dataset) {
    var margin = {top: 40, right: 30, bottom: 30, left: 50},
        width = 460 - margin.left - margin.right,
        height = 320 - margin.top - margin.bottom;

    var greyColor = "#898989";
    var barColor = d3.interpolateInferno(0.4);
    var highlightColor = d3.interpolateInferno(0.3);

    var formatPercent = d3.format(".0%");

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .range([0, width])
            .padding(0.4);
    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x).tickSize([]).tickPadding(10);
    var yAxis = d3.axisLeft(y);
    // var yAxis = d3.axisLeft(y).tickFormat(formatPercent);

    console.log(dataset);
    x.domain(dataset.map( d => { return d.label; }));
    y.domain([0, d3.max(dataset,  d => { return d.value; })]);
    // y.domain([0, 1]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class","y axis")
        .call(yAxis);

    svg.selectAll(".bar")
        .data(dataset)
        .enter().append("rect")
        .attr("class", "bar")
        .style("display", d => { return d.value === null ? "none" : null; })
        .style("fill",  d => { 
            return d.value === d3.max(dataset,  d => { return d.value; }) 
            ? highlightColor : barColor
            })
        .attr("x",  d => { return x(d.label); })
        .attr("width", x.bandwidth())
            .attr("y",  d => { return height; })
            .attr("height", 0)
                .transition()
                .duration(750)
                .delay(function (d, i) {
                    return i * 150;
                })
        .attr("y",  d => { return y(d.value); })
        .attr("height",  d => { return height - y(d.value); });

    svg.selectAll(".label")        
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "label")
        .style("display",  d => { return d.value === null ? "none" : null; })
        .attr("x", ( d => { return x(d.label) + (x.bandwidth() / 2) ; }))
            .style("fill",  d => { 
                return d.value === d3.max(dataset,  d => { return d.value; }) 
                ? highlightColor : greyColor
                })
        .attr("y",  d => { return height; })
            .attr("height", 0)
                .transition()
                .duration(750)
                .delay((d, i) => { return i * 150; })
        .text( d => { return d.value; })
        .attr("y",  d => { return y(d.value) + .1; })
        .attr("dy", "-.7em"); 
  }