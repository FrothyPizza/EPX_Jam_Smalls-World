ECS.Systems.bigHatBossSystem = function(entities) {
    entities.forEach(entity => {
        if (entity.has('BigHatBossState')) {
            const state = entity.BigHatBossState;

            if(entity.has('Stunned')) {
                state.state = "STUNNED";
            } else {
                // If not stunned, revert to IDLE if currently stunned
                if(state.state === "STUNNED") {
                    state.state = "IDLE";
                }
            }

            // Basic state machine placeholder
            switch (state.state) {
                case "IDLE":
                    // --- Strafing Logic ---
                    state.strafeTimer++;
                    
                    if (state.isStrafing) {
                        entity.AnimatedSprite.setAnimation("Run");

                        if (entity.has('Velocity')) {
                            entity.Velocity.x = state.strafeDirection * state.strafeSpeed;
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

                        entity.AnimatedSprite.setAnimation("Idle");

                        
                        if (state.strafeTimer >= state.strafePauseDuration) {
                            state.isStrafing = true;
                            state.strafeTimer = 0;
                            state.strafeDirection *= -1; // Switch direction
                        }
                    }

                    // --- Level Jumping Logic ---
                    if (!state.isJumpWarning) {
                        state.jumpTimer++;
                        if (state.jumpTimer >= state.jumpInterval) {
                            // Pick a random level (0, 1, 2)
                            let targetLevel = Math.floor(Math.random() * 3);
                            
                            // Prevent jumping more than 1 level at a time
                            // If current is 0 (bottom), can only go to 1 (middle)
                            // If current is 2 (top), can only go to 1 (middle)
                            // If current is 1 (middle), can go to 0 or 2
                            
                            if (Math.abs(targetLevel - state.currentLevel) > 1) {
                                // If trying to jump 2 levels, force it to middle (1)
                                targetLevel = 1;
                            }

                            if (targetLevel !== state.currentLevel) {
                                state.jumpTimer = 0;
                                state.isJumpWarning = true;
                                state.targetLevel = targetLevel;
                                state.jumpWarningTimer = 0;

                                // Spawn exclamation at target level cue
                                let cueName = "";
                                if (targetLevel === 0) cueName = "bottom";
                                if (targetLevel === 1) cueName = "middle";
                                if (targetLevel === 2) cueName = "top";

                                if (state.bossCues && state.bossCues[cueName]) {
                                    const cue = state.bossCues[cueName];
                                    // Spawn exclamation
                                    const exclamation = ECS.Blueprints.createExclamation(cue.x, cue.y);
                                    if (GlobalState.currentScene) {
                                        GlobalState.currentScene.addEntity(exclamation);
                                    }
                                    state.jumpExclamationEntity = exclamation;
                                }
                            }
                        }
                    } else {
                        // In warning state
                        state.jumpWarningTimer++;
                        if (state.jumpWarningTimer >= state.jumpWarningDuration) {
                            state.isJumpWarning = false;
                            
                            // Remove exclamation
                            if (state.jumpExclamationEntity) {
                                if (GlobalState.currentScene) {
                                    GlobalState.currentScene.removeEntity(state.jumpExclamationEntity.id);
                                } else {
                                    ECS.removeEntity(state.jumpExclamationEntity.id);
                                }
                                state.jumpExclamationEntity = null;
                            }

                            // Perform Jump
                            const targetLevel = state.targetLevel;
                            if (targetLevel > state.currentLevel) {
                                // Jump Up
                                if (entity.has('Velocity')) {
                                    entity.Velocity.y = -2.8;
                                }
                                state.currentLevel = targetLevel; 
                            } else if (targetLevel < state.currentLevel) {
                                // Fall Down
                                if (entity.has('Position')) {
                                    entity.Position.y += 2; // Clip through floor
                                }
                                state.currentLevel = targetLevel; 
                            }
                        }
                    }

                    // --- Hat Burst Logic ---
                    if (!state.isWarning && !state.isBursting) {
                        state.burstTimer++;
                        if (state.burstTimer >= state.burstInterval) {
                            state.isWarning = true;
                            state.warningTimer = 0;
                            
                            // Add exclamation to the left
                            const exX = entity.Position.x - 12;
                            const exY = entity.Position.y;
                            const exclamation = ECS.Blueprints.createExclamation(exX, exY);
                            
                            if (GlobalState.currentScene) {
                                GlobalState.currentScene.addEntity(exclamation);
                            }
                            
                            // Bind it so it moves with boss
                            if(!entity.has('BoundEntities')) {
                                entity.addComponent(new ECS.Components.BoundEntities());
                            }
                            entity.BoundEntities.entitiesWithOffsets.push({ 
                                entity: exclamation, 
                                offsetX: -12, 
                                offsetY: 0 
                            });
                            
                            state.exclamationEntity = exclamation;
                        }
                    } else if (state.isWarning) {
                        state.warningTimer++;
                        if (state.warningTimer >= state.warningDuration) {
                            state.isWarning = false;
                            state.isBursting = true;
                            state.burstCurrentCount = 0;
                            state.burstDelayTimer = state.burstDelay; // Ready to fire immediately
                            
                            // Remove exclamation
                            if (state.exclamationEntity) {
                                if (GlobalState.currentScene) {
                                    GlobalState.currentScene.removeEntity(state.exclamationEntity.id);
                                } else {
                                    ECS.removeEntity(state.exclamationEntity.id);
                                }
                                // Remove from bound entities
                                if (entity.has('BoundEntities')) {
                                    entity.BoundEntities.entitiesWithOffsets = entity.BoundEntities.entitiesWithOffsets.filter(
                                        b => b.entity.id !== state.exclamationEntity.id
                                    );
                                }
                                state.exclamationEntity = null;
                            }
                        }
                    } else if (state.isBursting) {
                        state.burstDelayTimer++;
                        if (state.burstDelayTimer >= state.burstDelay) {
                            state.burstDelayTimer = 0;
                            
                            // Throw Hat
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
                            
                            state.burstCurrentCount++;
                            if (state.burstCurrentCount >= state.burstCount) {
                                state.isBursting = false;
                                state.burstTimer = 0;
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
                case "STUNNED":
                    // Stunned behavior
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