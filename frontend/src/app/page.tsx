"use client";

/**
 * 3d maps
 * https://developers.google.com/maps/documentation/javascript/3d-maps-getting-started
 * https://visgl.github.io/react-google-maps/examples/map-3d
 */

import { ZoomIn, ZoomOut } from "lucide-react";
import { Scope_One } from "next/font/google";
import React from "react";

import { Map, useMap } from "@vis.gl/react-google-maps";

import SolarSystem from "@/components/solar-system/solar-system";
import { Button } from "@/components/ui/button";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

const scopeOne = Scope_One({ subsets: ["latin"], weight: "400" });

const position = {
  lat: 42.345573,
  lng: -71.098326,
};
const pov = {
  heading: 270,
  pitch: 0,
};
const minZoom = 0;
const maxZoom = 21;

export default function Home() {
  const map = useMap();
  React.useEffect(() => {
    if (map) {
      const panorama = map.getStreetView();
      panorama.setVisible(true);
      panorama.setPosition(position);
      panorama.setPov(pov);
      panorama.setOptions({
        fullscreenControl: false,
        addressControl: false,
        clickToGo: false,
        enableCloseButton: false,
        zoomControl: false,
        panControl: false,
      });
    }
  }, [map]);
  // const [open, setOpen] = React.useState(true);
  const [zoom, setZoom] = React.useState(13);
  const [showSolarSystem, setShowSolarSystem] = React.useState(false);

  React.useEffect(() => {
    if (map) {
      map.setZoom(zoom);
    }
  }, [map, zoom]);

  // React.useEffect(() => {
  //   const listener = () => {
  //     setOpen((o) => !o);
  //   };
  //   document.getElementById("map")!.addEventListener("click", listener);
  //   return () => {
  //     document.getElementById("map")!.removeEventListener("click", listener);
  //   };
  // }, []);

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
        World So Big
      </span>
      <div className="fixed bottom-2 left-2 z-50 flex flex-col gap-2">
        <Button
          variant="outline"
          size="iconUnsized"
          onClick={() => {
            if (showSolarSystem) {
              setShowSolarSystem(false);
            } else if (map && zoom < maxZoom) {
              setZoom((z) => z + 1);
            } else if (map && zoom >= maxZoom) {
              map?.getStreetView().setVisible(true);
            }
          }}
          className="w-20 h-20 border-4 border-black"
        >
          <ZoomIn size={48} strokeWidth={3} />
        </Button>
        <Button
          variant="outline"
          size="iconUnsized"
          onClick={() => {
            if (map?.getStreetView().getVisible()) {
              map?.getStreetView().setVisible(false);
            } else if (map?.getZoom() === minZoom) {
              setShowSolarSystem(true);
            } else if (map && zoom > minZoom) {
              setZoom((z) => z - 1);
            }
          }}
          className="w-20 h-20 border-4 border-black"
        >
          <ZoomOut size={48} strokeWidth={3} />
        </Button>
      </div>
      {/* <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
      {showSolarSystem ? (
        <SolarSystem />
      ) : (
        <div
          id="map"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Map
            defaultZoom={13}
            defaultCenter={position}
            fullscreenControl={false}
            mapTypeControlOptions={{ mapTypeIds: [] }}
            mapTypeId={"hybrid"}
            rotateControl={false}
            zoomControl={false}
          ></Map>
        </div>
      )}
    </div>
  );
}
