


ECS.Components.BigHatBossState = class BigHatBossState {
    constructor() {
        this.state = "IDLE"; // IDLE, ATTACK, VULNERABLE, DEAD


    }
}


ECS.Components.BigHatHatState = class BigHatHatState {
    constructor() {
        this.state = "ATTACHED"; // ATTACHED, THROWN, RETURNING
    }
}