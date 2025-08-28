import React, { useEffect, useRef,useState } from 'react';
import * as d3 from "d3";
import "./pie.css";
const FriendChart = ({mainUserJSON,sortedFriendsJSON, sendDataFunction,friendArray}) => {
  
  const chartRef = useRef(null);
  const svgRef = useRef(null); // Store SVG selection instead
  const arcsRef = useRef(null);
  const defRef= useRef(null);
  const [mainUser, setMainUser] = useState(-1);
  const [sortedFriends, setSortedFriends] = useState(-1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [showMainTooltip, setMainTooltip] = useState(false);
  const colorCodes=["#f13434ff","#E35E1C","#417a9b","#FFC82C"]
  const width = 700;
  const height = 700;
  const previousCoords=[];
  const radius = (Math.min(width, height) / 2)*0.8;
  const innerRadius=0;


  useEffect(() => {
    d3.select(chartRef.current).selectAll("*").remove();
    //basically everytime this reloads this should go off
    setMainUser(mainUserJSON.data.mainUser);
    //process the jsonData to match sortedFriends
    let totalHours=0;
    let genreMap= new Map()
    mainUserJSON.data.mainUser.orderedGenres.forEach(genre => {
      totalHours+=genre[1];
      genreMap.set(genre[0],genre[1]);
    });
//this creates the pie chart in such a way it can be displayed
  const processedJSON = mainUserJSON.data.mainUser.orderedGenres.map((genre, index) => ({
  name: genre[0],  
  value: genre[1] / totalHours,  // genre hours is second element
  color: colorCodes[index % colorCodes.length]
}));
//    setSortedFriends(processedJSON);
    createPieChart(processedJSON,mainUserJSON.data.mainUser);
  //this begins handling the data, adding more circles every few seconds
 const interval = setInterval(() => 
  {
    batchPopulatePieChart(svgRef.current, arcsRef.current, radius, defRef.current); // Pass SVG selection
  }, 100);


  return () => clearInterval(interval); 

  }, [mainUserJSON]);
  
  function createPieChart(data,user) {



   
    const pie = d3.pie()
      .sort(null)
      .value(d => d.value);
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);
    const arcs = pie(data);
    arcsRef.current=arcs;
    
    // Create SVG container
    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");
    
    // Store SVG selection in ref
    svgRef.current = svg;
    
    let defs = svg.append("defs");
    defRef.current=defs;
    // Add pie segments
    svg.append("g")
      .attr("stroke", "white")
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", d => d.data.color)
      .attr("d", arc);
      //populatePieChart(svg,arcs,radius,defs);
    // });
    // Add section labels
    svg.append("g")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
      .attr("transform", d => {
        // Position labels at outer edge of arc
        const pos = arc.centroid(d);
        // Adjust position to be more toward the edge
        const midAngle = d.startAngle - (Math.PI/2)+(d.endAngle - d.startAngle) / 2;
        const x = Math.cos(midAngle) * (radius * 0.85);
        const y = Math.sin(midAngle) * (radius * 0.85);
        return `translate(${x},${y})`;
      })
      .attr("class", "pie-label")
      .text(d => d.data.name);
      const patternId = `main-image-${user.id}`;
      // Add pattern to defs
      if(user.imageURL) 
        {
          defs.append("pattern")
          .attr("id", patternId)
          .attr("class", "svg-image")
          .attr("patternUnits", "objectBoundingBox")
          .attr("width", "1")
          .attr("height", "1")
          .append("image")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", 100)
            .attr("height", 100)
            .attr("xlink:href", user.imageURL)
            .attr("preserveAspectRatio", "xMidYMid slice");
        }
    
      const iconGroup = svg.append("g")
        .attr("class", "icon-group")
        .attr("transform", `translate(${0}, ${0})`);

    iconGroup.append("circle")
        .attr("r", 50)
        .attr("fill", user.imageURL ? `url(#${patternId})` : "white") // Reference the pattern by ID
        .attr("stroke", "#333")
        .attr("stroke-width", 1.5)
        .attr("class", "icon-bg")
        .on("click", () => console.log(`Clicked on ${user.username}`))
        .on("mouseover", function(){
          d3.select(this).transition()
            .duration('50')
            .attr("stroke-width", 3.0);
          setMainTooltip(true);
        })
        .on("mouseout", function() {
          d3.select(this).transition()
            .duration('50')
            .attr("stroke-width", 1.5);
          setMainTooltip(false);
        });
   
  }

useEffect(() => {
  if(sortedFriendsJSON !== -1 && sortedFriendsJSON && sortedFriendsJSON.data && sortedFriendsJSON.data.genres)
  {
    //populatePieChart(svgRef.current, arcsRef.current, radius, defRef.current); // Pass SVG selection
  }
  }, [sortedFriendsJSON]);

  function populatePieChart(svg, arcs, radius, defs)
  {
    // Add null checks
    if (!svg || !arcs || !sortedFriendsJSON || !sortedFriendsJSON.data || !sortedFriendsJSON.data.genres) {
      console.log("Missing required data for populatePieChart");
      return;
    }

    arcs.forEach((d, i) => {
      const angleSpan = d.endAngle - d.startAngle;
      const allFriends = [];
      const reservedArcLength=4;
      
      // Fixed: Use correct property names and data structure
      Object.keys(sortedFriendsJSON.data.genres).forEach(genreName => 
      {
        if(d.data.name === genreName) // Fixed: d.data.name instead of d.name
        {
          sortedFriendsJSON.data.genres[genreName].forEach(friend => { // Fixed: correct data path
              allFriends.push(friend)
          });
        }
      });
      
      let count=0;
      let circlesForLayer=0;
      let centerOffset=30;
      let previousLayers=0;
      const circleRadius=20;
      let previousCoords=[];
      
      allFriends.forEach((friend) =>
      {
        const maxAttempts=10;
        let x=-1;
        let y=-1;
        let nearbyCircle=true;
        let currentAttempts=0;
        while(nearbyCircle===true && currentAttempts<maxAttempts)
          {
          currentAttempts++;
          
          let centerOffset=Math.random()*(radius-90)+80
          let angleOffset=Math.random()*(angleSpan-(circleRadius/centerOffset)*2)+(circleRadius/centerOffset);
      
          x=Math.cos(angleOffset+d.startAngle+Math.PI/2)*centerOffset;
          y=Math.sin(angleOffset+d.startAngle+Math.PI/2)*centerOffset;
          nearbyCircle=false;
          for (const prev of previousCoords) 
          {
            const dx = x - prev[0];
            const dy = y - prev[1];
            const distance = Math.sqrt(dx * dx + dy * dy);
            

            if (distance < (2 * circleRadius)) 
            {
                
                nearbyCircle = true; // Circles are intersecting
                break;
            }
          
          }
          if(nearbyCircle===false)
            {
                previousCoords.push([x,y]);
            }
          }
      
        if(nearbyCircle==false)
        {
          count=count+1;
        
      // Create a group for this icon
        const patternId = `friend-image-${friend.id}`;
        
        // Add pattern to defs
        if(friend.imageURL) 
          {
            defs.append("pattern")
            .attr("id", patternId)
            .attr("class", "svg-image")
            .attr("patternUnits", "objectBoundingBox")
            .attr("width", "1")
            .attr("height", "1")
            .append("image")
              .attr("x", "0")
              .attr("y", "0")
              .attr("width", circleRadius * 2)
              .attr("height", circleRadius * 2)
              .attr("xlink:href", friend.imageURL)
              .attr("preserveAspectRatio", "xMidYMid slice");
        }
      
        const iconGroup = svg.append("g")
          .attr("class", "icon-group")
          .attr("transform", `translate(${-x}, ${-y})`);

      iconGroup.append("circle")
          .attr("r", circleRadius)
          .attr("fill", friend.imageURL ? `url(#${patternId})` : "white") // Reference the pattern by ID
          .attr("stroke", "#333")
          .attr("stroke-width", 1.5)
          .attr("class", "icon-bg")
          .on("click", () => sendDataFunction(friend.id))
          .on("mouseover", function(){
            d3.select(this).transition()
              .duration('50')
              .attr("stroke-width", 3.0);
            setTooltipContent(`${friend.username} - ${d.data.name}`);
            setShowTooltip(true);
          })
          .on("mouseout", function() {
            d3.select(this).transition()
              .duration('50')
              .attr("stroke-width", 1.5);
            setShowTooltip(false);
          });
        }
        
      });
    });
  }

  function batchPopulatePieChart(svg, arcs, radius, defs)
  {
    console.log(friendArray);


    if (!svg || !arcs || friendArray.length<=0) {
      console.log("Missing required data for populatePieChart");
      return;
    }
    let count=0;
    let circlesForLayer=0;
    let centerOffset=30;
    let previousLayers=0;
    const circleRadius=20;
    const reservedArcLength=4;
    const maxAttempts=10;

    let latestPair=friendArray.pop();

    arcs.forEach((d, i) => {
      if(latestPair[0]==d.data.name)
      {
        const friend=latestPair[1];
        const angleSpan = d.endAngle - d.startAngle;
        
        let x=-1;
        let y=-1;
        let nearbyCircle=true;
        let currentAttempts=0;
        while(nearbyCircle===true && currentAttempts<maxAttempts)
          {
          currentAttempts++;
          
          let centerOffset=Math.random()*(radius-90)+80
          let angleOffset=Math.random()*(angleSpan-(circleRadius/centerOffset)*2)+(circleRadius/centerOffset);
      
          x=Math.cos(angleOffset+d.startAngle+Math.PI/2)*centerOffset;
          y=Math.sin(angleOffset+d.startAngle+Math.PI/2)*centerOffset;
          nearbyCircle=false;
          for (const prev of previousCoords) 
          {
            const dx = x - prev[0];
            const dy = y - prev[1];
            const distance = Math.sqrt(dx * dx + dy * dy);
            

            if (distance < (2 * circleRadius)) 
            {
                
                nearbyCircle = true; // Circles are intersecting
                break;
            }
          
          }
          if(nearbyCircle===false)
            {
                previousCoords.push([x,y]);
            }
          }
      
        if(nearbyCircle==false)
        {
          count=count+1;
        
      // Create a group for this icon
        const patternId = `friend-image-${friend.id}`;
        
        // Add pattern to defs
        if(friend.imageURL) 
          {
            defs.append("pattern")
            .attr("id", patternId)
            .attr("class", "svg-image")
            .attr("patternUnits", "objectBoundingBox")
            .attr("width", "1")
            .attr("height", "1")
            .append("image")
              .attr("x", "0")
              .attr("y", "0")
              .attr("width", circleRadius * 2)
              .attr("height", circleRadius * 2)
              .attr("xlink:href", friend.imageURL)
              .attr("preserveAspectRatio", "xMidYMid slice");
        }
      
        const iconGroup = svg.append("g")
          .attr("class", "icon-group")
          .attr("transform", `translate(${-x}, ${-y})`);

      iconGroup.append("circle")
          .attr("r", circleRadius)
          .attr("fill", friend.imageURL ? `url(#${patternId})` : "white") // Reference the pattern by ID
          .attr("stroke", "#333")
          .attr("stroke-width", 1.5)
          .attr("class", "icon-bg")
          .on("click", () => sendDataFunction(friend.id))
          .on("mouseover", function(){
            d3.select(this).transition()
              .duration('50')
              .attr("stroke-width", 3.0);
            setTooltipContent(`${friend.username} - ${d.data.name}`);
            setShowTooltip(true);
          })
          .on("mouseout", function() {
            d3.select(this).transition()
              .duration('50')
              .attr("stroke-width", 1.5);
            setShowTooltip(false);
          });
        }
        refreshLabels(svg, arcs);

      }
    });
  }
  function refreshLabels(svg, arcs) {
    // Remove existing labels
    svg.selectAll(".pie-label").remove();

    // Add section labels back
    svg.append("g")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", d => {
            // Position labels at outer edge of arc
            const midAngle = d.startAngle - (Math.PI/2) + (d.endAngle - d.startAngle) / 2;
            const x = Math.cos(midAngle) * (radius * 0.85);
            const y = Math.sin(midAngle) * (radius * 0.85);
            return `translate(${x},${y})`;
        })
        .attr("class", "pie-label")
        .text(d => d.data.name);
}

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX + 15, y: e.clientY + 15 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    
    <div className="pie-chart-container">
      <div ref={chartRef} className="chart-area"></div>
      <div className="cursor-follower" style={{
    display: showTooltip ? 'block' : 'none',
    left: mousePosition.x,
    top: mousePosition.y}}>
    <p>{tooltipContent}</p>
      </div>
      <div className="cursor-follower" style={{
    display: showMainTooltip ? 'block' : 'none',
    left: mousePosition.x,
    top: mousePosition.y}}>
    {mainUser && mainUser !== -1 && (
        <>
            <p>{mainUser.username}</p>
          <p>Total Hours: {mainUser.orderedGenres.reduce((total, genre) => total + genre[1], 0)}</p>
            {mainUser.orderedGenres.map((genre, index) => (
                <p key={index}>{index + 1}. {genre[0]} {genre[1]} hours</p>
            ))}
        </>
    )}
      </div>  
    </div>
  );
};
export default FriendChart;