/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/**
 * Adapted from: https://gist.github.com/ivyywang/7c94cb5a3accd9913263
 */

import * as d3Drag from "d3-drag";
import * as d3Geo from "d3-geo";
import * as d3Selection from "d3-selection";
import * as d3Timer from "d3-timer";
import React, { Component } from "react";
import * as topojson from "topojson";
import topo from "world-atlas/countries-110m.json";

const width = 70;
const height = 70;
const velocity = [0.01, -0.002];
const to_radians = Math.PI / 180;
const to_degrees = 180 / Math.PI;

function quatMultiply(q1: number[] | undefined, q2: number[] | undefined) {
  if (!q1 || !q2) return;
  const a = q1[0];
  const b = q1[1];
  const c = q1[2];
  const d = q1[3];
  const e = q2[0];
  const f = q2[1];
  const g = q2[2];
  const h = q2[3];
  return [
    a * e - b * f - c * g - d * h,
    b * e + a * f + c * h - d * g,
    a * g - b * h + c * e + d * f,
    a * h + b * g - c * f + d * e,
  ];
}

function euler2quat(e: number[]) {
  if (!e) return;
  const roll = 0.5 * e[0] * to_radians;
  const pitch = 0.5 * e[1] * to_radians;
  const yaw = 0.5 * e[2] * to_radians;
  const sr = Math.sin(roll);
  const cr = Math.cos(roll);
  const sp = Math.sin(pitch);
  const cp = Math.cos(pitch);
  const sy = Math.sin(yaw);
  const cy = Math.cos(yaw);
  const qi = sr * cp * cy - cr * sp * sy;
  const qj = cr * sp * cy + sr * cp * sy;
  const qk = cr * cp * sy - sr * sp * cy;
  const qr = cr * cp * cy + sr * sp * sy;
  return [qr, qi, qj, qk];
}

function cross(v0: number[], v1: number[]) {
  return [
    v0[1] * v1[2] - v0[2] * v1[1],
    v0[2] * v1[0] - v0[0] * v1[2],
    v0[0] * v1[1] - v0[1] * v1[0],
  ];
}

function dot(v0: number[], v1: number[]) {
  let sum = 0;
  for (let i = 0; v0.length > i; ++i) {
    sum += v0[i] * v1[i];
  }
  return sum;
}

function quaternion(v0: number[] | undefined, v1: number[] | undefined) {
  if (v0 && v1) {
    const w = cross(v0, v1);
    const w_len = Math.sqrt(dot(w, w));
    if (w_len === 0) return;
    const theta = 0.5 * Math.acos(Math.max(-1, Math.min(1, dot(v0, v1))));
    const qi = (w[2] * Math.sin(theta)) / w_len;
    const qj = (-w[1] * Math.sin(theta)) / w_len;
    const qk = (w[0] * Math.sin(theta)) / w_len;
    const qr = Math.cos(theta);
    if (!theta) return;
    return [qr, qi, qj, qk];
  }
}

function lonlat2xyz(coord: number[] | undefined) {
  if (!coord) return;
  const lon = coord[0] * to_radians;
  const lat = coord[1] * to_radians;
  const x = Math.cos(lat) * Math.cos(lon);
  const y = Math.cos(lat) * Math.sin(lon);
  const z = Math.sin(lat);
  return [x, y, z];
}

function quat2euler(t: number[] | undefined) {
  if (!t) return;
  return [
    Math.atan2(
      2 * (t[0] * t[1] + t[2] * t[3]),
      1 - 2 * (t[1] * t[1] + t[2] * t[2])
    ) * to_degrees,
    Math.asin(Math.max(-1, Math.min(1, 2 * (t[0] * t[2] - t[3] * t[1])))) *
      to_degrees,
    Math.atan2(
      2 * (t[0] * t[3] + t[1] * t[2]),
      1 - 2 * (t[2] * t[2] + t[3] * t[3])
    ) * to_degrees,
  ];
}

