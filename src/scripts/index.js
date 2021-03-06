import * as THREE from "three";
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
	displayOrder: document.getElementById("display-order")
};

const defaultColours = {
	bg: new THREE.Color(0x293241),
	handle: new THREE.Color(0x98C1D9),
	controlLine: new THREE.Color(0x3D5A80),
	curve: new THREE.Color(0xee6c4d)
};

if (window != window.top) document.getElementById("control-panel").remove();
const params = new URLSearchParams(window.location.search);

function Initialise() {
	inputs.background.colour.value = "#".concat(defaultColours.bg.getHexString());
	inputs.handles.colour.value = "#".concat(defaultColours.handle.getHexString());
	inputs.controlLines.colour.value = "#".concat(defaultColours.controlLine.getHexString());
	inputs.curve.colour.value = "#".concat(defaultColours.curve.getHexString());

	SetCurveColour(defaultColours.curve);
	SetHandleColour(defaultColours.handle);
	SetControlLineColour(defaultColours.controlLine);

	SetControlLineDisplayOrder(inputs.displayOrder.checked);

	SetCurveWidth(params.get("curve") || inputs.curve.size.value);
	SetControlLineWidth(params.get("line") || inputs.controlLines.size.value);

	InitialiseControlHandles(scene, params.get("handle") || inputs);
	ReDrawControlLines(scene, controlHandles);
	ReDrawCurve(scene, params.get("resolution") || inputs, controlHandles);
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(
	params.get("background") ? new THREE.Color(params.get("background")) : defaultColours.bg
);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
if (window === window.top) {
	camera.position.set(0, 0, 50);
	camera.lookAt(0, 0, 0);
} else {
	const yValue = parseInt(params.get("y")) || 5;
	const zValue = parseInt(params.get("z")) || 30;
	camera.position.set(0, yValue, zValue);
	camera.lookAt(0, yValue, 0);
}

const scene = new THREE.Scene();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const mouseCopy = new THREE.Vector3();
const mouseWorldPos = new THREE.Vector3();

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
	inputs.curve.resolution.display.innerHTML = "Curve Resolution: " + el.target.value;
};

inputs.points.insert.onclick = () => {
	AddControlPoint(scene, inputs);
	ReDrawCurve(scene, inputs, controlHandles);
	ReDrawControlLines(scene, controlHandles);
};
inputs.points.delete.onclick = () => {
	RemoveControlPoint();
	ReDrawCurve(scene, inputs, controlHandles);
	ReDrawControlLines(scene, controlHandles);
};

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
};

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

window.onmousedown = () => (clickedHandle = GetClickedHandle(scene, raycaster, mouse, camera));
window.onmouseup = () => (clickedHandle = null);

window.onload = () => Initialise(scene, inputs);
ReDrawControlLines(scene, controlHandles);
