class SaloonScene extends LevelScene {
    constructor(mapXml) {
        super(mapXml);
    }

    init() {
        super.init();

        let outlawLeft = null;
        let outlawRight = null;
    
        // Spawn enemies from map data
        this.map.enemies.forEach(spawn => {
            let enemyEntity = null;
            if (spawn.name === "SaloonOutlaw") {
                enemyEntity = ECS.Blueprints.createSaloonOutlaw(spawn.x, spawn.y);
                enemyEntity.addComponent(new ECS.Components.LooksBackAndForthIntermittently(60 + Math.floor(Math.random() * 60)));
            }
            if (spawn.name === "SaloonOutlawInitial") {
                enemyEntity = ECS.Blueprints.createSaloonOutlaw(spawn.x, spawn.y);

                if(!outlawLeft) {
                    outlawLeft = enemyEntity;
                    enemyEntity.name = "OutlawLeft";
                } else if (!outlawRight) {
                    outlawRight = enemyEntity;
                    enemyEntity.name = "OutlawRight";
                }
            }
            
            if (enemyEntity) {
                this.addEntity(enemyEntity);
            }
        });

        // // find player in ECS entittes and add stunned birds to him
        // ECS.getEntitiesWithComponents('PlayerState').forEach(playerEntity => {
        //     console.log("Adding stunned birds to player");
            
        //     ECS.Helpers.addStunnedBirdsToEntity(playerEntity, this);
        //     console.log("Added stunned birds to player"); 
        // });


        if (Loader.cutscenes && Loader.cutscenes.saloon) {
            this.playCutscene('saloon', { Player: this.player, OutlawLeft: outlawLeft, OutlawRight: outlawRight }, {
                onComplete: () => {
                    let index = 1;
                    this.getEntities().forEach(entity => {
                        if (entity.isSaloonOutlaw) {
                            entity.addComponent(new ECS.Components.SaloonKnifeOutlaw(240 * index + Math.floor(Math.random() * 120)));
                            index++;
                        }
                    });
                }
            });
        }
    }
}
