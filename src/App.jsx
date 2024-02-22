import React, { useState, useEffect } from "react";
import Pagination from '@mui/material/Pagination';

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [planets, setPlanets] = useState([]);
  const [residents, setResidents] = useState([]);

  const fetchPlanets = async () => {
    try {
      const response = await fetch(
        `https://swapi.dev/api/planets/?page=${currentPage}&format=json`
      );
      const data = await response.json();
      setPlanets(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchResidents = async (residentUrls) => {
    try {
      const residentsData = await Promise.all(
        residentUrls.map(async (url) => {
          console.log(url)
          const response = await fetch(url);
          console.log(response.json());
          return await response.json();
        })
      );
      setResidents(residentsData);
    } catch (error) {
      console.log("error",error)
    }
    
  };

  useEffect(() => {
    fetchPlanets();
  }, [currentPage]);

  useEffect(() => {
    if (planets.length > 0) {
      const residentUrls = planets.flatMap((planet) => planet.residents);
      fetchResidents(residentUrls);
    }
  }, [planets]);

  return (
    <>
      <h1 style={{ fontSize: "50px", textAlign: "center", color: "white" }}>
        Audio Player
      </h1>
      {planets &&
        planets.map((item, index) => (
          <div className="audio-player-container" key={index}>
            <div className="audio-player">
              <h1 >{item.name}</h1>
              <div className="playeraudioname">
                <div className="playeraudioname">
                  <span style={{color:"yellow", fontSize:"20px"}}>CLIMATE</span> : <span style={{color:"white", fontSize:"20px",textTransform:"uppercase"}}>{item.climate}</span>
                </div>
                <br />
                <div className="playeraudioname"><span style={{color:"yellow", fontSize:"20px"}}>TERRAIN</span>: <span style={{color:"white", fontSize:"20px",textTransform:"uppercase"}}>{item.terrain}</span></div>
                <br />
                <div className="playeraudioname"><span style={{color:"yellow", fontSize:"20px"}}>population</span>: <span style={{color:"white", fontSize:"20px",textTransform:"uppercase"}}>{item.population}</span></div>
                <ul>
                  {residents.length > 0 ? (
                    residents.map((resident, index) => (
                      <li key={index}>
                        {resident.name} - Height: {resident.height}, Mass:{" "}
                        {resident.mass}, Gender: {resident.gender}
                      </li>
                    ))
                  ) : (
                    <li>No residents</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      {currentPage !== 1 ? (
        <button onClick={() => setCurrentPage(currentPage - 1)}>
          previous
        </button>
      ) : (
        <button disabled>previous</button>
      )}
      {currentPage !== 6 ? (
        <button onClick={() => setCurrentPage(currentPage + 1)}>next</button>
      ) : (
        <button disabled>previous</button>
      )}
    </>
  );
};

export default App;
