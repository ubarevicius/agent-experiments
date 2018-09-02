import { Agent } from './agent';
import * as THREE from 'three';

/**
 * Attractor tries to get away from those who try to get closer
 */
export class Attractor extends Agent {

    private speed = 0.05;

    constructor(x: number, y: number, z: number) {
        super(x, y, z, new THREE.Color('rgb(0,0,0)'));
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    runAway(collection: Agent[]) {
        this.translateOnAxis(this.findAvgDirection(this.findNeighbors(0, 90, collection)).clone().multiplyScalar(-1), this.speed);
    }
}
