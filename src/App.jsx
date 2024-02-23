import React, { useState, useEffect } from "react";
import { BarLoader } from "react-spinners";

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [planets, setPlanets] = useState([]);
  const [residentsMap, setResidentsMap] = useState({});
  const [expandedPlanet, setExpandedPlanet] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPlanets = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://swapi.dev/api/planets/?page=${currentPage}&format=json`
      );
      const data = await response.json();
      setPlanets(data.results);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchResidents = async (residentUrls, planetIndex) => {
    try {
      setLoading(true);
      const residentsData = await Promise.all(
        residentUrls.map(async (url) => {
          const response = await fetch(url);
          return await response.json();
        })
      );
      setLoading(false);
      setResidentsMap((prevMap) => ({
        ...prevMap,
        [planetIndex]: residentsData,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPlanets();
  }, [currentPage]);

  useEffect(() => {
    if (planets.length > 0) {
      planets.forEach((planet, index) => {
        const residentUrls = planet.residents;
        fetchResidents(residentUrls, index);
      });
    }
  }, [planets]);

  const togglePlanetExpansion = (index) => {
    setExpandedPlanet((prevExpanded) =>
      prevExpanded === index ? null : index
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleNextPage = () => {
    if (currentPage < 6) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  return (
    <>
      <h1 style={{ fontSize: "50px", textAlign: "center", color: "white" }}>
        Star Wars
      </h1>
      <hr />

      <div className="pagination" style={{ alignContent: "center" }}>
        <button onClick={handlePrevPage} className="pagination-button">
          {"<"}
        </button>
        {Array.from({ length: 6 }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}
        <button onClick={handleNextPage} className="pagination-button">
          {">"}
        </button>
      </div>
      <div className="main-container">
        {planets &&
          planets.map((item, index) => (
            <div
              className={`star-details-container ${expandedPlanet === index ? 'expanded' : ''}`}
              key={index}
            >
              <div className="star-details">
                <h1>{item.name}</h1>

                <div className="stardetailsname" style={{ fontSize: "15px" }}>
                  <span>CLIMATE :</span>
                  <span style={{ textTransform: "uppercase" }}>
                    {item.climate}
                  </span>
                </div>
                <br />
                <div className="stardetailsname" style={{ fontSize: "15px" }}>
                  <span>TERRAIN :</span>
                  <span style={{ textTransform: "uppercase" }}>
                    {item.terrain}
                  </span>
                </div>
                <br />
                <div className="stardetailsname1" style={{ fontSize: "15px" }}>
                  <p>
                    <span>POPULATION :</span>
                    <span style={{ textTransform: "uppercase" }}>
                      {item.population}
                    </span>
                  </p>
                  <button onClick={() => togglePlanetExpansion(index)}>
                    Show Population
                  </button>
                </div>

                {expandedPlanet === index && (
                  !loading ? (
                    <ul>
                      {residentsMap[index] && residentsMap[index].length > 0 ? (
                        residentsMap[index].map((resident, resIndex) => (
                          <li key={resIndex}>
                            {resident.name} - Height: {resident.height}, Mass:{" "}
                            {resident.mass}, Gender: {resident.gender}
                          </li>
                        ))
                      ) : (
                        <li>No residents</li>
                      )}
                    </ul>
                  ) : (
                    <>
                      <BarLoader color="#36d7b7" />
                      <span className="uploading-text">fetching data...</span>
                    </>
                  )
                )}
              </div>

            </div>
          ))}
          
      </div>
      <div className="pagination" style={{ alignContent: "center" }}>
        <button onClick={handlePrevPage} className="pagination-button">
          {"<"}
        </button>
        {Array.from({ length: 6 }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}
        <button onClick={handleNextPage} className="pagination-button">
          {">"}
        </button>
      </div>
    </>
  );
};

export default App;