function eulerAngles(v0: number[], v1: number[], o0: number[]) {
  const t = quatMultiply(
    euler2quat(o0),
    quaternion(lonlat2xyz(v0), lonlat2xyz(v1))
  );
  return quat2euler(t);
}

class Globe extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      projection: d3Geo
        .geoOrthographic()
        .scale(height / 2.1)
        .translate([width / 2, height / 2])
        .clipAngle(90)
        .precision(0.5),
      // eslint-disable-next-line prefer-spread
      rotation: Array.apply(null, Array(3)).map(() => Math.random() * 360),
      gpos0: null,
      timer: null,
      startAgainTimer: null,
      path: null,
      context: null,
      land: null,
    };
  }

  startRotate() {
    const { projection, rotation } = this.state as any;
    const t0 = Date.now();
    this.setState({
      timer: d3Timer.timer(() => {
        const dt = Date.now() - t0;
        projection.rotate([
          velocity[0] * dt + rotation[0],
          velocity[1] * dt + rotation[1],
          rotation[2],
        ]);
        this.draw();
      }),
    });
  }

  stopRotate() {
    if ((this.state as any).timer) (this.state as any).timer.stop();
  }

  dragStart(mouse: any) {
    if ((this.state as any).startAgainTimer)
      clearTimeout((this.state as any).startAgainTimer);
    this.stopRotate();
    this.setState({ gpos0: (this.state as any).projection.invert(mouse) });
  }

  dragged(mouse: any) {
    const { projection, gpos0 } = this.state as any;
    const gpos1 = projection.invert(mouse);
    const o0 = projection.rotate();
    const rotation = eulerAngles(gpos0, gpos1, o0);
    if (rotation) {
      projection.rotate(rotation);
      this.setState({ rotation });
      this.draw();
    }
  }

  dragEnd() {
    this.setState({
      startAgainTimer: setTimeout(this.startRotate.bind(this), 500),
    });
  }

  componentDidMount() {
    if (
      d3Selection
        .select((this as any).span)
        .select("canvas")
        .node()
    )
      return;

    const { projection } = this.state as any;
    const drag = d3Drag
      .drag()
      .on("start", () => {
        this.stopRotate();
      })
      .on("start", (event) => {
        const canvas = d3Selection.select((this as any).span).select("canvas");
        const pointer = d3Selection.pointer(event, canvas.node());
        this.dragStart(pointer);
      })
      .on("drag", (event) => {
        const canvas = d3Selection.select((this as any).span).select("canvas");
        const pointer = d3Selection.pointer(event, canvas.node());
        this.dragged(pointer);
      })
      .on("end", () => this.dragEnd());

    // support hidpi
    const ratio = window.devicePixelRatio || 1;

    const canvas = d3Selection
      .select((this as any).span)
      .append("canvas")
      .style("width", width + "px")
      .style("height", height + "px")
      .call(drag as any);
    const canvasNode = canvas.node();
    if (!canvasNode) return;
    canvasNode.height = height * ratio;
    canvasNode.width = width * ratio;
    const context = canvasNode.getContext("2d");
    if (!context) return;
    context.scale(ratio, ratio);
    const path = d3Geo.geoPath().projection(projection).context(context);
    projection.scale(0.99 * projection.scale());
    const land = topojson.feature(topo as any, topo.objects.land as any);

    this.setState({ path, context, land });
    this.startRotate();
  }

  draw() {
    const { context, path, land } = this.state as any;

    context.clearRect(0, 0, width, height);

    context.beginPath();
    path({ type: "Sphere" });
    context.lineWidth = 4;
    context.strokeStyle = "#000";
    context.stroke();

    context.beginPath();
    path(land);
    context.lineWidth = 1;
    context.strokeStyle = "#000";
    context.stroke();
  }

  render() {
    return (
      <span
        style={{ padding: "0 3px 0 0", display: "inline-block" }}
        ref={(span) => {
          (this as any).span = span;
        }}
      ></span>
    );
  }
}

export default Globe;
