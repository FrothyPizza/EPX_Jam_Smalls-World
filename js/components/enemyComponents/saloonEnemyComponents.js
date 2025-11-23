

/** 
 * saloon knife outlaw pops out after a predefined time.
 * Then, after a delay, it dashes toward the player (slowly).
 * 
 * If a saloon outlaw hits a wall, it stops moving, then after a delay, starts dashing at the player again if they are within range.
 */
ECS.Components.SaloonKnifeOutlaw = class SaloonKnifeOutlaw {
    constructor(timeTillPopOut) {
        this.timeTillPopOut = timeTillPopOut;
        this.hasPoppedOut = false;
        this.timeToWaitToStartDashing = 60;

        this.dashDetectionRange = 32;

        this.dashSpeed = 0.5;
    }
}