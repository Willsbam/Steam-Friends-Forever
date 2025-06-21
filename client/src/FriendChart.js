import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";
import "./pie.css";

const FriendChart = () => {
  const chartRef = useRef(null);
    const data = [
    { 
      name: "Genre 1", 
      value: 30, 
      color: "#00BBFF",
      friends:[
        {"id":7656119828,"username":"Jeff", "imgURL":"https://cdn.fastly.steamstatic.com/steamcommunity/public/images/items/253230/e73f44b5881634c4fd944275cddff6515cb1cb1d.gif"},
        {"id":7656119829,"username":"Tom"}
      ]
    },
    { 
      name: "Genre 2", 
      value: 25, 
      color: "#E35E1C",
      friends:[
        {"id":7656119828,"username":"Jeff"},
        {"id":7656119829,"username":"Tom"}
      ]
    },
    { 
      name: "Genre 3", 
      value: 20, 
      color: "#417a9b",
      friends:[
        {"id":7656119828,"username":"Jeff"},
        {"id":7656119829,"username":"Tom"}
      ]
    },
    { 
      name: "Team E", 
      value: 10, 
      color: "#FFC82C",
      friends:[
        {"id":7656119828,"username":"Jeff"},
        {"id":7656119829,"username":"Tom"}
      ]
    }
  ];

  useEffect(() => {
    d3.select(chartRef.current).selectAll("*").remove();
    createPieChart();
  }, []);

  function createPieChart() {
    const width = 700;
    const height = 700;
    const radius = (Math.min(width, height) / 2)*0.8;
    
    const pie = d3.pie()
      .sort(null)
      .value(d => d.value);

    const innerRadius=0;

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const arcs = pie(data);




    // Create SVG container
    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    let defs = svg.append("defs");


    // Add pie segments
    svg.append("g")
      .attr("stroke", "white")
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", d => d.data.color)
      .attr("d", arc);

    
      populatePieChart(svg,arcs,radius,defs);




   
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
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        const x = Math.cos(midAngle) * (radius * 0.85);
        const y = Math.sin(midAngle) * (radius * 0.85);
        return `translate(${x},${y})`;
      })
      .attr("class", "pie-label")
      .text(d => d.data.name);

   
  }

  function populatePieChart(svg,arcs,radius,defs)
  {
    arcs.forEach((d, i) => {


     const angleSpan = d.endAngle - d.startAngle;
    const allFriends = [];

    const reservedArcLength=4;

    d.data.friends.forEach(friend =>{
      allFriends.push(friend)
    });

    let count=0;
    let circlesForLayer=0;
    let centerOffset=30;
    let previousLayers=0;
    const circleRadius=20;
    let previousCoords=[];

    allFriends.forEach((friend) =>
    {
      let x=-1;
      let y=-1;
      let nearbyCircle=true;
      while(nearbyCircle===true)
        {
        let centerOffset=Math.random()*(radius-40)+30
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
              console.log("Found circle");
              break;
          }

        }
        if(nearbyCircle===false)
          {
              previousCoords.push([x,y]);
          }
        }
    
      
      count=count+1;
      
    // Create a group for this icon

   const patternId = `friend-image-${count}`;
      
      // Add pattern to defs
      if(friend.imgURL) {
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
            .attr("xlink:href", friend.imgURL)
            .attr("preserveAspectRatio", "xMidYMid slice");
      }
    
      const iconGroup = svg.append("g")
        .attr("class", "icon-group")
        .attr("transform", `translate(${-x}, ${-y})`);



    iconGroup.append("circle")
        .attr("r", circleRadius)
        .attr("fill", friend.imgURL ? `url(#${patternId})` : "white") // Reference the pattern by ID
        .attr("stroke", "#333")
        .attr("stroke-width", 1.5)
        .attr("class", "icon-bg")
        .on("click", () => console.log(`Clicked on ${friend.name} for ${d.data.name}`));
      
  
    });
  });
  }


  return (
    <div className="pie-chart-container">
      <div ref={chartRef} className="chart-area"></div>
    </div>
  );
};

export default FriendChart;