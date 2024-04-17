import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [sensorData, setSensorData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/sensor_data')
            .then(response => {
                setSensorData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);

    const renderCandles = () => {
        const candles = [];
        const timestamps = [];
        let lastTimestampHour = -1;
        let numOnes = 0;
        let numZeros = 0;
        let continuousOnes = 0;
        let continuousZeros = 0;
        let maxContinuousOnes = 0;
        let maxContinuousZeros = 0;

        for (let i = 0; i < sensorData.length; i++) {
            const data = sensorData[i];
            const nextData = sensorData[i + 1];
            const backgroundColor = data.machine_status === 0 ? 'yellow' : (data.machine_status === 1 ? 'green' : 'red');
            candles.push(
                <div
                    key={data.id}
                    style={{
                        width: '1px',
                        height: '50px',
                        backgroundColor: backgroundColor,
                        marginRight: '0px',
                    }}
                />
            );
            if (!nextData || new Date(nextData.timestamp).getTime() - new Date(data.timestamp).getTime() !== 1000) {
                candles.push(
                    <div
                        key={`missing-${data.id}`}
                        style={{
                            width: '1px',
                            height: '50px',
                            backgroundColor: 'red',
                            marginRight: '0px',
                        }}
                    />
                );
            }
            const timestampHour = new Date(data.timestamp).getHours();
            if (timestampHour !== lastTimestampHour) {
                timestamps.push(
                    <div
                        key={`timestamp-${data.id}`}
                        style={{ textAlign: 'center', width: '1px', marginRight: '0px' }}
                    >
                        {timestampHour}:00
                    </div>
                );
                lastTimestampHour = timestampHour;
            } else {
                timestamps.push(
                    <div
                        key={`timestamp-${data.id}`}
                        style={{ width: '1px', marginRight: '0px' }}
                    />
                );
            }

            // Update summary values
            if (data.machine_status === 1) {
                numOnes++;
                continuousOnes++;
                maxContinuousOnes = Math.max(maxContinuousOnes, continuousOnes);
                continuousZeros = 0;
            } else if (data.machine_status === 0) {
                numZeros++;
                continuousZeros++;
                maxContinuousZeros = Math.max(maxContinuousZeros, continuousZeros);
                continuousOnes = 0;
            }
        }

        return { candles, timestamps, numOnes, numZeros, maxContinuousOnes, maxContinuousZeros };
    };

    const { candles, timestamps, numOnes, numZeros, maxContinuousOnes, maxContinuousZeros } = renderCandles();

    return (
        <div>
            <h4>Cycle Status</h4>
            <div style={{ display: 'flex', width: '100%', overflowX: 'hidden' }}>
                {candles}
            </div>
            <div style={{ borderTop: '1px solid black' }} />
            <div style={{ display: 'flex', width: '100%', overflowX: 'hidden' }}>
                {timestamps}
            </div>
            <br />
            <hr style={{ height: '5px', backgroundColor: 'dark' }} />

            <h3>Summary Table</h3>
            <table className="table table-bordered table-striped" style={{ backgroundColor: '#f8f9fa', color: '#212529' }}>
            <thead className="thead-dark">
                <tr>
                    <th>Summary</th>
                    <th>Count</th>
                    <th>Max Continuous</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Number of 1s</td>
                    <td>{numOnes}</td>
                    <td>{maxContinuousOnes}</td>
                </tr>
                <tr>
                    <td>Number of 0s</td>
                    <td>{numZeros}</td>
                    <td>{maxContinuousZeros}</td>
                </tr>
            </tbody>
        </table>

        </div>
    );
};

export default App;







// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const App = () => {
//     const [sensorData, setSensorData] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:3001/sensor_data')
//             .then(response => {
//                 setSensorData(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching data: ', error);
//             });
//     }, []);

//     const renderCandles = () => {
//         const candles = [];
//         const timestamps = [];
//         let lastTimestampHour = -1;
//         console.log(sensorData.length)
//         for (let i = 0; i < sensorData.length; i++) {
          
//             const data = sensorData[i];
//             const nextData = sensorData[i + 1];
//             const backgroundColor = data.machine_status === 0 ? 'yellow' : (data.machine_status === 1 ? 'green' : 'red');
//             candles.push(
//                 <div
//                     key={data.id}
//                     style={{
//                         width: '1px',
//                         height: '50px',
//                         backgroundColor: backgroundColor,
//                         marginRight: '0px',
//                     }}
//                 />
//             );
//             if (!nextData || new Date(nextData.timestamp).getTime() - new Date(data.timestamp).getTime() !== 1000) {
//                 candles.push(
//                     <div
//                         key={`missing-${data.id}`}
//                         style={{
//                             width: '1px',
//                             height: '50px',
//                             backgroundColor: 'red',
//                             marginRight: '0px',
//                         }}
//                     />
//                 );
//             }
//             const timestampHour = new Date(data.timestamp).getHours();
//             if (timestampHour !== lastTimestampHour) {
//                 timestamps.push(
//                     <div
//                         key={`timestamp-${data.id}`}
//                         style={{ textAlign: 'center', width: '1px', marginRight: '0px' }}
//                     >
//                         {timestampHour}:00
//                     </div>
//                 );
//                 lastTimestampHour = timestampHour;
//             } else {
//                 timestamps.push(
//                     <div
//                         key={`timestamp-${data.id}`}
//                         style={{ width: '1px', marginRight: '0px' }}
//                     />
//                 );
//             }
//         }
//         return { candles, timestamps };
//     };

//     const { candles, timestamps } = renderCandles();

//     return (
//         <div>
//          <br /><br /><br />
//             <div style={{ display: 'flex', width: '100%', overflowX: 'hidden' }}>
//                 {candles}
//             </div>
//             <div style={{ borderTop: '1px solid black' }} />
//             <div style={{ display: 'flex', width: '100%', overflowX: 'hidden' }}>
//                 {timestamps}
//             </div>
//         </div>
//     );
// };

// export default App;





// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const App = () => {
//     const [sensorData, setSensorData] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:3001/sensor_data')
//             .then(response => {
//                 setSensorData(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching data: ', error);
//             });
//     }, []);

//     const renderCandles = () => {
//         const candles = [];
//         for (let i = 0; i < sensorData.length; i++) {
//             const data = sensorData[i];
//             const nextData = sensorData[i + 1];
//             const backgroundColor = data.machine_status === 0 ? 'yellow' : (data.machine_status === 1 ? 'green' : 'red');
//             candles.push(
//                 <div
//                     key={data.id}
//                     style={{
//                         width: '1px',
//                         height: '10px',
//                         backgroundColor: backgroundColor,
//                         marginRight: '0px',
//                     }}
//                 />
//             );
//             if (!nextData || new Date(nextData.timestamp).getTime() - new Date(data.timestamp).getTime() !== 1000) {
//                 candles.push(
//                     <div
//                         key={`missing-${data.id}`}
//                         style={{
//                             width: '1px',
//                             height: '10px',
//                             backgroundColor: 'red',
//                             marginRight: '0px',
//                         }}
//                     />
//                 );
//             }
//         }
//         return candles;
//     };

//     return (
//         <div>
//             <div style={{ display: 'flex', width: '100%', overflowX: 'hidden' }}>
//                 {renderCandles()}
//             </div>
//             <div style={{ borderTop: '1px solid black' }} />
//         </div>
//     );
// };

// export default App;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const App = () => {
//     const [sensorData, setSensorData] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:3001/sensor_data')
//             .then(response => {
//                 setSensorData(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching data: ', error);
//             });
//     }, []);

//     const renderCandles = () => {
//         const candles = [];
//         for (let i = 0; i < sensorData.length; i++) {
//             const data = sensorData[i];
//             const nextData = sensorData[i + 1];
//             const backgroundColor = data.machine_status === 0 ? 'yellow' : (data.machine_status === 1 ? 'green' : 'red');
//             candles.push(
//                 <div
//                     key={data.id}
//                     style={{
//                         width: '1px',
//                         height: '10px',
//                         backgroundColor: backgroundColor,
//                         marginRight: '0px',
//                     }}
//                 />
//             );
//             if (!nextData || new Date(nextData.timestamp).getTime() - new Date(data.timestamp).getTime() !== 1000) {
//                 candles.push(
//                     <div
//                         key={`missing-${data.id}`}
//                         style={{
//                             width: '1px',
//                             height: '10px',
//                             backgroundColor: 'red',
//                             marginRight: '0px',
//                         }}
//                     />
//                 );
//             }
//         }
//         return candles;
//     };

//     return (
//         <div style={{ display: 'flex', width: '100%', overflowX: 'hidden' }}>
//             {renderCandles()}
//         </div>
//     );
// };

// export default App;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const App = () => {
//     const [sensorData, setSensorData] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:3001/sensor_data')
//             .then(response => {
//                 setSensorData(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching data: ', error);
//             });
//     }, []);

//     const renderCandles = () => {
//         const candles = [];
//         for (let i = 0; i < sensorData.length; i++) {
//             const data = sensorData[i];
//             const nextData = sensorData[i + 1];
//             const backgroundColor = data.machine_status === 0 ? 'yellow' : (data.machine_status === 1 ? 'green' : 'red');
//             candles.push(
//                 <div
//                     key={data.id}
//                     style={{
//                         width: '1px',
//                         height: '10px',
//                         backgroundColor: backgroundColor,
//                         marginRight: '0px',
//                         border: '1px solid black'
//                     }}
//                 />
//             );
//             if (nextData && new Date(nextData.timestamp).getTime() - new Date(data.timestamp).getTime() !== 1000) {
//                 candles.push(
//                     <div
//                         key={`missing-${data.id}`}
//                         style={{
//                             width: `${(new Date(nextData.timestamp).getTime() - new Date(data.timestamp).getTime()) / 1000}px`,
//                             height: '10px',
//                             backgroundColor: 'red',
//                             marginRight: '0px',
//                             border: '1px solid black'
//                         }}
//                     />
//                 );
//             }
//         }
//         return candles;
//     };

//     return (
//         <div style={{ display: 'flex', width: '100%', overflowX: 'hidden' }}>
//             {renderCandles()}
//         </div>
//     );
// };

// export default App;







// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const App = () => {
//     const [sensorData, setSensorData] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:3001/sensor_data')
//             .then(response => {
//                 setSensorData(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching data: ', error);
//             });
//     }, []);

//     const maxVibration = Math.max(...sensorData.map(data => data.vibration));

//     return (
//         <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//             {sensorData.map(data => (
//                 <div
//                     key={data.id}
//                     style={{
//                         width: `${10000 / sensorData.length}px`, // Adjust the denominator for smaller candles
//                         height: `${data.vibration / maxVibration * 100}px`, // Scale the height based on vibration value
//                         backgroundColor: data.machine_status === 0 ? 'yellow' : (data.machine_status === 1 ? 'green' : 'red'),
//                         marginRight: '1px',
//                         marginBottom: '1px'
//                     }}
//                 />
//             ))}
//         </div>
//     );
// };

// export default App;






// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const App = () => {
//     const [sensorData, setSensorData] = useState([]);

//     useEffect(() => {
      
//         axios.get('http://localhost:3001/sensor_data')
//             .then(response => {
//                 setSensorData(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching data: ', error);
//             });
//     }, []);

//     return (
//         <div>
        
//             {sensorData.map(data => (
//                 <div key={data.id} style={{ backgroundColor: data.machine_status === 0 ? 'yellow' : (data.machine_status === 1 ? 'green' : 'red') }}>
//                     {data.timestamp}: {data.machine_status}
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default App;
