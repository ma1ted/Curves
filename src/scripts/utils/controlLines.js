import * as THREE from "three";
import * as MESHLINE from "three.meshline";

const controlLineMaterial = new MESHLINE.MeshLineMaterial({
	resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
});

export function SetControlLineWidth(width) {
	controlLineMaterial.lineWidth = width;
}
export function SetControlLineColour(colour) {
	controlLineMaterial.color = new THREE.Color(colour);
}

export const controlLines = new THREE.Group();

export function SetControlLineDisplayOrder(curveOnTop) {
	controlLines.renderOrder = curveOnTop ? -1 : 1;
}

export function ReDrawControlLines(scene, controlHandles) {
	scene.remove(controlLines);

	controlLines.children = [];

	for (let handle = 0; handle < controlHandles.children.length - 1; handle++) {
		const points = [
			new THREE.Vector3(
				controlHandles.children[handle].position.x,
				controlHandles.children[handle].position.y,
				controlHandles.children[handle].position.z
			),
			new THREE.Vector3(
				controlHandles.children[handle + 1].position.x,
				controlHandles.children[handle + 1].position.y,
				controlHandles.children[handle + 1].position.z
			)
		];

		const controlLineGeometry = new THREE.BufferGeometry().setFromPoints(points);
		const controlLine = new MESHLINE.MeshLine();
		controlLine.setGeometry(controlLineGeometry);

		const controlLineMesh = new THREE.Mesh(controlLine, controlLineMaterial);
		controlLines.add(controlLineMesh);
	}

	scene.add(controlLines);
}
