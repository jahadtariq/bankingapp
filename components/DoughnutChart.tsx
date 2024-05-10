'use client';

// the following components are not required but helps in additional formatting of chart which makes it beautiful

/*

When optimizing the bundle, you need to import and register the components that are needed in your application.

The options are categorized into controllers, elements, plugins, scales. You can pick and choose many of these, e.g. if you are not going to use tooltips, don't import and register the Tooltip plugin.

*/
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
ChartJS.register(ArcElement,Tooltip,Legend);

//the basic component we need to use
import { Doughnut } from "react-chartjs-2";


const DoughnutChart = (
    {accounts}: DoughnutChartProps
) => {

    /* Now we need to format the data for our doughnut chart componet the documnetation link is https://www.chartjs.org/docs/latest/general/data-structures.html */

    const data = {
        // first item is datasets
        datasets: [
            {
                label: "Amount", //what the data is e.g number of cars or in our case its the amount in account
                data: [1250,2500,3750], //the data
                backgroundColor: ["#0747b6", '#2265d8', "#2f91fa"] //assigning each data a different color the assignment is same as the order for instance 1250 will have color of 0747b6 and so on.
            }
        ],
        //second item is the label to data for what the data is about
        // the label in dataset is for the data type
        // these labels are the label to what the data refers
        // for example the label amount tells that the data is amount and is displayed with all elements in data arrya like amount:1250
        // and the labels are displayed at top specifying which data refers to what like the data 1250 in 0747b6 color is the amount in habib bank
        labels: [ "Habib Bank", "Alfalah Bank", "Meezan Bank"]
    }

  return <Doughnut 
    data={data} // the data that chart will use
    options = { //chart configurations and customizations more in documentation
        {
            cutout: '60%', // the gap between cuts
            plugins: {
                legend: { // the header above chart that defines color to labels
                    display: false
                }
            }
        }
    }
  />
}

export default DoughnutChart;