



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

        const bossCues = {};
        this.map.bossCues.forEach((cue) => {
            bossCues[cue.name] = { x: cue.x, y: cue.y };
        });

        this.map.enemies.forEach((spawn) => {
            let enemyEntity = null;
            if (spawn.name === "BigHat") {
                enemyEntity = ECS.Blueprints.createBigHatBoss(spawn.x, spawn.y, this, bossCues);
            }
            if (enemyEntity) {
                this.addEntity(enemyEntity);
            }
        });

    }

    update() {
        super.update();

        // check if boss state has 0 health
        ECS.getEntitiesWithComponents('BigHatBossState').forEach(bossEntity => {
            if(bossEntity.BigHatBossState.health <= 0 && !(bossEntity.BigHatBossState.state == 'DEFEATED')) {
                bossEntity.BigHatBossState.state = 'DEFEATED';

                console.log("Big Hat defeated!");

                // play cutscene here (boss defeated)
                // this.playCutscene('BigHatDefeat', { boss: bossEntity }, { shouldSave: true });
            }
        });
    }

    updateLevelSpecificSystems() {
        ECS.Systems.bigHatBossSystem(this.getEntities());
        ECS.Systems.bigHatHatSystem(this.getEntities());
        ECS.Systems.bigHatProjectileSystem(this.getEntities());
    }
}


