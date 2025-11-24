ECS.Components.DesertKnifeOutlaw = class DesertKnifeOutlaw {
    constructor() {
        this.runSpeed = 1.0;
    }
}

ECS.Components.DesertGunOutlaw = class DesertGunOutlaw {
    constructor() {
        this.strafeDistance = 16;
        this.startX = 0; // Will be set when initialized
        this.direction = 1;
        this.shootTimer = 0;
        this.shootInterval = 120; // Shoot every 2 seconds
    }
}

ECS.Components.SpawnSide = class SpawnSide {
    constructor(side = 'left') {
        this.side = side;
    }
}
