
function wattToDailyJoules(w, durationInHours) {
    res = durationInHours * 3600 * w;
    // console.log("Total energy(J: ", res)
    return res
}

function wattToJoules(w_enery) {
    // 1 J = 1 W/s.
    res = w_enery * 3600
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

function compute_total_Watt_enery(wattsConsumption, pcDetails) {
    energy_total = 0
    Object.keys(pcDetails).forEach(function (key) {
        energy_total += pcDetails[key] * wattsConsumption[key]
    });
    return energy_total
}

function compute_watt_energy(wattsConsumption, pc_detailed_duration) {
    dict = {}
    for (key in pc_detailed_duration) {
        dict[key] = pc_detailed_duration[key] * wattsConsumption[key]
    }
    // console.log(dict)
    return dict
}

var gameUsage = 2, idlleUsage = 12, netflixUsage = 5, googleUsage = 2, isLaptop = 0;
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
    "Repos": 32.5,
    "Google": 34.5,
    "Netflix": 40.5,
    "Jeux": 109
}
var watts_consumption_desktop = {
    "Repos": 132.5,
    "Google": 150.5,
    "Netflix": 190.5,
    "Jeux": 300
}
var wattsConsumption = watts_consumption_desktop;

var pcColors = d3.scaleOrdinal()
    .domain(["Repos","Google", "Netflix", "Jeux"])
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
    // isLaptopSlider.value = isLaptop;

    gameSlider.oninput = () => {
        gameUsage = parseInt(gameSlider.value);
        refreshInterface();
    }
    netflixSlider.oninput = () => {
        netflixUsage = parseInt(netflixSlider.value);
        refreshInterface();
    }
    twitchSlider.oninput = () => {
        idlleUsage = parseInt(twitchSlider.value);
        refreshInterface();
    }
    googleSlider.oninput = () => {
        googleUsage = parseInt(googleSlider.value);
        refreshInterface();
    }
    pcSlider.oninput = () => {
        // console.log("input");
    }
    isLaptopSlider.oninput = () => {
        isLaptop = isLaptopSlider.checked;
        console.log(isLaptop)
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

    var width = 200,
        height = 100,
        radius = Math.min(width, height) / 2;

    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        });


    svg.attr("transform", "translate(" + width /2+ "," + height /1.7 + ")");

    var refreshPie = function (data, colors) {

        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data));
        slice.enter()
            .append("path")
            .attr('d', d3.arc()
                .innerRadius(radius * 0.8)
                .outerRadius(radius)
            )
            .attr('fill', function (d) { return (colors(d.data.label)) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 1)
            .on('mouseover', function (d, i) {
                d3.select(this).transition()
                     .duration('50')
                     .attr('opacity', '.85')
            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                     .duration('50')
                     .attr('opacity', '1');
            })
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

    dataset = update_energy_data()

    subgroups = ["Repos", "Google", "Netflix", "Jeux"]

    var margin_bars = { top: 40, right: 30, bottom: 30, left: 50 },
        width_bars = 700 - margin_bars.left - margin_bars.right,
        height_bars = 600;

    var greyColor = "#898989";
    var barColor = d3.interpolateInferno(0.4);
    var highlightColor = d3.interpolateInferno(0.3);

    var formatPercent = d3.format(".0%");

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
    var y = d3.scaleLinear()
        .range([height_bars , 0]);

    var color = d3.scaleOrdinal(["#004c6d", "#4c7c9b", "#86b0cc", "#c1e7ff"]).domain(subgroups);

    //stack the data? --> stack per subgroup
    var stack = d3.stack()
        .keys(subgroups)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);
    var stackedData = stack(dataset)

    var xAxis = d3.axisBottom(x).tickSize([]).tickPadding(10);
    var yAxis = d3.axisLeft(y);
    // var yAxis = d3.axisLeft(y).tickFormat(formatPercent);

    labels = ["time walking(h.)", "time running (h.)", "time cycling (h.)", "time swimming (h.)", "Big Macs"]
    x.domain(labels);
    // y.domain([0, d3.max(dataset, d => { return d.value; })]);
    // console.log(pcUsage)
    y.domain([0, d3.max(stackedData, function(d) {
        array = []
        array.push(d3.max(d, function(d) {
            // console.log(d.data.repos + d.data.google + d.data.netflix + d.data.jeux)
            return d.data.repos + d.data.google + d.data.netflix + d.data.jeux
        }))
        // console.log(array)
        return array
    })]);

    svg_bars.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height_bars + ")")
        .call(xAxis);
    svg_bars.append("g")
        .attr("class", "yaxis")
        .call(yAxis);

    to_update = svg_bars.selectAll(".bar").data(stackedData)
        .enter().append("g")
        .attr("fill", function(d) {
            // console.log(d.key)
            return color(d.key); 
        })
        .attr("class", "bar")
        .selectAll("rect")
        .data(function(d) {return d; })
            .enter().append("rect")
                .attr("x", function(d) {
                    // console.log("d",d.data.label)
                    return x(d.data.label); 
                })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width",x.bandwidth())
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
                tooltip.select("text").text(d3.format(".1f")(d[1]-d[0]));
            });

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

    // svg_bars.selectAll(".label")
    //     .data(dataset)
    //     .enter()
    //     .append("text")
    //     .attr("class", "label")

    refreshChart = function (dataset) {
        y.domain([0, d3.max(stack(dataset), function (d) {
            array = []
            array.push(d3.max(d, function (d) {
                return d.data.Repos + d.data.Google + d.data.Netflix + d.data.Jeux
            }))
            return array
        })]);
        yAxis.scale(y);
 
        svg_bars.selectAll(".bar").data(stack(dataset))
            .selectAll("rect")
            .data(function (d) { return d; })
            .attr("y", function (d) { return y(d[1]); })
            .attr("height", function (d) { return y(d[0]) - y(d[1]); })

        // svg_bars.selectAll(".label")
        //     .data(dataset)
        //     .attr("class", "label")
        //     // .style("display", d => { return d.value === null ? "none" : null; })
        //     .attr("x", (d => { return x(d.label) + (x.bandwidth() / 2); }))
        //     .style("fill", d => {
        //         return d.value === d3.max(dataset, d => { return d.value; })
        //             ? highlightColor : greyColor
        //     })
        //     .attr("height", 0)
        //     .text(d => { return d3.format(".1f")(d.value) })
        //     .attr("y", d => { return y(d.value) + .1; })
        //     .attr("dy", "-.7em");

        svg_bars
            .select(".yaxis")
            .call( yAxis);
    }

    var refreshInterface = function () {
        var newPcUsage = gameUsage + idlleUsage + netflixUsage + googleUsage;
        //TODO: check validitiy (SUM <= 24h)
        pcUsage = newPcUsage;
        pcSlider.value = pcUsage;
        pcDetails = {
            "Google": googleUsage,
            "Repos": idlleUsage,
            "Netflix": netflixUsage,
            "Jeux": gameUsage
        }

        //TODO refresh D3
        // console.log(getData(pcDetails, pcColors));
        refreshPie(getData(pcDetails, pcColors), pcColors);
        refreshChart(update_energy_data())
        // print energies
        // dataset = update_energy_data()
    }
    refreshInterface();

    
    function update_energy_data() {
        // tot_energy_w = compute_total_Watt_enery(wattsConsumption, pcDetails)
        // tot_energy = wattToJoules(tot_energy_w)
        // walk = joulesToWalk(tot_energy)
        // run = joulesToRun(tot_energy)
        // cycle = joulesToCycle(tot_energy)
        // swim = joulesToSwim(tot_energy)
        // burger = joulesToBigMac(tot_energy)

        labels = ["time walking(h.)", "time running (h.)", "time cycling (h.)", "time swimming (h.)", "Big Macs"]
        data = []
        watt_energies = compute_watt_energy(wattsConsumption, pcDetails)
        // console.log("energies", watt_energies)
        for (i in labels) {
            label = labels[i]
            iddle = compute_energy_joules(wattToJoules(watt_energies.Repos), label)
            google = compute_energy_joules(wattToJoules(watt_energies.Google), label)
            netflix = compute_energy_joules(wattToJoules(watt_energies.Netflix), label)
            game = compute_energy_joules(wattToJoules(watt_energies.Jeux), label)
            data.push({"label": label, "Repos": iddle,"Google": google, "Netflix": netflix, "Jeux": game})
        }
        // console.log(data)


        // data = [
        //     { "label": "time walking(h.)", "value": walk },
        //     { "label": "time running (h.)", "value": run },
        //     { "label": "time cycling (h.)", "value": cycle },
        //     { "label": "time swimming (h.)", "value": swim },
        //     { "label": "Big Macs", "value": burger }
        // ]
        return data
    }

    function compute_energy_joules(energy, label) {
        switch (label) {
            case "time walking(h.)":
                return joulesToWalk(energy)
                break;
            case "time running (h.)":
                return joulesToRun(energy)
            case "time cycling (h.)":
                return joulesToCycle(energy)
                break;
            case "time swimming (h.)":
                return joulesToSwim(energy)
                break;
            case "Big Macs":
                return joulesToBigMac(energy)
            default:
              console.log("Error with labels");
        }
    }
}
