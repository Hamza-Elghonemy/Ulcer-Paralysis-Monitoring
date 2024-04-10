import React, { useState, useEffect } from 'react';
import 
{ BsGraphDown, BsGraphUp, BsDropletHalf, BsThermometerHigh}
 from 'react-icons/bs'
 import 
 { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line , AreaChart , Area} 
 from 'recharts';
 import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from './Header';
import Sidebar from './Sidebar';
const apiUrl = 'http://localhost:3000/api/arduino';

function Home() {

  let [arduino_data, setarduino_data] = useState([{
    name:'page',
    x: 0,
    y: 0,
    humidity: 0,
    temperature: 0,
    fehrenhight: 0,
    heatindex: 0,
    buttonpressed: 0,
   }]);

  const fetchData = () => {
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // console.log('Arduino Data:', data.data);
        const newData = {
          name: 'page',
          x: parseInt(data.data[0]),
          y: parseInt(data.data[1]),
          humidity: parseInt(data.data[2]),
          temperature: parseInt(data.data[3]),
          fehrenhight: parseInt(data.data[4]),
          heatindex: parseInt(data.data[5]),
          buttonpressed: parseInt(data.data[6]),
      };

        setarduino_data(prevData => [...prevData, newData]);
        console.log(arduino_data)  
      })
      
      .catch(error => {
        console.error('Error fetching Arduino data:', error);
        // Handle the error here
  
      });
      
  };
  
  // const intervalId = setInterval(fetchData, 2000);
  useEffect(() => {
    fetchData(); // Initial data fetch

    const intervalId = setInterval(fetchData, 2000); // Fetch data every 2 seconds

    return () => clearInterval(intervalId); // Cleanup function to clear interval
}, []);

const notify = () => {
  // Check if the temperature exceeds a certain threshold
  const temperatureThreshold = 26; // Example threshold

  // Assuming you want to check the temperature of the latest data point
  const latestTemperature = arduino_data[arduino_data.length - 1].temperature;

  if (latestTemperature > temperatureThreshold) {
      // Trigger warning if temperature exceeds threshold
      toast.error("Danger: Temperature exceeds threshold!", { autoClose: 10000, position: 'bottom-right', });
  }
  if(arduino_data[arduino_data.length - 1].buttonpressed==1){
    toast("The patient needs aid, please check up on them."),{
      position: 'bottom-left',
      autoClose: 10000,
      className: "foo-bar",
      
    };
  }
  if (arduino_data[arduino_data.length - 1].buttonpressed == 2) {
    toast("The patient is asking for food, please provide them with a meal."), {
      position: 'bottom-left',
      autoClose: 10000,
      className: "foo-bar",

    };
  }
  if (arduino_data[arduino_data.length - 1].buttonpressed == 3) {
    toast("The patient is in need of help to go to the bathroom."), {
      position: 'bottom-left',
      autoClose: 10000,
      className: "foo-bar",

    };
  }
    if (arduino_data[arduino_data.length - 1].buttonpressed == 4) {
      toast("The patient is in need of emotional support."), {
        position: 'bottom-left',
        autoClose: 10000,
        className: "foo-bar",

      };
  }
};

// Call notify function whenever arduinoData updates
useEffect(() => {
  notify();
}, [arduino_data]);
  
  const CustomizedDot = (props) => {
    const { cx, cy, stroke, payload, value } = props;
  
    if (value > 22) {
      return (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="green" viewBox="0 0 1024 1024">
          <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
        </svg>
      );
    }
  
    // return (
    //   <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="red" viewBox="0 0 1024 1024">
    //     <path d="M517.12 53.248q95.232 0 179.2 36.352t145.92 98.304 98.304 145.92 36.352 179.2-36.352 179.2-98.304 145.92-145.92 98.304-179.2 36.352-179.2-36.352-145.92-98.304-98.304-145.92-36.352-179.2 36.352-179.2 98.304-145.92 145.92-98.304 179.2-36.352zM663.552 261.12q-15.36 0-28.16 6.656t-23.04 18.432-15.872 27.648-5.632 33.28q0 35.84 21.504 61.44t51.2 25.6 51.2-25.6 21.504-61.44q0-17.408-5.632-33.28t-15.872-27.648-23.04-18.432-28.16-6.656zM373.76 261.12q-29.696 0-50.688 25.088t-20.992 60.928 20.992 61.44 50.688 25.6 50.176-25.6 20.48-61.44-20.48-60.928-50.176-25.088zM520.192 602.112q-51.2 0-97.28 9.728t-82.944 27.648-62.464 41.472-35.84 51.2q-1.024 1.024-1.024 2.048-1.024 3.072-1.024 8.704t2.56 11.776 7.168 11.264 12.8 6.144q25.6-27.648 62.464-50.176 31.744-19.456 79.36-35.328t114.176-15.872q67.584 0 116.736 15.872t81.92 35.328q37.888 22.528 63.488 50.176 17.408-5.12 19.968-18.944t0.512-18.944-3.072-7.168-1.024-3.072q-26.624-55.296-100.352-88.576t-176.128-33.28z" />
    //   </svg>
    // );
  };
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <>
    
    <Header OpenSidebar={OpenSidebar}/>
    <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
    <main className='main-container'>
        <ToastContainer />
        <div className='main-title'>
            <h3> Dr.Neven Dashboard</h3>
        </div>

        <div className='main-cards'>
            <div className='card'>
                <div className='card-inner'>
                    <h3>X-Coordinate</h3>
                    <BsGraphDown className='card_icon'/>
                </div>
        <h1>{arduino_data[arduino_data.length - 1].x}</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Y-Coordinate</h3>
                    <BsGraphUp className='card_icon'/>
                </div>

        <h1>{arduino_data[arduino_data.length - 1].y}</h1>

            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Humidity</h3>
                    <BsDropletHalf className='card_icon'/>
                </div>

        <h1>{arduino_data[arduino_data.length - 1].humidity}</h1>

            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Temperature</h3>
                    <BsThermometerHigh className='card_icon'/>
                </div>

        <h1>{arduino_data[arduino_data.length - 1].temperature}</h1>

            </div>
        </div>

        <div className='charts'>
            
            <ResponsiveContainer width="100%" height="100%">
            <LineChart
          width={500}
          height={300}
          data={arduino_data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="heatindex" stroke="#8884d8"  />
          {/* //<Line type="monotone" dataKey="amt" stroke="#82ca9d" /> */}
        </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
            <AreaChart width={730} height={250} data={arduino_data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="temperature" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)"  />
                <Area type="monotone" dataKey="humidity" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
            </AreaChart>
            </ResponsiveContainer>

        </div>
    </main>
    </>
  )
}

export default Home;