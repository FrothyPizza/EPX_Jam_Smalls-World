

ECS.Blueprints.createStunnedBirds = function(x, y) {
    let entity = new ECS.Entity();
    entity.addComponent(new ECS.Components.Position(x, y));

    entity.addComponent(new ECS.Components.AnimatedSprite(
        Loader.spriteSheets.StunnedBirds, 
        "Idle", 
        8
    ));
    entity.addComponent(new ECS.Components.Dimensions(8, 8));

    return entity;
}




ECS.Helpers.addStunnedBirdsToEntity = function(entity, scene) {
    if(!entity.has('BoundEntities')) {
        entity.addComponent(new ECS.Components.BoundEntities());
    }

    const boundEntities = entity.BoundEntities;
    const offsetX = 0;
    const offsetY = -8;
    const birds = ECS.Blueprints.createStunnedBirds(entity.Position.x + offsetX, entity.Position.y + offsetY);
    boundEntities.entitiesWithOffsets.push({ entity: birds, offsetX: offsetX, offsetY: offsetY });

    console.log("Adding stunned birds to entity", entity, "birds entity:", birds);

    if (scene && typeof scene.addEntity === 'function') {
        scene.addEntity(birds);
    } else {
        ECS.register(birds);
    }

    return birds;

}