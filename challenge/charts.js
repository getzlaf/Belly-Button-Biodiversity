function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data)
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(bacteriaInfo => bacteriaInfo.id == sample)
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the metadata array
    var metaResult = metadataArray[0];
    //  5. Create a variable that holds the first sample in the array.
    var filteredSample = filteredSamples [0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sample_values = filteredSample.sample_values
    var otu_ids = filteredSample.otu_ids
    var otu_labels = filteredSample.otu_labels

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse()

    // 8. Create the trace for the bar chart. 
    var barData = [
            {
              y: yticks,
              x: sample_values.slice(0,10).reverse(),
              text: otu_labels.slice(0,10).reverse(), 
              type: 'bar',
              orientation: 'h'
            },
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 OTU',
      showlegend: false,
      xaxis: {
          title: "Sample Value",
      },
      yaxis: {
          title: "OTU ID"
      },
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout)
  
 // 1. Create the trace for the bubble chart.
    var bubbleData =[
          {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
              color: otu_ids,
              size: sample_values,
            }
          }

        ]; 


    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      showlegend: false,
      xaxis: {
        title: "OTU ID"
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 
    
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var washingFreq = parseInt(metaResult.wfreq);
    
    // 4. Create the trace for the gauge chart.
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washingFreq,
        title: { text: "Washing Frequency (Times per Week)" },
        type: "indicator",
        mode: "gauge+number"
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {  width: 600, height: 500, margin: { t: 0, b: 0 } 
                
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', data, gaugeLayout);
  })
}
