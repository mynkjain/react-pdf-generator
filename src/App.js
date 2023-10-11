import "./App.css";
import { useEffect, useState, useRef } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import jsPDF from "jspdf";
import { FiPrinter } from "react-icons/fi";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip
);

function App() {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  const generatePDF = () => {
    const canvas = chartRef.current.canvas;
    const chartDataUrl = canvas.toDataURL("image/png");

    const doc = new jsPDF();
    doc.addImage(chartDataUrl, "PNG", 10, 10, 190, 90);
    doc.save("chart.pdf");
  };

  const fetchArrestData = async () => {
    const response = await fetch(API);
    const { data } = await response.json();
    setChartData({
      labels: Array.isArray(data) ? data.map((item) => item?.data_year) : [],
      datasets: [
        {
          label: "Arrests",
          data: Array.isArray(data) ? data.map((item) => item["Burglary"]) : [],
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    });
  };

  useEffect(() => {
    fetchArrestData();
  }, []);
  return (
    <>
      <div className="button-container">
        <button onClick={generatePDF}>
          {" "}
          <FiPrinter /> Generate PDF
        </button>
      </div>
      <div style={{ transform: "translate(-10000%)", position: "absolute" }}>
        {chartData && (
          <Chart
            ref={chartRef}
            type="line"
            data={chartData}
            options={OPTIONS}
          />
        )}
      </div>
    </>
  );
}

const OPTIONS = {
  scales: {
    x: {
      title: {
        display: true,
        text: "Year",
      },
    },
    y: {
      title: {
        display: true,
        text: "Arrests (Burglary)",
      },
    },
  },
};

const API =
  "https://api.usa.gov/crime/fbi/cde/arrest/state/AK/all?from=2015&to=2020&API_KEY=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv";

export default App;
