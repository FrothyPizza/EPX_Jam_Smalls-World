
// Components for game-specific state and flags

ECS.Components.Dead = class Dead {
    constructor(dead = false) {
        this.dead = dead;
    }
}

ECS.Components.RemoveFromScene = class RemoveFromScene {
    constructor(remove = false) {
        this.remove = remove;
    }
}

ECS.Components.IsEnemy = class IsEnemy {
    constructor(isEnemy = false) {
        this.isEnemy = isEnemy;
    }
}

ECS.Components.CollidesWithMap = class CollidesWithMap {
    constructor(collides = true) {
        this.collides = collides;
    }
}

ECS.Components.MapCollisionState = class MapCollisionState {
    constructor() {
        this.bottomHit = false; // touching the ground
        this.topHit = false;    // hitting ceiling
        this.leftHit = false;   // touching left wall
        this.rightHit = false;  // touching right wall
    }
}
