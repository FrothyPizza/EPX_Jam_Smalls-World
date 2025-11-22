
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
    // Logic for Crazed Cowboy
    let state = entity.BossState;
    let cowboy = entity.CrazedCowboy;

    // Example logic
    if (state.state === "IDLE") {
        state.timer++;
        if (state.timer > 60) {
            state.state = "ATTACK";
            state.timer = 0;
        }
    } else if (state.state === "ATTACK") {
        cowboy.shootTimer++;
        if (cowboy.shootTimer > cowboy.shootCooldown) {
            // Shoot logic here (e.g., spawn projectile)
            console.log("Cowboy shoots!");
            cowboy.shootTimer = 0;
            state.state = "IDLE";
        }
    }
}
