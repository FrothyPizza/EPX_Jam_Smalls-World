


ECS.Components.IsEnemy = class IsEnemy {
    constructor(isEnemy = true) {
        this.isEnemy = isEnemy;
    }
}

ECS.Components.DamagesPlayer = class DamagesPlayer {
    constructor(damage = 10) {
        this.damage = damage;
    }
}

ECS.Components.EnemyHealth = class EnemyHealth {
    constructor(maxHealth = 50) {
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
    }
}
