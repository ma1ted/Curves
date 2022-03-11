import * as THREE from "three";

const handleMaterial = new THREE.MeshBasicMaterial();
const handleGeometry = new THREE.CircleGeometry(1, 32);

export function SetHandleWidth(value) { 
    controlHandles.children.forEach(h => h.scale.set(value, value, value));
}
export function SetHandleColour(colour) {
    handleMaterial.color = new THREE.Color(colour);
}

export const controlHandles = new THREE.Group();

export function InitialiseControlHandles(scene, inputs) {   
    const startPoints = [
        new THREE.Vector3(-10, 0, 0),
        new THREE.Vector3(-5, 10, 0),
        new THREE.Vector3(5, 10, 0),
        new THREE.Vector3(10, 0, 0),
    ];
    
    for (let point of startPoints) {
        const circle = new THREE.Mesh(handleGeometry, handleMaterial);
        circle.position.set(...point);
        circle.scale.set(
            inputs.handles.size.value,
            inputs.handles.size.value,
            inputs.handles.size.value
        );
        controlHandles.add(circle);
    }
    scene.add(controlHandles)
}

export function GetClickedHandle (scene, raycaster, mouse, camera) {
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObject(scene, true);
    
    for (let hit = 0; hit < hits.length; hit++) {
        if (hits[hit].object.geometry.type == "CircleGeometry") {
            return hits[hit];
        }
    }
    return null;
}

export function AddControlPoint(scene, inputs) {
    if (controlHandles.children.length <= 1) {
        controlHandles.children.forEach((handle) => scene.remove(handle));
        controlHandles.children = [];
        InitialiseControlHandles(scene, inputs);
        return;
    }

    // In order to insert a new point between the last two points the midpoint needs to be found
    const midpoint = new THREE.Vector3(
        ((
            controlHandles.children[controlHandles.children.length - 2].position.x +
            controlHandles.children[controlHandles.children.length - 1].position.x) / 2),
        ((
            controlHandles.children[controlHandles.children.length - 2].position.y +
            controlHandles.children[controlHandles.children.length - 1].position.y) / 2),
        controlHandles.children[0].position.z // Assuming all the points are z-aligned
    );

    const handle = new THREE.Mesh(handleGeometry, handleMaterial)
    handle.position.set(...midpoint);
    handle.scale.set(
        inputs.handles.size.value,
        inputs.handles.size.value,
        inputs.handles.size.value
    );
    
    controlHandles.children.splice(controlHandles.children.length - 1, 0, handle);
}

export function RemoveControlPoint() {
    console.log(controlHandles)
    controlHandles.remove(
        controlHandles.children[controlHandles.children.length - 1]
    );
    console.log(controlHandles)
}