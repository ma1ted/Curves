import * as THREE from "three";

function F(n) {
	if (n < 0) return -1;
	else if (n === 0) return 1;
	else {
		return n * F(n - 1);
	}
}

function C(n, r) {
	return F(n) / (F(r) * F(n - r));
}

export default function BezierCurve(t, p) {
	let sumX = 0;
	for (let r = 0; r < p.length; r++) {
		sumX += C(p.length - 1, r) * Math.pow(t, r) * Math.pow(1 - t, p.length - 1 - r) * p[r].x;
	}
	let sumY = 0;
	for (let r = 0; r < p.length; r++) {
		sumY += C(p.length - 1, r) * Math.pow(t, r) * Math.pow(1 - t, p.length - 1 - r) * p[r].y;
	}

	return new THREE.Vector3(sumX, sumY, 0);
}
