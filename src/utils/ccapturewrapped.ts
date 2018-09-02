
declare var CCapture: any;

export class CCaptureWrapped {

    private readonly cc: any;

    constructor(config: CCaptureConfig) {
        this.cc = new CCapture(config);
    }

    capture(t: any) {
        this.cc.capture(t);
    }

    on(t: any, e: any) {
        this.cc.on(t, e);
    }

    save(t?: any) {
        this.cc.save(t);
    }

    start() {
        this.cc.start();
    }

    stop() {
        this.cc.stop();
    }
}

interface CCaptureConfig {
    verbose: boolean;
    display: boolean;
    framerate: number;
    quality: number;
    format: string;
    timeLimit: number;
    frameLimit: number;
    autoSaveTime: number;
}
