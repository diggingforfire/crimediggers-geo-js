import React from "react";
import Map from "../Map/Map";
import ToolBox from "../ToolBox/ToolBox";
import "./App.scss";

const App = () => (
    <div className="app-container">
        <span className="app-title glitch" data-label="#CRIMEDIGGERS GEO">
            #CRIMEDIGGERS GEO
        </span>

        <div className="app-body">
            <div className="map-container">
                <Map></Map>
            </div>
            <div className="toolbox-container">
                <ToolBox></ToolBox>
            </div>
        </div>
    </div>
);

export default App;
