import React from "react";
import { connect } from "react-redux";
import "./ToolBox.scss";
import { lineString } from "@turf/helpers";
import lineIntersect from "@turf/line-intersect";

const ToolBox = (props) => (
    <div className="toolbox">
        <div className="title">
            <h3>Intersections</h3>
        </div>
        <div className="intersections">
            {props.intersections.map((intersection, index) => (
                <div key={index} className="intersection">
                    {parseFloat(
                        intersection.points.geometry.coordinates[1]
                    ).toFixed(7)}
                    ;{" "}
                    {parseFloat(
                        intersection.points.geometry.coordinates[0]
                    ).toFixed(7)}
                </div>
            ))}
        </div>
    </div>
);

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
                sourceOne: pairs[0],
                sourceTwo: pairs[1],
                points: lineIntersect(pairs[0], pairs[1]).features[0],
            };
        })
        .filter((t) => t.points);
}

function mapStateToProps(state) {
    const locationPairs = getLocationPairs(state);

    const cartesian = locationPairs.reduce(
        (a, b) => a.flatMap((x) => b.map((y) => [...x, y])),
        [[]]
    );

    const intersections = getIntersections(cartesian);

    return {
        intersections,
    };
}

export default connect(mapStateToProps)(ToolBox);
