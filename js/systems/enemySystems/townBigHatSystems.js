ECS.Systems.bigHatBossSystem = function(entities) {
    entities.forEach(entity => {
        if (entity.has('BigHatBossState')) {
            // Initial behavior logic
            const state = entity.BigHatBossState;
            
            // Basic state machine placeholder
            switch (state.state) {
                case "IDLE":
                    // Idle behavior
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