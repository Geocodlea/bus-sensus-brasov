import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const DataChart = ({ report, busNumber, route, station }) => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(
      report.filter((item) => {
        return (
          item.busId === busNumber &&
          item.routeId === route &&
          item.stationId === station
        );
      })
    );
  }, [report, busNumber, route, station]);

  useEffect(() => {
    // Group the data by the hour
    const hourlyData = data.reduce((acc, obj) => {
      const date = new Date(obj.dateTime);
      const hour = date.getHours();

      if (!acc[hour]) {
        acc[hour] = { noOfPassengers: obj.noOfPassengers, count: 1 };
      } else {
        acc[hour].noOfPassengers += obj.noOfPassengers;
        acc[hour].count += 1;
      }

      return acc;
    }, {});

    // Calculate the average noOfPassengers for each hour
    const hourlyAverages = Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const { noOfPassengers, count } = hourlyData[hour] || {
        noOfPassengers: 0,
        count: 0,
      };
      return count === 0 ? 0 : Math.round(noOfPassengers / count);
    });

    // Create the chart
    const chart = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}`),
        datasets: [
          {
            label: "Average No. of Passengers",
            data: hourlyAverages,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Hour of the Day",
            },
          },
          y: {
            title: {
              display: true,
              text: "Average No. of Passengers",
            },
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default DataChart;
