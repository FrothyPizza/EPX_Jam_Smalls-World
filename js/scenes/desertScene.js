/**
 * Guys spawn at edges in the 5 spawner locations (2 on left side, 3 on right side)
 * 
 * Knife guys just run at you
 * Gun guys strafe back and forth and shoot ocassionally
 * 
 * White hat guys come from left side
 * Black hat guys come from right side
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
                    y: spawn.y
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


        
    }
}