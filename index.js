function wattToJoules(watt_per_hour) {
    // 1 J = 1 W/s.
    res = watt_per_hour * 3600
    // console.log("Equivalent in Joules", res)
    return res
}

function joulesToRun(energy) {
    // 1h running = 770kcal/h = 3,2e+6 J
    res = energy / 3.2e6
    // console.log("Hours to run: ", res)
    return res
}

function joulesToWalk(energy) {
    // 1h walking = 267 kcal/h = 1,117e+6 J
    res = energy / 1.117e6
    // console.log("Hours to walk: ", res)
    return res
}

function joulesToCycle(energy) {
    // 1h cycling = 402 kcal/h = 1,682e+6
    res = energy / 1.682e6
    // console.log("Hours to cycle", res)
    return res
}

function joulesToSwim(energy) {
    // 1h swimming = 1071 kcal/h = 4481064 J
    res = energy / 4481064
    // console.log("Hours to swim", res)
    return res
}
function joulesToBigMac(energy) {
    // 1 BigMac = 2300kJ
    res = energy / 2300000
    // console.log("Number of BigMac: ", res)
    return res
}

function compute_watt_energy(wattsConsumption, pc_detailed_duration) {
    // compute energy in watt/h
    dict = {}
    for (key in pc_detailed_duration) {
        dict[key] = pc_detailed_duration[key] * wattsConsumption[key]
    }
    return dict
}

// var gameUsage = 0.6, idlleUsage = 0.4, netflixUsage = 0.57, googleUsage = 1.49, isLaptop = 0;
var gameUsage = 0.5, idlleUsage = 0.5, netflixUsage = 0.5, googleUsage = 1.5, isLaptop = 0;
var pcUsage = 0;

var googleSlider, twitchSlider, netflixSlider, gameSlider, pcSlider, isLaptopSlider;

var pcDetails = {
    "Google": googleUsage,
    "Repos": idlleUsage,
    "Netflix": netflixUsage,
    "Jeux": gameUsage
}

// laptop
var watts_consumption_laptop = {
    "Repos": 31.5,
    "Google": 40.5,
    "Netflix": 40.5,
    "Jeux": 109
}
// desktop pc
var watts_consumption_desktop = {
    "Repos": 137.5,
    "Google": 154.5,
    "Netflix": 159.5,
    "Jeux": 358
}
var wattsConsumption = watts_consumption_desktop;

