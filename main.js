import * as d3 from 'd3';
const topojson = require("topojson");


function createMap(magnitude, timer, year, month, day) {
	// Setup the svg element size and margins
	var margin = {top: 20, right: 20, bottom: 20, left: 20},
			width = 1200 - margin.left - margin.right,
			height = 800 - margin.top - margin.bottom;

	// Set the projection methods for the world map
	var projection = d3.geoMercator()
										 .translate([width/2, height/1.5])
										 .scale((width - 1) / 2 / Math.PI);

	// Set the world map path
	var path = d3.geoPath().projection(projection);

	// Create a variable to hold the main svg element
	var svg = d3.select(document.body).append("svg").attr("width", width).attr("height", height);

	// Group to hold the maps and borders
	var g = svg.append('g').attr('id', 'world-map');

	// Add a clip path element to the world map group
	// for the x axis
	g.append('clipPath')
		.attr('id', 'clip-path')
		.append('rect')
		.attr('x', 0)
		.attr('y', 30)
	  .attr('width', width)
	  .attr('height', height - 30)

	// Group to hold all of the earthquake elements
	var gQuakes = svg.append('g').attr('id', 'all-quakes');

	// Import the geoJSON file for the world map
	d3.json('./map.json', function(error, world) {
			if(error) throw error;
//https://s3-us-west-2.amazonaws.com/s.cdpn.io/25240/world-110m.json
			// Setup timeframe object
			var currentDate = new Date();
			var startDate = new Date(year, month, day);

			// Append the World Map
			var worldMap = g.append('path')
				// attaches the clip path to not draw the map underneath the x axis
			  .attr('clip-path', 'url(#clip-path)') 
				// draws a single land object for the entire map
			  .datum(topojson.merge(world, world.objects.countries.geometries)) 
			  .attr('class', 'land')
			  .attr('d', path)

			// Append the World Map Country Borders
			g.append('path')
				.datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
			  .attr('class', 'boundry')
			  .attr('d', path);

			// Create the x scale based on the domain of the time ago object and now
			var x = d3.scaleTime()
													.domain([startDate, currentDate])
													.range([0, width - margin.right - margin.left]);

			// Append the xAxis on top
			var xAxis = svg.append('g')
															  .attr('id', 'xAxis')
															  .attr('transform', 'translate(20, 20)')
															  .call(d3.axisTop(x));

			//format dates for USGS api request
			var startYear = startDate.getYear();
			var startMonth = startDate.getMonth();
			var startDay = startDate.getDate();
			var currentYear = currentDate.getYear();
			var currentMonth = currentDate.getMonth();
			var currentDay = currentDate.getDate();
			if (startMonth.toString().length < 2) {startMonth = "0" + (startMonth + 1)};
			if (currentMonth.toString().length < 2) {currentMonth = "0" + currentMonth};
			if (startDay.toString().length < 2) {startDay = "0" + startDay};
			if (currentDay.toString().length < 2) {currentDay = "0" + currentDay};
			if (startYear.toString().length === 3) {startYear = "20" + startYear.toString().slice(1)};
			if (currentYear.toString().length === 3) {currentYear = "20" + currentYear.toString().slice(1)};
			if (startYear.toString().length === 2) {startYear = "19" + startYear};
			if (currentYear.toString().length === 2) {currentYear = "19" + currentYear};
			var startDateString = `${startYear}-${startMonth}-${startDay}`;
			var currentDateString = `${currentYear}-${currentMonth}-${currentDay}`;

			// Import earthquake data from USGS

			d3.json(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDateString}&endtime=${currentDateString}&minmagnitude=${magnitude}`, function(error, data) {
					if(error) throw error;
					var quake = data.features.reverse();
					// Create a group with the quake id to hold the quake circle and pulse circle
					var earthquakeGroups = gQuakes.selectAll('g')
						 .data(quake)
						 .enter().append('g')
						 .attr('id', function(d) {
							 return d.id;
						 })
						 .attr('class', 'quake-group');

					//Create the pulse-circle circles for the earthquake pulse
					gQuakes.selectAll('.quake-group')
						.append('circle')
						.attr('class', 'circle pulse-circle')
						.attr('cx', function(d) {
						 return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
						 })
						 .attr('cy', function(d) {
							 return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
						 })
						 .attr('r', function(d) {
							 return 0;
						 })
						 .attr('fill', '#ff0000');

					// Create the main quake circle with title
					gQuakes.selectAll('.quake-group')
						.append('circle')
							.attr('cx', function(d) {
							 return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
						 })
						.attr('cy', function(d) {
							 return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
						 })
						.attr('r', 0 )
						.attr('class', 'circle quake-circle')
						.style('fill', 'red')
						.style('opacity', 0.75)
						.append('title')
						.text(function(d) {
							return 'Magnitue ' + d.properties.mag + ' ' + d.properties.place;
						});


					// Function that calculates the difference between the time of the earthquake and
					// the beginning of the chart's time range
					var setQuakeDelay = function() {
							for(var i = 0; i < quake.length; i++){
									var timeDifference = quake[i].properties.time - startDate.getTime();
									var timeDifferenceObj = new Date(timeDifference);
									//Ensure that animation will run ~30 seconds from start to
									//finish
									quake[i].delay = timeDifferenceObj.getTime() / timer; 
							}
					}
					setQuakeDelay();
					var longestDelay = quake[quake.length - 1].delay;
					// Changes the radius of the earthquakes to their magnitude using a transition
					// and the delay created from the setQuakeDelay function
					var quakeCircles = svg.selectAll('.quake-circle')
							 .data(quake)
							 .transition()
							 .delay(function(d) {
									 return d.delay;
							 })
							 .duration(1000)
							 .attr('r', function(d) {
								 if(d.properties.mag < 0) {
											 return 0.1;
									 } else {
											 return d.properties.mag
									 }
							 });

					// Changes the radius of the pulse circle to eight times the magnitude
					// and fades out as it expands over two seconds
					var pulseCircles = svg.selectAll('.pulse-circle')
							 .data(quake)
							 .transition()
							 .delay(function(d) {
									 return d.delay;
							 })
							 .duration(2000)
							 .attr('r', function(d) {
								 if(d.properties.mag < 0) {
									 return 0.1 * 8;
								 } else {
									 return d.properties.mag * 8;
								 }
							 })
							 .style('opacity', 0)
							 .remove()

					// Add the time marker that moves across the xAxis while the animation it playing.
					var timeline = xAxis.append('circle')
							 .attr('class', 'transition-circle')
							 .attr('cx', 0)
							 .attr('cy', 0)
							 .attr('r', 3)
							 .style('fill', 'red')
							 .transition()
							 .ease(d3.easeLinear)
							 .duration(longestDelay + 1000)
							 .attr('cx', 1120)
			})
	})
}

// Remove any maps that may have been previously created and make a new
// one with the given params
// Arguments accepted: magnitude (float), year (int), month (int), day
// (int)
function createNewMap(magnitude, timer, year, month, day) {
	var chart = d3.selectAll('svg');
	chart.remove();
	createMap(magnitude, timer, year, month - 1, day);
}

// Create map-making buttons and event listeners	
document.addEventListener('DOMContentLoaded', () => { 
var mapButton = document.getElementById('map');

mapButton.addEventListener('click', function() {createNewMap(6.0, 1000000, 2017, 1, 1)});

var map2Button = document.getElementById('map2');

map2Button.addEventListener('click', function() {createNewMap(4.5, 100000, 2017, 6, 1)});

var map3Button = document.getElementById('map3');

map3Button.addEventListener('click', function() {createNewMap(4.0, 4000, 2017, 7, 1)});
});
