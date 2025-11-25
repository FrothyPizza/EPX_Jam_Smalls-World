ECS.Components.BigHatBossState = class BigHatBossState {
    constructor() {
        this.state = "IDLE"; // IDLE, ATTACK, VULNERABLE, DEAD

        // Strafe params
        this.strafeTimer = 0;
        this.strafeDuration = 90;
        this.strafePauseDuration = 90;
        this.strafeDirection = 1; // 1 for right, -1 for left
        this.strafeSpeed = 0.25;
        this.isStrafing = true; 

        // Level jump params
        this.currentLevel = 0; // 0: bottom, 1: middle, 2: top
        this.jumpTimer = 0;
        this.jumpInterval = 120; // Check for jump every 2 seconds
        this.isJumpWarning = false;
        this.jumpWarningTimer = 0;
        this.jumpWarningDuration = 60;
        this.targetLevel = -1;
        this.jumpExclamationEntity = null;
        this.bossCues = {};

        // Hat Burst params
        this.burstTimer = 0;
        this.burstInterval = 180; // 3 seconds between bursts
        this.isWarning = false;
        this.warningTimer = 0;
        this.warningDuration = 60; // 1 second warning
        this.isBursting = false;
        this.burstCount = 3;
        this.burstCurrentCount = 0;
        this.burstDelay = 15; // Frames between hats in a burst
        this.burstDelayTimer = 0;
        this.exclamationEntity = null;

        this.initialHealth = 6;
        this.health = this.initialHealth;
        this.phase = 1; // 1, 2, 3
    }
}


ECS.Components.BigHatHatState = class BigHatHatState {
    constructor() {
        this.state = "ATTACHED"; // ATTACHED, THROWN, RETURNING
    }
}


ECS.Components.BigHatSmallHatProjectile = class BigHatSmallHatProjectile {
    constructor() {
        this.state = "FLYING"; // FLYING, STUNNED, RETURNING
    }
}


ECS.Components.BigHatStunned = class BigHatStunned {
    constructor() {
        this.isStunned = true;
    }
}