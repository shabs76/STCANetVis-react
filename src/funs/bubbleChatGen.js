import * as d3 from 'd3-v6';
import _ from 'lodash';

export const bubbleChat = (dataz = []) => {
    if (!_.isArray(dataz)) {
        return
    }
    // create datasets "proxy":"http://localhost:8000",
    const datasets = []
    for (let index = 0; index < dataz.length; index++) {
        if (!_.isEmpty(dataz[index].bubble)) {
            datasets.push(dataz[index].bubble)
        }   
    }
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const maxXValue = d3.max(datasets, d => d.time);
    // datasets = [
    //     { name: "Medi_sea", color: "blue", scalabilityInteraction: 0.185, scalabilityVisualization: 0.556, rows: 12000 },
    //     { name: "Mooloolaba", color: "yellow", scalabilityInteraction: 0.185, scalabilityVisualization: 0.556 , rows: 32000 },
    //     { name: "East Atlantic", color: "orange", scalabilityInteraction: 0.185, scalabilityVisualization: 0.556, rows: 42000  },
    //     { name: "Weipa", color: "gray", scalabilityInteraction: 0.185, scalabilityVisualization: 0.556, rows: 22000  },
    //     { name: "Bowen", color: "brown", scalabilityInteraction: 0.185, scalabilityVisualization: 0.556, rows: 52000  },
    //     { name: "Urangan Tide", color: "green", scalabilityInteraction: 0.185, scalabilityVisualization: 0.556, rows: 62000  },
    //     { name: "Karumba", color: "pink", scalabilityInteraction: 0.185, scalabilityVisualization: 0.556, rows: 82000  },
    //     { name: "Southport", color: "purple", scalabilityInteraction: 0.185, scalabilityVisualization: 0.556, rows: 120000  }
    //   ];
      // clear old data
      const svgWidth = d3.select(".PlotHolderNetworkPlotGra").node().clientWidth;
      d3.select(".PlotHolderNetworkPlotGra").selectAll("*").remove();
      d3.select(".PlotHolderNetworkPlotGra").html('<div className="tooltipNetwork"></div>');
      /* SVG frame creation */
      const w = svgWidth,
      h = svgWidth*0.53;
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
        .domain([0, 1]) // Range of scalability values
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
        .text("Time");

        // Add Y axis label
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text("Scalability of Visualization");
  
      // Add bubbles for each dataset
      svg.selectAll("circle")
        .data(datasets)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.time)) // Randomize X position for now
        .attr("cy", d => yScale(d.scalabilityVisualization))
        .attr("r", d => radiusCal(d.rows))
        .attr("fill", (d, i) => colorScale(i))
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
        return 20
    } else if (rows < 20000) {
        return 30
    } else if (rows < 50000) {
        return 45
    } else if (rows < 70000) {
        return 55
    } else if (rows < 85000) {
        return 65
    } else if (rows < 90000) {
        return 70
    } else if (rows > 90000) {
        return 75
    } else {
        return 35
    }
} 