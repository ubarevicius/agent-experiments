import * as THREE from 'three';

export class Agent extends THREE.Points {
    constructor(x: number, y: number, z: number, color: THREE.Color) {
        super();
        this.position.set(x, y, z);
        const dotMaterial = new THREE.PointsMaterial({ size: 0, sizeAttenuation: true, color });
        const dotGeometry = new THREE.Geometry();

        dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        this.geometry = dotGeometry;
        this.material = dotMaterial;
    }

    findNeighbors(minDistance: number, maxDistance: number, collection: Agent[]): Agent[] {
        return collection.filter(
            i => {
                const dist = i.position.distanceTo(this.position);
                return (dist < maxDistance && dist > minDistance);
            }).map(i => i.clone());
    }

    findClosestNeighbor(collection: Agent[]): Agent {
        const minDist = this.minDistance(collection);
        return collection.find(i => i.position.distanceTo(this.position) === minDist).clone();
    }

    findAvgDirection(collection: Agent[]): THREE.Vector3 {
        let vec = new THREE.Vector3(0, 0, 0);
        if (collection && collection.length > 0) {
            vec = collection.map(i => i.position.sub(this.position).normalize()).reduce((i, c) => i.add(c)).normalize();
        }
        return vec;
    }

    minDistance(collection: Agent[]) {
        const distances = collection.map(i => i.position.distanceTo(this.position));
        return Math.min(...distances);
    }
}
