
/*
/**
 * Bound Entities Component; entities stored in this component will have their positions
 * bound to the parent entity's position.
 * 
 * Pass in entitiesWithOffsets as an array of objects with the following structure:
 * [
 *   { entity: <ECS.Entity>, offsetX: <number>, offsetY: <number> },
 *   ...
 * ]
 */


ECS.Systems.boundEntitySystem = function(entities) {
    Object.values(entities).forEach(entity => {
        // Only process entities with BoundEntities component
        if (!entity.has('BoundEntities', 'Position')) return;
        const boundEntitiesComp = entity.BoundEntities;
        const parentPosition = entity.Position;

        boundEntitiesComp.entitiesWithOffsets.forEach(boundObj => {
            if(!boundObj.entity) return;

            const boundEntity = boundObj.entity;
            const offsetX = typeof boundObj.offsetX === 'number' ? boundObj.offsetX : 0;
            const offsetY = typeof boundObj.offsetY === 'number' ? boundObj.offsetY : 0;
            if (boundEntity.has('Position')) {
                boundEntity.Position.x = parentPosition.x + offsetX;
                boundEntity.Position.y = parentPosition.y + offsetY;
            }
        });
    });
}
        