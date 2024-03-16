import * as d3 from 'd3-v6';
import _ from 'lodash';

export const bubbleChat = (dataz = [], data2 = []) => {
    if (!_.isArray(dataz)) {
        return
    }
    // create datasets "proxy":"http://localhost:8000",
    // const datasets = []
    const datasets = [
        

    ];
    for (let index = 0; index < dataz.length; index++) {
        if (!_.isEmpty(dataz[index].bubble)) {
            // datasets.push(dataz[index].bubble)
        }   
    }

    for (let idc = 0; idc < data2.length; idc++) {
        datasets.push(data2[idc])
    }
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const maxXValue = d3.max(datasets, d => d.time);
    
      // clear old data
      const svgWidth = d3.select(".PlotHolderNetworkPlotGra").node().clientWidth;
      d3.select(".PlotHolderNetworkPlotGra").selectAll("*").remove();
      d3.select(".PlotHolderNetworkPlotGra").html('<div className="tooltipNetwork"></div>');
      /* SVG frame creation */
      const w = svgWidth,
      h = svgWidth*0.6;
      // Dimensions and margins for the SVG
      const margin = { top: 55, right: 20, bottom: 50, left: 50 };
      const width = w - margin.left - margin.right;
      const height = h - margin.top - margin.bottom;
      
      // Create SVG
      const svg = d3.select(".PlotHolderNetworkPlotGra").append("svg:svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
      // X scale for time
      const xScale = d3.scaleLinear()
        .domain([0, maxXValue + 20]) // Range of time
        .range([0, width]);
  
      // Y scale for scalability values
      const yScale = d3.scaleLinear()
        .domain([0, 2]) // Range of scalability values
        .range([height, 0]);
  
      // Add X axis
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));
  
      // Add Y axis
      svg.append("g")
        .call(d3.axisLeft(yScale));

        // Add X axis label
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.top - 18)
        .attr("text-anchor", "middle")
        .attr("font-size", 13)
        .text("Time (Seconds)");

        // Add Y axis label
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .attr("font-size", 13)
        .attr("text-anchor", "middle")
        .text("Scalability of Visualization and Interactions");
  
      // Add bubbles for each dataset
      svg.selectAll("ellipse")
        .data(datasets)
        .enter()
        .append("ellipse")
        .attr("cx", d => xScale(d.time)) // Randomize X position for now
        .attr("cy", d => yScale(d.scalabilityInteraction))
        .attr("rx", d => radiusCal(d.rows))
        .attr("ry", d => radiusCal(d.rows*0.1))
        .attr("stroke", "#333333")
        .attr("fill", (d, i) => typeof (d.color) == "string" ? d.color : colorScale(i))
        .attr("opacity", 0.75)
        .on("mouseover", function(event, d) {
          // Add tooltip showing dataset name and scalability values
            const tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("display", "none");

            // Tooltip background
            tooltip.append("rect")
            .attr("x", -60)
            .attr("y", -85)
            .attr("width", 180) // Adjust the width as needed
            .attr("height", 70) // Adjust the height as needed
            .attr("fill", "white")
            .attr("stroke", "whitesmoke")
            .attr("stroke-width", 1)
            .attr("rx", 7) // Border radius
            .attr("ry", 7);
            // name of the dataset
            tooltip.append("text")
            .attr("x", -55)
            .attr("y", -70)
            .attr("font-size", 14)
            .attr("font-weight", "bold")
            .text(`${d.name}`);

            tooltip.append("text")
            .attr("x", -55)
            .attr("y", -47)
            .attr("font-size", 14)
            .text(`Visualization:${d.scalabilityVisualization}`);

            tooltip.append("text")
            .attr("x", -55)
            .attr("y", -28)
            .attr("font-size", 14)
            .text(`Interaction: ${d.scalabilityInteraction}`);
  
          tooltip.style("display", "block")
            .attr("transform", `translate(${d3.select(this).attr("cx")}, ${yScale(d.scalabilityVisualization)})`);
        })
        .on("mouseout", function(event, d) {
          // Remove tooltip on mouseout
          d3.select(".tooltip").remove();
        });
}


const radiusCal = (rows) => {
    if (rows < 10000) {
        return 10
    } else if (rows < 20000) {
        return 16
    } else if (rows < 30000) {
        return 20
    } else if (rows < 70000) {
        return 27
    } else if (rows < 85000) {
        return 35
    } else if (rows < 90000) {
        return 40
    } else if (rows > 90000) {
        return 50
    } else {
        return 18
    }
} 