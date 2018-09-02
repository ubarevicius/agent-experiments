import * as THREE from 'three';
import { BufferAttribute } from 'three';

const MAX_POINTS = 50000;

export class Path extends THREE.Line {
    geometry: THREE.BufferGeometry;
    pointsAdded = 1;
    positions = new Float32Array(MAX_POINTS * 3);
    constructor(color: string) {
        super();
        // geometry
        this.geometry = new THREE.BufferGeometry();

        // attributes
        this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.material = new THREE.LineBasicMaterial({ color, linewidth: 1 });
    }

    addPoint(vec: THREE.Vector3) {
        if (this.pointsAdded < MAX_POINTS) {
            const v = vec.clone();
            this.positions[this.pointsAdded * 3 + 0] = v.x;
            this.positions[this.pointsAdded * 3 + 1] = v.y;
            this.positions[this.pointsAdded * 3 + 2] = v.z;
            (this.geometry.attributes.position as BufferAttribute).needsUpdate = true;
            this.geometry.setDrawRange(1, this.pointsAdded);
            this.pointsAdded++;
        }
    }
}
