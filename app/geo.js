let data;
let countries;
let svg;
let projection;
let center = [11.9629, 50.5937]

async function init() {
  console.log('init');
  data = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
  countries = topojson.feature(data, data.objects.countries);
  resize();
  setInterval(() => updateDrivers(), 5000);
}

function resize() {
  console.log('resize');
  // resize
  const width =  window.innerWidth;//900;
  const height = window.innerHeight; //600;
  d3.select('svg').remove()

  svg = d3.select('body')
      .append('svg')
      .style('z-index', '-1')
      .attr('width', window.innerWidth)
      .attr('height', window.innerHeight);
  projection = d3.geoOrthographic()
      .center(center)
      .scale(900)
      .translate([width / 2, height / 2]);
  const path = d3.geoPath(projection);
  const g = svg.append('g');

  g.selectAll('path').data(countries.features).enter() 
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('g', 'lightgray');

  const screenSize = document.getElementById('screenSize');
  screenSize.innerHTML = "Width: " + width + "<br>Height: " + height;
  updateDrivers();
}

async function updateDrivers() {
  console.log('updateDrivers');
  const fetched = await d3.json('http://localhost:8080/drivers');
  drivers = [...fetched.map((obj, i) => { return {
    pos: [parseFloat(obj.location[0]), parseFloat(obj.location[1])],
    ...obj,
  }})]
  svg.selectAll('circle').remove();
  // create a tooltip
  var tooltip = d3.select("#tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style('z-index', '2')
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
 
  for (let i = 0; i < drivers.length; i++) {
    // console.log(JSON.stringify('geo: ' + drivers[i]));
    let coord = projection([drivers[i].pos[1], drivers[i].pos[0]]);
    // console.log(JSON.stringify('screen pos: ' + coord));
    svg.append("circle")
      .attr("cx", coord[0])
	    .attr("cy", coord[1])
	    .attr("r", 7)
      .on('mouseover', function(event) {
        // Get current event info
        console.log(event);
        d3.select(this).attr("fill", "red"); 
        tooltip
          .style("left", (event.clientX+10) + 'px')
          .style("top", (event.clientY+10) + 'px')
          .html(['<b>driverName:</b> ' + drivers[i].driverName, 
            '<b>driverCityOrigin:</b> ' + drivers[i].driverCityOrigin,
            '<b>driverLanguage</b>: ' + drivers[i].driverLanguage,
            '<b>driverPhone</b>: ' + drivers[i].driverPhone,
            '<b>driverInfo</b>: ' + drivers[i].driverInfo,
            '<b>licensePlate</b>: ' + drivers[i].licensePlate,
            '<b>kmDriven</b>: ' + drivers[i].kmDriven,
            '<b>latitude</b>: ' + drivers[i].location[0],
            '<b>longitude</b>: ' + drivers[i].location[1]]
            .map((s) => `<span>${s}</span><br>`)
            .join(''))
          .style("visibility", "visible");
      })
      .on('mouseout', function() {
        d3.select(this).attr("fill", "black");
        tooltip.style("visibility", "hidden");
      });
  }
}
function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      func.apply(this, args);
    }, timeout);
  };
}

window.onload = init;
window.onresize = debounce(() => resize());

