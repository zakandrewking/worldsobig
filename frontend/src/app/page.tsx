"use client";

/**
 * 3d maps
 * https://developers.google.com/maps/documentation/javascript/3d-maps-getting-started
 * https://visgl.github.io/react-google-maps/examples/map-3d
 */

import { Scope_One } from "next/font/google";
import React from "react";

import { Map, useMap } from "@vis.gl/react-google-maps";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [open, setOpen] = React.useState(true);
  const [zoom, setZoom] = React.useState(13);

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
        Hello World
      </span>
      <Button
        onClick={() => setZoom((z) => z + 1)}
        className="fixed w-28 h-28 bottom-[130px] left-2 z-50"
      >
        In
      </Button>
      <Button
        onClick={() => setZoom((z) => z - 1)}
        className="fixed w-28 h-28 bottom-2 left-2 z-50"
      >
        Out
      </Button>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div
        id="map"
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
