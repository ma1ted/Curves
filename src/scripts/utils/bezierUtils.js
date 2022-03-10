import * as THREE from "three";

function QuadraticBezierCurve(t, p) {
    return new THREE.Vector3(
        (1-t)*((1-t)*p[0].x+t*p[1].x)+t*((1-t)*p[1].x+t*p[2].x),
        (1-t)*((1-t)*p[0].y+t*p[1].y)+t*((1-t)*p[1].y+t*p[2].y),
        0
    )
}

function F(n) {
    if (n < 0) 
        return -1;
    else if (n === 0) 
        return 1;
    else {
        return (n * F(n - 1));
    }
}

function C(n, r) {
    return F(n) / (F(r) * F(n-r))
}

export default function BezierCurve(t, p) {
    let sumX = 0;
    for (let r = 0; r < p.length; r++) {
        sumX += C(p.length - 1, r) * Math.pow(t, r) * Math.pow((1 - t), (p.length - 1) - r) * p[r].x;
    }
    let sumY = 0;
    for (let r = 0; r < p.length; r++) {
        sumY += C(p.length - 1, r) * Math.pow(t, r) * Math.pow((1 - t), (p.length - 1) - r) * p[r].y;
    }

    return new THREE.Vector3(sumX, sumY, 0);
}