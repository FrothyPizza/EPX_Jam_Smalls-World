



class TownBigHatScene extends LevelScene {
    constructor(mapXml) {
        super(mapXml);

    }

    init() {
        super.init();

        ECS.getEntitiesWithComponents('PlayerState').forEach(playerEntity => {
            playerEntity.PlayerState.hasCollectedGun = true;
            playerEntity.PlayerState.hasCollectedLasso = true;
            let weapon = ECS.Helpers.addWeaponToPlayer(playerEntity, 'Gun');
            let lasso = ECS.Helpers.addWeaponToPlayer(playerEntity, 'Lasso');
            this.addEntity(weapon);
            this.addEntity(lasso);
        });

        this.map.enemies.forEach((spawn) => {
            let enemyEntity = null;
            if (spawn.name === "BigHat") {
                enemyEntity = ECS.Blueprints.createBigHatBoss(spawn.x, spawn.y, this);
            }
            if (enemyEntity) {
                this.addEntity(enemyEntity);
            }
        });
    }

    updateLevelSpecificSystems() {
        ECS.Systems.bigHatBossSystem(this.getEntities());
        ECS.Systems.bigHatHatSystem(this.getEntities());
        ECS.Systems.bigHatProjectileSystem(this.getEntities());
    }
}


