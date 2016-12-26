/* global d3, $ */
//pg 263 for tooltips
function row(d) {  return {
         year: new Date(+d.Year, 0, 1), // convert "Year" column to Date
       };}
       
var formatTime = d3.timeFormat("%d %b %y");
$(document).ready(function() {
    //var margin = {top: 20, right: 20, bottom: 70, left: 50},
    //var margin = {top: 40, right: 40, bottom: 70, left: 70},
    var margin = {top: 40, right: 20, bottom: 70, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    var parseTime = d3.timeParse("%d-%b-%y");
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    //var y1 = d3.scaleLinear().range([height, 0]);
    //var y0 = d3.scaleLinear().range([height, 0]);
    
    //tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    //area thing
    /*var area = d3.area()
        .x(function(d) { return x(d.date); })
        .y0(height)
        .curve(d3.curveBasis) // curve it
        .y1(function(d) { return y(d.close); });*/
    
    //first line
    var valueline = d3.line()
        .curve(d3.curveBasis) // curve it
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(x)
        //.ticks(5)
    }
    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(y)
        //.ticks(5)
    }
    
    d3.csv("/public/dauwaumau.csv", function(error,data) {
        if (error) throw error;
        //data.forEach(function(d) {
        //    d.date = parseTime(d.date);
        //    d.DAU = +d.DAU;
        //    });
        //data = data.map(function(d) { return [new Date(d["date"]), +d["DAU"], +d["rollingWAU"], +d["rollingMAU"] ]; });
        data = data.map(function(d) { return { date:new Date(d["date"]), close:+d["DAU"]}});
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.close; })]);
        
        // add the X gridlines
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        )
        // add the Y gridlines
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )
        
        // add the area
        /*svg.append("path")
            .data([data])
            .attr("class", "area")
            .attr("d", area);*/
        
        //add line
        svg.append("path")
            .data([data])
            .attr("class", "line")
            //.style("stroke-dasharray", ("3, 3")) // dotted lines
            .attr("d", valueline);
        
        //barchart
        /*
        var barWidth = Math.ceil(width / data.length);
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.date); })
            .attr("width", barWidth)
            .attr("y", function(d) { return y(d.close); })
            .attr("height", function(d) { return height - y(d.close); })
            .on("click", function(d) {
                d3.selectAll(".bar").style("fill","steelblue");
                d3.select(this).style("fill","lightsteelblue");
                div.transition()
                .duration(200)
                .style("opacity", .9);
                div.html(formatTime(d.date) + "<br/>" + d.close)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill","steelblue");
                div.transition()
                .duration(500)
                .style("opacity", 0);
            });            
        */
        //add end text
        /*svg.append("text")
            .attr("transform", "translate("+(width+3)+","+y(data[data.length-1].close)+")")
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("fill", "steelblue")
            .text("DAU");*/
        //add dots
        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 2)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.close); })
            .on("mouseover", function(d) {
                //d3.selectAll("circle").style("fill","steelblue");
                d3.select(this).style("fill","steelblue");
                div.transition()
                .duration(200)
                .style("opacity", .9);
                div.html(formatTime(d.date) + "<br/>" + d.close)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill","black");
                div.transition()
                .duration(500)
                .style("opacity", 0);
            });
            
        //axis bottom
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%b %Y"))
            )
            /*.selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");*/
        
        // add Date label
        svg.append("text")
            .attr("x", width / 2 )
            .attr("y", height + margin.top + 20)
            .style("text-anchor", "middle")
            .text("Date");
        
        // add yaxis
        svg.append("g")
            .call(d3.axisLeft(y));
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Value");
        
        //add title
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("text-decoration", "underline")
            .text("Value vs Date Graph");
        
        $(".chartdata").html(data);//set);
        
    });
})