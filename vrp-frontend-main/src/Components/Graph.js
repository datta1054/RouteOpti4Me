import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useSelector } from "react-redux";
import { generateColor, darken } from '../utils/color';

const Graph = () => {
  const [data, setData] = useState();
  const [isReady, setReady] = useState(false);

  const solutionData = useSelector((state) => state?.solution?.solutionData);
  const demandTypes = useSelector((state) => state?.solution?.demandType);
  console.log("Demand types --->",demandTypes)
  console.log("Nodes data --->",solutionData.nodeData)

  useEffect(() => {
    createGraph();
  }, [demandTypes]);

  const createGraph = () => {
    if (solutionData != null) {
      setReady(true);
      let data = [];
      let Xaxis = [];
      let Yaxis = [];
      let Other = [];
      let Priority = []
      for (const [index, value] of solutionData.solution.entries()) {

        console.log("Tour =>", value.tour);
        for (const ele of value.tour) {
          Xaxis.push(solutionData.nodeData[ele - 1].latitude);
          Yaxis.push(solutionData.nodeData[ele - 1].longitude);
          let Items = {};
          for (const info of demandTypes){
            if (info.node === ele) {
              Items = info.items.reduce((obj, key, index) => {
                obj[key] = info.quantity[index];
                return obj;
              }, {});
            }
          }
          Other.push(
            solutionData.nodeData[ele - 1].demand +
              "<br><b>Node: </b>" +
              solutionData.nodeData[ele - 1].node +
              "<br><b>Priority: </b>" +
              solutionData.nodeData[ele - 1].priority +
              "<br><b>Items: </b>" +
              JSON.stringify(Items)
          );
          Priority.push(solutionData.nodeData[ele - 1].priority)
        }
        console.log(solutionData);

        Xaxis.push(solutionData.nodeData[0].latitude);
        Yaxis.push(solutionData.nodeData[0].longitude);
        Other.push(solutionData.nodeData[0].demand);
        Priority.push(solutionData.nodeData[0].priority);
        
        data.push({
          type: "scatter",
          mode: "lines+markers",
          x: Xaxis,
          y: Yaxis,
          text: Other,
          marker: {
            symbol: "arrow",
            size: 15,
            angleref: "previous",
            standoff: 5,
          },
          line: {
            color: darken(generateColor(index+1)),
          },
          name: `Tour ${index + 1}`,
          showlegend: true,
          hoverinfo: "skip",
        });
        data.push({
          type: "scatter",
          mode: "markers",
          x: Xaxis,
          y: Yaxis,
          name: `Tour ${index + 1}`,
          text: Other,
          marker: {
            symbol: "circle",
            size: 10,
            color: Priority.map((p)=>{
              return p===2 ?
              "#0883ff" : p===1 ?
              "#00cc96" : "#ef553b"
            }),
            line: {
              width: 1,
              color: "black",
            },
          },
          showlegend: false,
          hovertemplate: `<b>Latitude</b>: %{x}<br><b>Longitude</b>: %{y}<br><b>Demand</b>:%{text}`,
        });

        Xaxis = [];
        Yaxis = [];
        Other = [];
        Priority = [];
      }
      data.push({
        type: "scatter",
        mode: "markers",
        x: [solutionData.nodeData[0].latitude],
        y: [solutionData.nodeData[0].longitude],
        text: [solutionData.nodeData[solutionData.depotNode-1].demand.toString()],
        marker: {
          symbol: "circle",
          size: 15,
          color: "crimson",
          line: {
            width: 1,
            color: "black",
          },
        },
        showlegend: false,
        hovertemplate: `<b>Latitude</b>: %{x}<br><b>Longitude</b>: %{y}<br><b>Demand</b>:%{text}`,
      });

      setData(data);
    }
  };

  return (
    <>
      {data ? (
        <Plot
          data={data}
          layout={{ width: 950, height: 750, title: "Routing" }}
          config={{ responsive: true }}
        />
      ) : null}
    </>
  );
};

export default Graph;
