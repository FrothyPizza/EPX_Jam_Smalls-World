ECS.Components.CrazedCowboy = class CrazedCowboy {
    constructor(params = {}) {
        this.phase = params.phase || 1; // 1, 2, 3
        this.state = params.state || "IDLE"; // IDLE, STRAFE, ATTACK, STUNNED, INACTIVE
        this.strafeDirection = params.strafeDirection || 1; // 1 for right, -1 for left
        this.strafeTimer = 0;
        this.strafeDuration = 40; // How long to strafe before attacking
        
        this.attackTimer = 0;
        this.bottlesThrown = 0;
        this.bottlesToThrow = 0; // Set based on phase
        this.throwCooldown = 30; // Frames between throws in a volley
        
        this.health = params.health || 15;
        this.maxHealth = params.maxHealth || 15;
    }
}


