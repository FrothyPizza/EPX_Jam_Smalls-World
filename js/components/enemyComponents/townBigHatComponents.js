


ECS.Components.BigHatBossState = class BigHatBossState {
    constructor() {
        this.state = "IDLE"; // IDLE, ATTACK, VULNERABLE, DEAD

        // Strafe params
        this.strafeTimer = 0;
        this.strafeDuration = 30;
        this.strafePauseDuration = 30;
        this.strafeDirection = 1; // 1 for right, -1 for left
        this.isStrafing = true; 

        // Level jump params
        this.currentLevel = 0; // 0: bottom, 1: middle, 2: top
        this.jumpTimer = 0;
        this.jumpInterval = 120; // Check for jump every 2 seconds
    }
}


ECS.Components.BigHatHatState = class BigHatHatState {
    constructor() {
        this.state = "ATTACHED"; // ATTACHED, THROWN, RETURNING
    }
}