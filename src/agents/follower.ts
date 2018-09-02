import { Agent } from './agent';
import * as THREE from 'three';

/**
 * Follower is going towards collections
 */
export class Follower extends Agent {

    private speed = 0.05;

    constructor(x: number, y: number, z: number) {
        super(x, y, z, new THREE.Color('rgb(0,0,0)'));
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    follow(collection: Agent[]) {
        this.translateOnAxis(this.findAvgDirection(this.findNeighbors(0, 40, collection)).clone(), this.speed);
    }
}
