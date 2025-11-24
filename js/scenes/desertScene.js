/**
 * Guys spawn at edges in the 5 spawner locations (2 on left side, 3 on right side)
 * 
 * Knife guys just run at you
 * Gun guys strafe back and forth and shoot ocassionally
 * 
 * White hat guys come from left side
 * Black hat guys come from right side (left spawners are called EnemySpawnerMiddleLeft, EnemySpawnerMiddleRight, EnemySpawnerBottomRight, ...) so we can use the substring "Left" or "Right" to determine which side they come from
 * Guys that spawn on the right side face left, guys that spawn on the left side face right
 * 
 * The spawners are each only allowed to have 1 enemy active at a time (which is why we keep track of enemyIDsThatISpawned)
 * 
 * 
 * start spawning stars with a particle system or something
 * sunset gradually darkens the screen (overlay a semi-transparent black rectangle on top of everything)
 */

class DesertScene extends LevelScene {
    constructor(mapXml) {
        super(mapXml);

        this.totalFrames = 3600; // 1 minute at 60 FPS
        this.framesToCompletion = this.totalFrames; // 1 minute at 60 FPS

        this.spawners = [];
    }

    init() {
        super.init();
        
        this.map.enemies.forEach((spawn) => {
            // if name starts with EnemySpawner, add to spawners with name and position
            if (spawn.name.startsWith("EnemySpawner")) {
                this.spawners.push({
                    name: spawn.name,
                    x: spawn.x,
                    y: spawn.y,
                    enemyIDsThatISpawned: [],
                    spawnDelayFrames: 120,
                    framesUntilNextSpawn: 120
                });
            }
        });

        // find player and add whip and gun
        ECS.getEntitiesWithComponents('PlayerState').forEach(playerEntity => {
            playerEntity.PlayerState.hasCollectedGun = true;
            playerEntity.PlayerState.hasCollectedLasso = true;
            let weapon = ECS.Helpers.addWeaponToPlayer(playerEntity, 'Gun');
            let lasso = ECS.Helpers.addWeaponToPlayer(playerEntity, 'Lasso');
            this.addEntity(weapon);
            this.addEntity(lasso);
        });

        console.log("DesertScene spawners:", this.spawners);

        


    }

    update() {
        super.update();

        // Decrease frames to completion to update background darkening
        if (this.framesToCompletion > 0) {
            this.framesToCompletion--;
        } else {
            // scene is over here
            // ...
        }
        CONSTANTS.BACKGROUND_COLOR_DARKEN_ALPHA = Math.min(CONSTANTS.BACKGROUND_COLOR_DARKEN_ALPHA_MAX, 
            CONSTANTS.BACKGROUND_COLOR_DARKEN_ALPHA_MAX * (1 - this.framesToCompletion / this.totalFrames));


        // Handle enemy spawning
        let totalActiveEnemies = 0;
        this.spawners.forEach(spawner => {
            // check for entities that were spawned by this spawner and are now removed from the scene
            spawner.enemyIDsThatISpawned = spawner.enemyIDsThatISpawned.filter(enemyID => {
                return ECS.entities[enemyID];
            });
            totalActiveEnemies += spawner.enemyIDsThatISpawned.length;
        });

        this.spawners.forEach(spawner => {
            if (spawner.framesUntilNextSpawn > 0) {
                spawner.framesUntilNextSpawn--;
            } else if (spawner.enemyIDsThatISpawned.length === 0) {
                if (totalActiveEnemies >= 3) return;

                // Spawn an enemy
                let isLeftSpawner = spawner.name.includes("Left");
                let facingLeft = !isLeftSpawner; // Right spawners face left, Left spawners face right
                
                let spawnGunner = Math.random() > 0.5;
                
                let enemyEntity;
                if (spawnGunner) {
                    enemyEntity = ECS.Blueprints.createDesertGunOutlaw(spawner.x, spawner.y, facingLeft);
                } else {
                    enemyEntity = ECS.Blueprints.createDesertKnifeOutlaw(spawner.x, spawner.y, facingLeft);
                }
                
                this.addEntity(enemyEntity);
                spawner.enemyIDsThatISpawned.push(enemyEntity.id);
                spawner.framesUntilNextSpawn = spawner.spawnDelayFrames;
                totalActiveEnemies++;

                console.log(`Spawned ${spawnGunner ? 'Gunner' : 'Knife'} at ${spawner.name} (ID: ${enemyEntity.id})`);
            }
        });
        
    }

    updateLevelSpecificSystems() {
        ECS.Systems.DesertEnemySystem(this.entities);
    }
}