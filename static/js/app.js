const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(url).then(function(data) {
    console.log(data);
  });

  // Fetch the data
  d3.json(url).then(data => {
    const names = data.names;
    const samples = data.samples;
    
    // Populate the dropdown menu with names
    const dropdown = d3.select("#selDataset");
    names.forEach(name => {
      dropdown.append("option")
        .text(name)
        .property("value", name);
    });
    
    // Function to update the chart based on selected name
    function updateChart(selectedName) {
      const selectedSample = samples.find(sample => sample.id === selectedName);
      const top10SampleValues = selectedSample.sample_values.slice(0, 10).reverse();
      const top10OTUIds = selectedSample.otu_ids.slice(0, 10).reverse();
      const top10OTULabels = selectedSample.otu_labels.slice(0, 10).reverse();
      
      // Create the horizontal bar chart
      const trace = {
        type: "bar",
        orientation: "h",
        x: top10SampleValues,
        y: top10OTUIds.map(id => `OTU ${id}`),
        text: top10OTULabels
      };
      
      const layout = {
        title: `Top 10 OTUs for ${selectedName}`,
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
      };
      
      Plotly.newPlot("barChart", [trace], layout);
    }
    
    // Initial chart update
    updateChart(names[0]);
    
    // Event listener for dropdown change
    dropdown.on("change", function() {
      const selectedName = this.value;
      updateChart(selectedName);
    });
  });