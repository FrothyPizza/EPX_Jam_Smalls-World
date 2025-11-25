



class TownBigHatScene extends LevelScene {
    constructor(mapXml) {
        super(mapXml);

    }

    init() {
        super.init();

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
    }
}


