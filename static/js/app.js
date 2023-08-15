const url = "samples.json"


function init() {

  // Use D3 to select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");

  d3.json(url).then((data) => {

      let names = data.names;

      // dropdown menu
      names.forEach((id) => {

          dropdownMenu.append("option")
          .text(id)
          .property("value",id);
      });

      let sample_one = names[0];


      //creating initial plots
      buildMetadata(sample_one);
      buildBarChart(sample_one);
      buildBubbleChart(sample_one);

  });
};

// Function that populates sample metadata info
function buildMetadata(sample) {

  d3.json(url).then((data) => {

      let metadata = data.metadata;

      // Filter based on the value of the sample
      let value = metadata.filter(result => result.id == sample);
      let valueData = value[0];

      // Clear out metadata
      d3.select("#sample-metadata").html("");

      // Use Object.entries to add each key/value pair to the panel
      Object.entries(valueData).forEach(([key,value]) => {

          d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });
  });

};

// Function that builds the bar chart
function buildBarChart(sample) {

  d3.json(url).then((data) => {

      let sampleInfo = data.samples;

      // Filter based on the value of the sample
      let value = sampleInfo.filter(result => result.id == sample);

      let valueData = value[0];

      // Get the otu_ids, lables, and sample values
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;

      // Set top ten items to display in descending order
      let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
      let xticks = sample_values.slice(0,10).reverse();
      let labels = otu_labels.slice(0,10).reverse();

      let trace = {
          x: xticks,
          y: yticks,
          text: labels,
          type: "bar",
          orientation: "h"
      };

      let layout = {
          title: "Top 10 OTUs"
      };

      Plotly.newPlot("bar", [trace], layout)
  });
};

// Function that builds the bubble chart
function buildBubbleChart(sample) {

  d3.json(url).then((data) => {

      let sampleInfo = data.samples;

      // Filter based on the value of the sample
      let value = sampleInfo.filter(result => result.id == sample);

      let valueData = value[0];

      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;
      
      // Set up the trace for bubble chart
      let trace1 = {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Earth"
          }
      };

      let layout = {
          title: "Bacteria Per Sample",
          hovermode: "closest",
          xaxis: {title: "OTU ID"},
      };
      Plotly.newPlot("bubble", [trace1], layout)
  });
};

//updates dashboard when dropdown option is changed
function optionChanged(value) { 

  buildMetadata(value);
  buildBarChart(value);
  buildBubbleChart(value);
  buildGaugeChart(value);
};

init();