import * as THREE from "three";
import * as MESHLINE from "three.meshline";
import BezierCurve from "./bezierUtils.js";
import { defaultColours } from "../index.js";

let previousCurve;

const bezierMaterial = new MESHLINE.MeshLineMaterial({
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
});

export function SetCurveWidth(width) {
    bezierMaterial.lineWidth = width;
}

export function SetCurveColour(colour) {
    bezierMaterial.color = new THREE.Color(colour);
}

export function ReDrawCurve(scene, inputs, controlHandles) {   
    const points = [];
    for (let handle of controlHandles.children) {
        points.push(new THREE.Vector3(handle.position.x, handle.position.y, handle.position.z));
    }

    const bezierPoints = [];
    for (let line = 0; line <= 1; line += 1/inputs.curve.resolution.input.value) {
        bezierPoints.push(BezierCurve(line, points))
    }
    bezierPoints.pop();
    bezierPoints.push(points[points.length-1])

    const bezierGeometry = new THREE.BufferGeometry().setFromPoints(bezierPoints);
        
    const bezierCurve = new MESHLINE.MeshLine();
    bezierCurve.setGeometry(bezierGeometry);

    const bezierMesh = new THREE.Mesh(bezierCurve, bezierMaterial);
    scene.add(bezierMesh);

    scene.remove(previousCurve);
    previousCurve = bezierMesh;
}