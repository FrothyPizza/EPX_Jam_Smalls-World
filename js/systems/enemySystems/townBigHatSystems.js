ECS.Systems.bigHatBossSystem = function(entities) {
    entities.forEach(entity => {
        if (entity.has('BigHatBossState')) {
            const state = entity.BigHatBossState;
            
            // Basic state machine placeholder
            switch (state.state) {
                case "IDLE":
                    // --- Strafing Logic ---
                    state.strafeTimer++;
                    
                    if (state.isStrafing) {
                        if (entity.has('Velocity')) {
                            entity.Velocity.x = state.strafeDirection * 0.5;
                        }
                        
                        if (state.strafeTimer >= state.strafeDuration) {
                            state.isStrafing = false;
                            state.strafeTimer = 0;
                            if (entity.has('Velocity')) {
                                entity.Velocity.x = 0;
                            }
                        }
                    } else {
                        // Paused
                        if (entity.has('Velocity')) {
                            entity.Velocity.x = 0;
                        }
                        
                        if (state.strafeTimer >= state.strafePauseDuration) {
                            state.isStrafing = true;
                            state.strafeTimer = 0;
                            state.strafeDirection *= -1; // Switch direction
                        }
                    }

                    // --- Level Jumping Logic ---
                    state.jumpTimer++;
                    if (state.jumpTimer >= state.jumpInterval) {
                        state.jumpTimer = 0;
                        
                        // Pick a random level (0, 1, 2)
                        const targetLevel = Math.floor(Math.random() * 3);
                        
                        if (targetLevel > state.currentLevel) {
                            // Jump Up
                            if (entity.has('Velocity')) {
                                entity.Velocity.y = -2.8;
                            }
                            state.currentLevel++; // Assume we made it
                        } else if (targetLevel < state.currentLevel) {
                            // Fall Down
                            if (entity.has('Position')) {
                                entity.Position.y += 2; // Clip through floor
                            }
                            state.currentLevel--; // Assume we made it
                        }
                        // If targetLevel == currentLevel, do nothing
                    }

                    // --- Hat Throwing Logic ---
                    // Randomly throw hats
                    if (Math.random() < 0.01) { // 1% chance per frame
                        const players = ECS.getEntitiesWithComponents('PlayerState');
                        if (players.length > 0) {
                            const player = players[0];
                            const dx = player.Position.x - entity.Position.x;
                            const dy = player.Position.y - entity.Position.y;
                            const dist = Math.sqrt(dx*dx + dy*dy);
                            
                            const speed = 2;
                            const vx = (dx / dist) * speed;
                            const vy = (dy / dist) * speed;
                            
                            const projectile = ECS.Blueprints.createBigHatSmallHatProjectile(entity.Position.x, entity.Position.y, vx, vy);
                            if (GlobalState.currentScene) {
                                GlobalState.currentScene.addEntity(projectile);
                            }
                        }
                    }
                    break;
                    
                case "ATTACK":
                    // Attack behavior
                    break;
                case "VULNERABLE":
                    // Vulnerable behavior
                    break;
                case "DEAD":
                    // Dead behavior
                    break;
            }
        }
    });
}

ECS.Systems.bigHatHatSystem = function(entities) {
    entities.forEach(entity => {
        if (entity.has('BigHatHatState')) {
            // Initial behavior logic
            const state = entity.BigHatHatState;
            
            // Basic state machine placeholder
            switch (state.state) {
                case "ATTACHED":
                    // Behavior when attached to boss
                    break;
                case "THROWN":
                    // Behavior when thrown
                    break;
                case "RETURNING":
                    // Behavior when returning to boss
                    break;
            }
        }
    });
}

ECS.Systems.bigHatProjectileSystem = function(entities) {
    entities.forEach(entity => {
        if (entity.has('BigHatSmallHatProjectile')) {
            // If stunned, ensure velocity is 0 (redundant safety)
            if (entity.has('BigHatStunned')) {
                entity.Velocity.x = 0;
                entity.Velocity.y = 0;
            }
        }
    });
}