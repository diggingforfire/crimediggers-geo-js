import React, { useRef } from "react";
import { connect } from "react-redux";
import "./Map.scss";
import {
    Map as LeafletMap,
    TileLayer,
    Marker,
    Popup,
    GeoJSON,
} from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import { lineString } from "@turf/helpers";
import lineIntersect from "@turf/line-intersect";

const markerIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -41],
});

const colors = ["red", "blue", "green"];

function geoStyle(colorIndex) {
    return {
        color: colors[colorIndex % colors.length],
        weight: 3,
        fillOpacity: 1,
        fillColor: [colorIndex % colors.length],
    };
}

const Map = (props) => {
    const leafletRef = useRef(null);

    const test = (e) => {
        debugger;
        e.sourceTarget.openPopup();
    };

    return (
        <div className="map">
            <LeafletMap
                ref={leafletRef}
                center={[52.369851603519905, 4.89685622453752]}
                zoom={14}
                style={{ width: "100%", height: "900px" }}
            >
                <TileLayer
                    attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {props.routes.map((lineString, index) => (
                    <GeoJSON
                        key={index}
                        data={lineString}
                        style={geoStyle(index)}
                    ></GeoJSON>
                ))}

                {props.intersections.map((intersection, index) => (
                    <Marker
                        onmouseover={test}
                        icon={markerIcon}
                        key={index}
                        position={{
                            lat: parseFloat(
                                intersection.points.geometry.coordinates[1]
                            ).toFixed(14),
                            lon: parseFloat(
                                intersection.points.geometry.coordinates[0]
                            ).toFixed(14),
                        }}
                    >
                        <Popup>
                            <div>
                                <div>
                                    <div>
                                        <strong>Latitude</strong>
                                    </div>
                                    <div>
                                        {parseFloat(
                                            intersection.points.geometry
                                                .coordinates[1]
                                        ).toFixed(14)}
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <strong>Longitude</strong>
                                    </div>
                                    <div>
                                        {parseFloat(
                                            intersection.points.geometry
                                                .coordinates[0]
                                        ).toFixed(14)}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <strong>
                                        Suspect one was here between
                                    </strong>
                                </div>
                                <div>
                                    {intersection.sourceOne.start.toLocaleString()}{" "}
                                    -{" "}
                                    {intersection.sourceOne.end.toLocaleTimeString()}
                                </div>
                            </div>
                            <div>
                                <div>
                                    <strong>
                                        Suspect two was here between
                                    </strong>
                                </div>
                                <div>
                                    {intersection.sourceTwo.start.toLocaleString()}{" "}
                                    -{" "}
                                    {intersection.sourceTwo.end.toLocaleTimeString()}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </LeafletMap>
        </div>
    );
};

function getCoordinateSets(state) {
    return state.coordinateSets.map((coordinateSet) => {
        return coordinateSet.wpt.map((coordinate) => {
            return [coordinate.lon, coordinate.lat];
        });
    });
}

function getLocationPairs(state) {
    return state.coordinateSets.map((coordinateSet) => {
        return coordinateSet.wpt.map((current, i) => {
            let next = coordinateSet.wpt.slice(1)[i] || coordinateSet.wpt[0];

            return lineString([
                [current.lon, current.lat, new Date(current.time)],
                [next.lon, next.lat, new Date(next.time)],
            ]);
        });
    });
}

function getIntersections(cartesian) {
    return cartesian
        .map((pairs) => {
            return {
                sourceOne: {
                    start: pairs[0].geometry.coordinates[0][2],
                    end: pairs[0].geometry.coordinates[0][2],
                },
                sourceTwo: {
                    start: pairs[1].geometry.coordinates[0][2],
                    end: pairs[1].geometry.coordinates[0][2],
                },
                points: lineIntersect(pairs[0], pairs[1]).features[0],
            };
        })
        .filter((t) => t.points);
}

function mapStateToProps(state) {
    const coordinateSets = getCoordinateSets(state);

    const routes = coordinateSets.map((coordinateSet) => {
        return lineString(coordinateSet);
    });

    const locationPairs = getLocationPairs(state);

    const cartesian = locationPairs.reduce(
        (a, b) => a.flatMap((x) => b.map((y) => [...x, y])),
        [[]]
    );

    const intersections = getIntersections(cartesian);

    return {
        routes,
        intersections,
    };
}

export default connect(mapStateToProps)(Map);
