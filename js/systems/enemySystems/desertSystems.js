ECS.Systems.DesertEnemySystem = function(entities) {
    ECS.getEntitiesWithComponents('DesertKnifeOutlaw').forEach(entity => {
        if (entity.has('Stunned')) return;

        const speed = entity.DesertKnifeOutlaw.runSpeed;
        const players = ECS.getEntitiesWithComponents('PlayerState');
        if (players.length > 0) {
            const player = players[0];
            const dir = Math.sign(player.Position.x - entity.Position.x);
            
            if (dir !== 0) {
                entity.Velocity.x = dir * speed;
                entity.AnimatedSprite.flipX = dir < 0;
            }
        }
    });

    ECS.getEntitiesWithComponents('DesertGunOutlaw').forEach(entity => {
        if (entity.has('Stunned')) return;

        const gunner = entity.DesertGunOutlaw;
        
        // Strafe logic
        if (Math.abs(entity.Position.x - gunner.startX) > gunner.strafeDistance) {
            gunner.direction *= -1;
        }
        entity.Velocity.x = 0.5 * gunner.direction;
        
        const players = ECS.getEntitiesWithComponents('PlayerState');
        if (players.length > 0) {
            const player = players[0];
            entity.AnimatedSprite.flipX = player.Position.x < entity.Position.x;
        }

        // Shoot logic
        if (gunner.shootTimer > 0) {
            gunner.shootTimer--;
        } else {
            gunner.shootTimer = gunner.shootInterval;
            
            const dir = entity.AnimatedSprite.flipX ? -1 : 1;
            const bullet = ECS.Blueprints.createDesertBullet(entity.Position.x, entity.Position.y + 4, dir, 2);
            GlobalState.currentScene.addEntity(bullet);
            Loader.playSound("powerup.wav", 0.5);
            // Play sound here
        }
    });
}
