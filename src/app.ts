import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import { Attractor } from './agents/attractor';
import { Follower } from './agents/follower';
import { Path } from './paths/path';
import { FileSaver } from './utils/save-file';
import { CCaptureWrapped } from './utils/ccapturewrapped';

class App {

    private readonly renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('mainCanvas') as HTMLCanvasElement });
    private readonly scene = new THREE.Scene();
    private readonly camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 10000);
    private readonly orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

    private attractors: Attractor[] = [];
    private followers: Follower[] = [];
    private paths: Path[] = [];

    private ptCld = new THREE.PointCloud();
    private pointAttractorCache: number[][] = [];
    private pointFollowerCache: number[][] = [];

    private fileSaverFollowers = new FileSaver('followers');
    private fileSaverAttractors = new FileSaver('attractors');

    private frameCount = 0;

    private recorder = new CCaptureWrapped({
        verbose: false,
        display: true,
        framerate: 60,
        quality: 100,
        format: 'webm',
        timeLimit: 1000,
        frameLimit: 0,
        autoSaveTime: 0
    });

    constructor() {
        this.orbitControls.enabled = true;

        this.camera.position.set(0, 260, 260);
        this.camera.lookAt(0, 0, 0);
        const cubeRandomSize = 100;
        const multiversesX = 1;
        const multiversesY = 1;
        const multiversesZ = 1;

        const nrAttractors = 500;
        const nrFollowers = 2000;
        const dbm = 120;

        for (let x = 0; x < multiversesX; x++) {
            for (let y = 0; y < multiversesY; y++) {
                for (let z = 0; z < multiversesZ; z++) {
                    if (true) {
                        this.initiateBoids(nrAttractors, dbm, cubeRandomSize, x, y, z, nrFollowers);
                    }
                }
            }
        }

        this.scene.add(...this.attractors);
        this.scene.add(...this.followers);
        this.scene.add(...this.paths);
        this.scene.add(this.ptCld);

        this.scene.fog = new THREE.FogExp2('rgb(0,0,0)', 0.0025);
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setClearColor(new THREE.Color('rgb(0,0,0)'));
        setTimeout(() => { this.setupButtons(); this.render(); });
    }

    private initiateBoids(nrAttractors: number, dbm: number, cubeRandomSize: number, x: number, y: number, z: number, nrFollowers: number) {
        for (let i = 0; i < nrAttractors; i++) {
            this.attractors.push(this.createAgent<Attractor>(Attractor, x * dbm, y * dbm, z * dbm, cubeRandomSize * 2, cubeRandomSize * 2, cubeRandomSize * 2));
        }
        for (let i = 0; i < nrFollowers; i++) {
            const follower = this.createAgent<Follower>(Follower, x * dbm, y * dbm, z * dbm, cubeRandomSize * 0.3, cubeRandomSize * 0.3, cubeRandomSize * 0.3);
            this.followers.push(follower);
            const c = i / nrFollowers * 255;
            const r = Math.floor(c);
            const g = 50;
            const b = 200;
            this.paths.push(new Path(`rgb(${r},${g},${b})`));
        }
    }

    private createAgent<T>(type: new (x: number, y: number, z: number) => T,
        x: number,
        y: number,
        z: number,
        width: number,
        length: number,
        height: number) {
        return new type(
            x + ((Math.random() - 0.5) * width),
            y + ((Math.random() - 0.5) * length),
            z + ((Math.random() - 0.5) * height)
        );
    }

    private adjustCanvasSize() {
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }

    private render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => { this.render(); });
        this.adjustCanvasSize();
        this.orbitControls.update();
        this.simulateBoids();
        this.recorder.capture(this.renderer.domElement);

        const x = this.camera.position.x;
        const z = this.camera.position.z;
        const rs = 0.001;
        this.camera.position.x = x * Math.cos(rs) + z * Math.sin(rs);
        this.camera.position.z = z * Math.cos(rs) - x * Math.sin(rs);
        this.camera.lookAt(this.scene.position);

    }

    private simulateBoids() {
        this.followers.forEach((i) => {
            i.follow(this.attractors);
        });
        if (this.frameCount % 5 === 0) {
            this.updateBoidPaths();
        }

        if (this.frameCount !== 0 && this.frameCount % 1400 === 0) {
            this.attractors.forEach((i) => {
                const agent = this.createAgent<Attractor>(Attractor, i.position.x, i.position.y, i.position.z, 30, 30, 30);
                this.scene.add(agent);
                this.attractors.push(agent);
            });
        }

        this.attractors.forEach((i, index) => {
            i.runAway(this.followers);
        });
        this.frameCount++;
    }

    private updateBoidPaths() {
        const c: number[] = [];
        this.followers.forEach((i, index) => {
            this.paths[index].addPoint(i.position);
            c.push(...[i.position.x, i.position.y, i.position.z]);
        });
        // this.pointFollowerCache.push(c);
        const d: number[] = [];
        this.attractors.forEach((i) => {
            d.push(...[i.position.x, i.position.y, i.position.z]);
        });
        // this.pointAttractorCache.push(d);
//         const txtFollowers = `${this.pointFollowerCache.pop().map(i => i.toString()).join(',')}
// `;
//         const txtAttractors = `${this.pointAttractorCache.pop().map(i => i.toString()).join(',')}
// `;
//         this.fileSaverFollowers.setTextToSave(txtFollowers);
//         this.fileSaverAttractors.setTextToSave(txtAttractors);
    }

    setupButtons() {
        const $start = document.getElementById('start');
        const $stop = document.getElementById('stop');
        $start.addEventListener('click', e => {
            e.preventDefault();
            this.recorder.start();
            $start.style.display = 'none';
            $stop.style.display = 'block';
        }, false);

        $stop.addEventListener('click', e => {
            e.preventDefault();
            this.recorder.stop();
            $stop.style.display = 'none';
            this.recorder.save();
        }, false);
    }
}

const app = new App();