var pcColors = d3.scaleOrdinal()
    .domain(["Repos","Google", "Netflix", "Jeux"].reverse())
    .range(["#004c6d", "#4c7c9b", "#86b0cc", "#c1e7ff"]);


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
    var transition_bar_time = 1000;

    for (let tick of ticks) {
        createTicks(tick, 6);
    }
    googleSlider = document.getElementById("google");
    twitchSlider = document.getElementById("twitch");
    netflixSlider = document.getElementById("netflix");
    gameSlider = document.getElementById("jeux");
    pcSlider = document.getElementById("pc");
    isLaptopSlider = document.getElementById("isLaptop");
    console.log(isLaptopSlider)

    googleSlider.value = googleUsage;
    twitchSlider.value = idlleUsage;
    netflixSlider.value = netflixUsage;
    gameSlider.value = gameUsage;

    // sliders values
    var pc_val = document.getElementById("pc_value");
    var idlle_val = document.getElementById("idlle_value");
    var google_val = document.getElementById("google_value");
    var netflix_val = document.getElementById("netflix_value");
    var game_val = document.getElementById("game_value");

    gameSlider.oninput = () => {
        var next = parseInt(gameSlider.value);
        if(next + idlleUsage + netflixUsage + googleUsage > 24) {
            next = next - (next + idlleUsage + netflixUsage + googleUsage  - 24)
            gameSlider.value = next;
        }
        gameUsage = next;
        refreshInterface();
    }
    netflixSlider.oninput = () => {
        var next = parseInt(netflixSlider.value);
        if(gameUsage + idlleUsage + next + googleUsage > 24) {
            next = next - (gameUsage + idlleUsage + next + googleUsage  - 24)
            netflixSlider.value = next;
        }
        netflixUsage = next;
        refreshInterface();
    }
    twitchSlider.oninput = () => {
        var next = parseInt(twitchSlider.value);
        if(gameUsage + next + netflixUsage + googleUsage > 24) {
            next = next - (gameUsage + next + netflixUsage + googleUsage  - 24)
            twitchSlider.value = next;
        }
        idlleUsage = next
        refreshInterface();
    }
    googleSlider.oninput = () => {
        var next = parseInt(googleSlider.value);
        if(gameUsage + idlleUsage + netflixUsage + next > 24) {
            next = next - (gameUsage + idlleUsage + netflixUsage + next  - 24)
            googleSlider.value = next;
        }
        googleUsage = parseInt(googleSlider.value);
        refreshInterface();
    }
    pcSlider.oninput = () => {
        // console.log("input");
        console.log(x.bandwidth())
        var next = parseInt(pcSlider.value);
        if(next==0) {
            gameUsage = 0
            idlleUsage = 0
            netflixUsage = 0
            googleUsage = 0
        } else if (pcUsage!=0){
            gameUsage = gameUsage*next/pcUsage
            idlleUsage = idlleUsage*next/pcUsage
            netflixUsage = netflixUsage*next/pcUsage
            googleUsage = googleUsage*next/pcUsage
        } else {
            gameUsage = next
            idlleUsage = 0
            netflixUsage = 0
            googleUsage = 0
        }
        
        googleSlider.value = googleUsage
        twitchSlider.value = idlleUsage
        netflixSlider.value = netflixUsage
        gameSlider.value = gameUsage
        pc_val.innerHTML = pcSlider.value;
        refreshInterface();
    }
    isLaptopSlider.oninput = () => {
        isLaptop = isLaptopSlider.checked;
        // console.log(isLaptop)
        if (isLaptop) {
            wattsConsumption = watts_consumption_laptop
        } else {
            wattsConsumption = watts_consumption_desktop
        }
        refreshInterface();
    }

    var svg = d3.select("#visu").append("svg").append("g");
    svg.append("g")
        .attr("class", "slices");
    svg.append("g")
        .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");
        
    var arc = d3.arc()
		.innerRadius(0);

    var width = 200,
        height = 100,
        radius = Math.min(width, height) / 2;

    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        });
        
        
    var tooltippie = d3.select('#visu') 
		.append('div')                                 
		.attr('class', 'tooltippie');

	tooltippie.append('div')
		.attr('class', 'label');
	
	tooltippie.append('div')                     
		.attr('class', 'x');
		
	tooltippie.append('div')  
		.attr('class', 'percent');

    svg.attr("transform", "translate(" + (width /2 + 20)  + "," + (height - 15)  + ")");

    var refreshPie = function (data, colors) {

        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data));
        slice.enter()
            .append("path")
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
            )
            .attr('fill', function (d) { return (colors(d.data.label)) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 1)
            .on('mouseover', function (d, i) {
				var total = d3.sum(data.map(function(d) {       
				return (d.enabled) ? d.x : 0;                                      
				}));
				tooltippie.select('.label').html(d.data.label);            
				tooltippie.select('.x').html(d3.format(".2f")(d.value) + ' h');         
				tooltippie.style('display', 'block');
            })
            .on('mouseout', function (d, i) {
                tooltippie.style('display', 'none');
            })
            .on('mousemove', function(d) {                 
				tooltippie.style('top', (d3.event.layerY + 10) + 'px') 
				.style('left', (d3.event.layerX + 10) + 'px');
			})
        slice.exit()
            .remove();
    }

    dataset = update_energy_data()

    subgroups = ["Repos", "Google", "Netflix", "Jeux"]

    var margin_bars = { top: 40, right: 30, bottom: 30, left: 50 },
        width_bars = 700 - margin_bars.left - margin_bars.right,
        height_bars = 600;
    var padding_big_macs = 40;
    

    var svg_bars = d3.select("body").select("#bar_chart").append("svg")
        .attr("width", width_bars + margin_bars.left + margin_bars.right)
        .attr("height", height_bars + margin_bars.top + margin_bars.bottom)
        .attr("class", "barChart")
        .append("g")
        .attr("transform", "translate(" + margin_bars.left + "," + margin_bars.top + ")");

    // Prep the tooltip bits, initial display is hidden
    var tooltip = d3.select("body").select("#bar_chart").select("svg").append("g")
        .attr("class", "tooltip")
        .style("display", "none");
        
    tooltip.append("rect")
        .attr("width", 60)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.2);

    tooltip.append("text")
        .attr("x", 30)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold");

    var x = d3.scaleBand()
        .range([0, width_bars])
        .padding(0.4);
    var x_bm = d3.scaleBand()
    .range([0, padding_big_macs])
    .padding(0.4);
    var y = d3.scaleLinear()
        .range([height_bars , 0]);

    var color = d3.scaleOrdinal(["#004c6d", "#4c7c9b", "#86b0cc", "#c1e7ff"].reverse()).domain(subgroups);

    var stack = d3.stack()
        .keys(subgroups.reverse())
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    var sport_data = dataset.slice(0,5)
    var big_macs_data = dataset.slice(5,6)
    var stackedData = stack(sport_data)
    var stackedBigMacs = stack(big_macs_data)

    var xAxis = d3.axisBottom(x).tickSize([]).tickPadding(10);
    var xAxis_bm = d3.axisBottom(x_bm).tickSize([]).tickPadding(10);
    var yAxis = d3.axisLeft(y);

    labels = ["utilisation du pc (h.)","marche (h.)", "vélo (h.)", "course (h.)", "nage (h.)", ""]
    x.domain(labels);
    x_bm.domain('Big Macs')

    // y.domain([0, d3.max(dataset, d => { return d.value; })]);
    // console.log(pcUsage)
    y.domain([0, d3.max(stackedData, function(d) {
        array = []
        array.push(d3.max(d, function(d) {
            // console.log(d.data.repos + d.data.google + d.data.netflix + d.data.jeux)
            return d.data.repos + d.data.google + d.data.netflix + d.data.jeux
        }))
        return array
    })]);

    svg_bars.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height_bars + ")")
        .call(xAxis);
    svg_bars.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate("+ (x("") + padding_big_macs + 10) +"," + height_bars + ")")
        .call(xAxis_bm);
    svg_bars.append("g")
        .attr("class", "yaxis")
        .call(yAxis);

    to_update = svg_bars.selectAll(".bar").data(stackedData)
        .enter().append("g")
        .attr("fill", function(d) {return color(d.key);})
        .attr("class", "bar")
        .selectAll("rect")
        .data(function(d) {return d; })
            .enter().append("rect")
                .attr("x", function(d) {
                    return x(d.data.label); 
                })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) {return y(d[0]) - y(d[1]);})
                .attr("width", x.bandwidth())
            .on("mouseover", function() {
                tooltip.style("display", null);
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '.8')
            })
            .on("mouseout", function() {
                tooltip.style("display", "none");
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1')
            })
            .on("mousemove", function(d) {
                // console.log(d);
                var xPosition = d3.mouse(this)[0]+10;
                var yPosition = d3.mouse(this)[1]+10;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(d3.format(".2f")(d[1]-d[0]));
            });
    
    // Bigs macs
    big_macs = svg_bars.selectAll(".bar_bm").data(stackedBigMacs)
        .enter().append("g")
        .attr("fill", function(d) { return color(d.key);})
        .attr("class", "bar_bm")
        .selectAll("rect")
        .data(function(d) {return d; })
            .enter().append("rect")
                .attr("x", function(d) {return x("");})
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) {return y(d[0]) - y(d[1]);})
                .attr("width", x.bandwidth())
                .attr("transform", function(d, i) { return "translate(" +padding_big_macs+ ",0)"; })
            .on("mouseover", function() {
                tooltip.style("display", null);
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '.8')
            })
            .on("mouseout", function() {
                tooltip.style("display", "none");
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1')
            })
            .on("mousemove", function(d) {
                // console.log(d);
                var xPosition = d3.mouse(this)[0]+10;
                var yPosition = d3.mouse(this)[1]+10;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(d3.format(".2f")(d[1]-d[0]));
            });
    
    //value on top
    totals_data = []
    sport_data.forEach(element => {
        totals_data.push(
            {label: element.label, value: element.Repos + element.Google + element.Netflix + element.Jeux}
        )
    });
    big_macs_total = [{label: big_macs_data[0].label, value: big_macs_data[0].Repos + big_macs_data[0].Google + big_macs_data[0].Netflix + big_macs_data[0].Jeux}]
    console.log(big_macs_total)
    // hours
    svg_bars.selectAll(".label")        
        .data(totals_data)
        .enter()
        .append("text")
        .attr("class", "label")
        .style("display",  d => { return d.value === null ? "none" : null; })
        .attr("x", ( (d, i) => {
            // console.log(i)
            return x(d.label) + 10; 
        }))
            .style("fill",  d => { 
                return d === d3.max(totals_data,  d => { return d.value; }) 
                ? highlightColor : "white"
                })
            .attr("height", 0)
                .transition()
                .duration(1000)
                .delay((d, i) => { return i * 150; })
        .text( d => { return d3.format(".2f")(d.value) })
        .attr("y",  d => { return y(d.value) + .1; })
        .attr("dy", "-.7em");
    // big macs
    svg_bars.selectAll(".label_bm")        
        .data(big_macs_total)
        .enter()
        .append("text")
        .attr("class", "label_bm")
        .style("display",  d => { return d.value === null ? "none" : null; })
        .attr("x", ( (d, i) => {
            return x('') + padding_big_macs + 10; 
        }))
        .style("fill",  d => { 
                return d === d3.max(totals_data,  d => { return d.value; }) 
                ? highlightColor : "white"
                })
            .attr("height", 0)
                .transition()
                .duration(1000)
                .delay((d, i) => { return i * 150; })
        .text( d => { return d3.format(".2f")(d.value) })
        .attr("dy", "-.7em");
    
    // big mac stroke separator
    svg_bars.append("line")//making a line for legend
        .attr("x1", x(""))
        .attr("x2", x(""))
        .attr("y1", height_bars)
        .attr("y2", height_bars - 200)
        .style("stroke-dasharray","5,5")//dashed array for line
        .style("stroke", "white");

    var legend = svg_bars.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 20)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(subgroups.slice().reverse())
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 40 + ")"; });
    
    legend.append("rect")
        .attr("x", width_bars - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", color);
    
    legend.append("text")
        .attr("x", width_bars - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .style('fill', 'white')
        .text(function(d) { return d; });
    
    refreshChart = function (dataset) {
        sport_data = dataset.slice(0,5)
        big_macs_data = dataset.slice(5,6)
        stackedData = stack(sport_data)
        stackedBigMacs = stack(big_macs_data)

        var ymax = 4;

        // y.domain([0, d3.max(stack(dataset), function (d) {
        //     array = []
        //     array.push(d3.max(d, function (d) {
        //         return d.data.Repos + d.data.Google + d.data.Netflix + d.data.Jeux
        //     }))
        //     return array
        // })]);
        totals_data = []
        sport_data.forEach(element => {
            totals_data.push(
                {label: element.label, value: element.Repos + element.Google + element.Netflix + element.Jeux}
            )
        });
        big_macs_total = [{label: big_macs_data[0].label, value: big_macs_data[0].Repos + big_macs_data[0].Google + big_macs_data[0].Netflix + big_macs_data[0].Jeux}]

        var max = d3.max(stack(dataset), function (d) {
            return d3.max(d, function (d) {
                return d.data.Repos + d.data.Google + d.data.Netflix + d.data.Jeux
            })
        })
        if(max < ymax) max = ymax;

        // console.log(max);
        y.domain([0,max]);

        yAxis.scale(y);

        svg_bars.selectAll(".bar").data(stackedData)
            .selectAll("rect")
            .data(function (d) { return d; }).transition().duration(transition_bar_time)
            .attr("y", function (d) { return y(d[1]); })
            .attr("height", function (d) { return y(d[0]) - y(d[1]); })

        
        svg_bars.selectAll(".bar_bm").data(stackedBigMacs)
            .selectAll("rect")
            .data(function (d) { return d; }).transition().duration(transition_bar_time)
            .attr("y", function (d) { return y(d[1]); })
            .attr("height", function (d) { return y(d[0]) - y(d[1]); })

        // values on top
        svg_bars.selectAll(".label").data(totals_data)
            .attr("height", 0)
                .transition()
                .duration(1000)
                .delay((d, i) => { return i * 150; })
        .text( d => { return d3.format(".2f")(d.value) })
        .attr("y",  d => { return y(d.value) + .1; })
        .attr("dy", "-.7em");

        svg_bars.selectAll(".label_bm").data(big_macs_total)
            .attr("height", 0)
                .transition()
                .duration(1000)
                .delay((d, i) => { return 6 * 150; })
            .text( d => { return d3.format(".2f")(d.value) })
            .attr("y",  d => { return y(d.value) + .1; })
            .attr("dy", "-.7em");

        svg_bars
            .select(".yaxis").transition().duration(transition_bar_time)
            .call(yAxis);
    }

    var refreshInterface = function () {
        var newPcUsage = gameUsage + idlleUsage + netflixUsage + googleUsage;
        //TODO: check validitiy (SUM <= 24h)
        pcUsage = newPcUsage;
        pcSlider.value = pcUsage;

        pc_val.innerHTML = pcSlider.value;
        idlle_val.innerHTML = twitchSlider.value;
        google_val.innerHTML = googleSlider.value;
        netflix_val.innerHTML = netflixSlider.value;
        game_val.innerHTML = gameSlider.value;

        pcDetails = {
            "Google": googleUsage,
            "Repos": idlleUsage,
            "Netflix": netflixUsage,
            "Jeux": gameUsage
        }
        refreshPie(getData(pcDetails, pcColors), pcColors);
        refreshChart(update_energy_data())
    }
    refreshInterface();

    
    function update_energy_data() {
        labels = ["marche (h.)", "vélo (h.)","course (h.)", "nage (h.)", "Big Macs"]
        data = []
        // add total hours
        data.push({"label": "utilisation du pc (h.)", "Repos": pcDetails.Repos,"Google": pcDetails.Google, "Netflix": pcDetails.Netflix, "Jeux": pcDetails.Jeux})

        watt_energies = compute_watt_energy(wattsConsumption, pcDetails)
        for (i in labels) {
            label = labels[i]
            iddle = compute_energy_joules(wattToJoules(watt_energies.Repos), label)
            google = compute_energy_joules(wattToJoules(watt_energies.Google), label)
            netflix = compute_energy_joules(wattToJoules(watt_energies.Netflix), label)
            game = compute_energy_joules(wattToJoules(watt_energies.Jeux), label)
            data.push({"label": label, "Repos": iddle,"Google": google, "Netflix": netflix, "Jeux": game})
        }
        return data
    }

    function compute_energy_joules(energy, label) {
        switch (label) {
            case "marche (h.)":
                return joulesToWalk(energy)
            case "course (h.)":
                return joulesToRun(energy)
            case "vélo (h.)":
                return joulesToCycle(energy)
            case "nage (h.)":
                return joulesToSwim(energy)
            case "Big Macs":
                return joulesToBigMac(energy)
            default:
              console.log("Error with labels");
        }
    }
}
