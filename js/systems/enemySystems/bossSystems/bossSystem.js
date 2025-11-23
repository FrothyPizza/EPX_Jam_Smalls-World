
ECS.Systems.bossSystem = function(entities) {
    Object.values(entities).forEach(entity => {
        if (entity.has("BossState", "BossHealth")) {
            // Generic boss logic or delegation
            if (entity.has("CrazedCowboy")) {
                handleCrazedCowboy(entity);
            }
        }
    });
}

function handleCrazedCowboy(entity) {
    let state = entity.BossState;
    let cowboy = entity.CrazedCowboy;
    let position = entity.Position;
    let velocity = entity.Velocity;

    // Update Phase based on Health
    if (entity.BossHealth.value <= 5) {
        cowboy.phase = 3;
    } else if (entity.BossHealth.value <= 10) {
        cowboy.phase = 2;
    } else {
        cowboy.phase = 1;
    }

    if (cowboy.state === "INACTIVE") {
        return;
    }

    if (cowboy.state === "IDLE") {
        velocity.x = 0;
        state.timer++;
        if (state.timer > 60) {
            cowboy.state = "STRAFE";
            state.timer = 0;
            // Pick a random direction or flip current
            cowboy.strafeDirection = Math.random() > 0.5 ? 1 : -1;
            cowboy.strafeTimer = 0;
        }
    } else if (cowboy.state === "STRAFE") {
        velocity.x = cowboy.strafeDirection * 0.5; // Speed
        cowboy.strafeTimer++;

        // Simple bounds check (adjust as needed for the map)
        // Assuming map width is roughly known or we check collisions
        // For now, just reverse if hitting a "wall" logic could be added here
        // But let's just rely on timer for direction change or map collision system to stop him
        
        if (entity.MapCollisionState && (entity.MapCollisionState.left || entity.MapCollisionState.right)) {
             cowboy.strafeDirection *= -1;
        }

        if (cowboy.strafeTimer > cowboy.strafeDuration) {
            cowboy.state = "ATTACK";
            cowboy.strafeTimer = 0;
            cowboy.bottlesThrown = 0;
            cowboy.bottlesToThrow = cowboy.phase; // 1, 2, or 3 bottles
            cowboy.attackTimer = 0;
            velocity.x = 0;
        }
    } else if (cowboy.state === "ATTACK") {
        velocity.x = 0;
        cowboy.attackTimer++;

        if (cowboy.attackTimer > cowboy.throwCooldown) {
            if (cowboy.bottlesThrown < cowboy.bottlesToThrow) {
                spawnBottle(entity);
                cowboy.bottlesThrown++;
                cowboy.attackTimer = 0;
            } else {
                cowboy.state = "IDLE";
                state.timer = 0;
            }
        }
    }
}

function spawnBottle(bossEntity) {
    // Create a bottle projectile
    // We need a blueprint for this, or just create it here
    let bottle = new ECS.Entity();
    let startX = bossEntity.Position.x;
    let startY = bossEntity.Position.y;
    
    // Aim at player if possible, or just random arc
    let player = null;
    if (GlobalState.sceneManager && GlobalState.sceneManager.currentScene) {
        player = GlobalState.sceneManager.currentScene.player;
    }
    
    let targetX = startX + (bossEntity.CrazedCowboy.strafeDirection * 100); // Default target
    let targetY = startY;

    if (player) {
        targetX = player.Position.x;
        targetY = player.Position.y;
    }

    let dx = targetX - startX;
    let dy = targetY - startY;
    
    // Simple arc physics
    let speed = 4;
    let angle = Math.atan2(dy, dx);
    
    bottle.addComponent(new ECS.Components.Position(startX, startY));
    bottle.addComponent(new ECS.Components.Velocity(Math.cos(angle) * speed, Math.sin(angle) * speed - 3)); // Upward arc
    bottle.addComponent(new ECS.Components.Gravity());
    bottle.addComponent(new ECS.Components.Dimensions(16, 16));
    bottle.addComponent(new ECS.Components.AnimatedSprite(
        Loader.spriteSheets.StunnedBirds,
        "Idle",
        12
    ));

    // Add to scene
    if (GlobalState.sceneManager && GlobalState.sceneManager.currentScene) {
        GlobalState.sceneManager.currentScene.addEntity(bottle);
    }
}
