"use client";

/**
 * 3d maps
 * https://developers.google.com/maps/documentation/javascript/3d-maps-getting-started
 */

import { Scope_One } from "next/font/google";
import React from "react";

import { Map, useMap } from "@vis.gl/react-google-maps";

const scopeOne = Scope_One({ subsets: ["latin"], weight: "400" });

const position = {
  lat: 42.345573,
  lng: -71.098326,
};
const pov = {
  heading: 270,
  pitch: 0,
};

export default function Home() {
  const map = useMap();
  React.useEffect(() => {
    if (map) {
      const panorama = map.getStreetView();
      panorama.setVisible(true);
      panorama.setPosition(position);
      panorama.setPov(pov);
    }
  }, [map]);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <span
        className={scopeOne.className}
        style={{
          fontSize: "20px",
          lineHeight: "18px",
          padding: "4px",
          textAlign: "center",
          width: "100%",
          fontWeight: "bold",
          cursor: "all-scroll",
        }}
      >
        Hello World
      </span>
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Map defaultZoom={13} defaultCenter={position}></Map>
      </div>
    </div>
  );
}
