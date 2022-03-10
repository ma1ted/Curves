import * as THREE from "three";
import * as MESHLINE from "three.meshline";
import { ReDrawCurve, SetCurveColour, SetCurveWidth } from "./utils/curve.js";
import {
    SetHandleWidth,
    SetHandleColour,
    controlHandles,
    InitialiseControlHandles,
    GetClickedHandle,
    AddControlPoint,
    RemoveControlPoint
} from "./utils/controlPoints.js";
import {
    SetControlLineWidth,
    SetControlLineColour,
    SetControlLineDisplayOrder,
    ReDrawControlLines
} from "./utils/controlLines.js";

const inputs = {
    background: {
        colour: document.getElementById("col-bg")
    },
    handles: {
        colour: document.getElementById("col-handle"),
        size: document.getElementById("size-handle")
    },
    controlLines: {
        colour: document.getElementById("col-control-line"),
        size: document.getElementById("size-control-line")
    },
    curve: {
        resolution: {
            input: document.getElementById("curve-resolution"),
            display: document.getElementById("curve-resolution-display")
        },
        colour: document.getElementById("col-curve"),
        size: document.getElementById("size-curve")
    },
    points: {
        insert: document.getElementById("point-insert"),
        delete: document.getElementById("point-remove")
    },
    displayOrder: document.getElementById("display-order"),
};

const defaultColours = {
    bg: new THREE.Color(0x0d1923),
    handle: new THREE.Color(0xffffff),
    controlLine: new THREE.Color(0xffffff),
    curve: new THREE.Color(0xff1150),
};

function Initialise() {
    inputs.background.colour.value = '#'.concat(defaultColours.bg.getHexString())
    inputs.handles.colour.value = '#'.concat(defaultColours.handle.getHexString())
    inputs.controlLines.colour.value = '#'.concat(defaultColours.controlLine.getHexString())
    inputs.curve.colour.value = '#'.concat(defaultColours.curve.getHexString());

    SetCurveColour(defaultColours.curve);
    SetHandleColour(defaultColours.handles);
    SetControlLineColour(defaultColours.controlLine);

    SetCurveWidth(inputs.curve.size.value);
    SetHandleWidth(inputs.handles.size.value);
    SetControlLineWidth(inputs.controlLines.size.value);

    InitialiseControlHandles(scene, inputs);
    ReDrawControlLines(scene, controlHandles);
    ReDrawCurve(scene, inputs, controlHandles);
    
    SetControlLineDisplayOrder(inputs.displayOrder.checked);
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(defaultColours.bg);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 50);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const mouseCopy = new THREE.Vector3();
const mouseWorldPos = new THREE.Vector3();

let previousCurve;
let clickedHandle;

inputs.background.colour.oninput = (el) => renderer.setClearColor(el.target.value);
inputs.handles.colour.oninput = (el) => SetHandleColour(el.target.value);
inputs.controlLines.colour.oninput = (el) => SetControlLineColour(el.target.value);
inputs.curve.colour.oninput = (el) => SetCurveColour(el.target.value);

inputs.handles.size.oninput = (el) => SetHandleWidth(el.target.value);
inputs.controlLines.size.oninput = (el) => SetControlLineWidth(el.target.value);
inputs.curve.size.oninput = (el) => SetCurveWidth(el.target.value);

inputs.displayOrder.oninput = (el) => SetControlLineDisplayOrder(el.target.checked);

inputs.curve.resolution.input.oninput = (el) => {
    ReDrawCurve(scene, inputs, controlHandles);
    inputs.curve.resolution.display.innerHTML = "Curve Resolution: " + inputs.curve.resolution.input.value;
}

inputs.points.insert.onclick = () => {
    AddControlPoint(scene, inputs);
    ReDrawCurve(scene, inputs, controlHandles);
    ReDrawControlLines(scene, controlHandles);
}
inputs.points.delete.onclick = () => {
    RemoveControlPoint();
    ReDrawCurve(scene, inputs, controlHandles);
    ReDrawControlLines(scene, controlHandles);
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();

window.onresize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

window.onmousemove = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    mouseCopy.set(...mouse);
    mouseCopy.unproject(camera);
    mouseCopy.sub(camera.position).normalize();
    let distance = -camera.position.z / mouseCopy.z;
    mouseWorldPos.copy(camera.position).add(mouseCopy.multiplyScalar(distance));

    if (clickedHandle) {
        clickedHandle.object.position.set(...mouseWorldPos);
        ReDrawControlLines(scene, controlHandles);
        ReDrawCurve(scene, inputs, controlHandles);
    }
};

window.onmousedown = () => clickedHandle = GetClickedHandle(scene, raycaster, mouse, camera);
window.onmouseup = () => clickedHandle = null;

window.onload = () => Initialise(scene, inputs);
ReDrawControlLines(scene, controlHandles);