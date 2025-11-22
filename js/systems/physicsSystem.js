
// Physics system - applies gravity and velocity to entities

ECS.Systems.physicsSystem = function(entities) {
    Object.values(entities).forEach(entity => {
        // Only process entities with Position and Velocity
        if (!entity.has('Position', 'Velocity')) return;

        const position = entity.Position;
        const velocity = entity.Velocity;

        // Apply gravity if entity has Gravity component
        if (entity.has('Gravity')) {
            const gravity = entity.Gravity;
            velocity.x += gravity.gravity.x;
            velocity.y += gravity.gravity.y;
        }

        // Store last position for rollback if needed
        position.lastPos.x = position.x;
        position.lastPos.y = position.y;

        // Apply velocity to position (will be refined by collision system)
        position.x += velocity.x;
        position.y += velocity.y;
    });
}
