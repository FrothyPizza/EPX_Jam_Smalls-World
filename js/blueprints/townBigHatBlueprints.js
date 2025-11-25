ECS.Blueprints.createBigHatBoss = function(x, y, scene) {
    const entity = new ECS.Entity();
    entity.addComponent(new ECS.Components.Position(x, y));
    entity.addComponent(new ECS.Components.Dimensions(16, 16));
    entity.addComponent(new ECS.Components.Velocity(0, 0));
    entity.addComponent(new ECS.Components.Gravity(0.1));
    entity.addComponent(new ECS.Components.BigHatBossState());
    entity.addComponent(new ECS.Components.AnimatedSprite(Loader.spriteSheets.BigHat, "Idle", 10));
    entity.addComponent(new ECS.Components.IsEnemy(true));
    entity.addComponent(new ECS.Components.CollidesWithMap(true));
    entity.addComponent(new ECS.Components.MapCollisionState());
    entity.addComponent(new ECS.Components.Hitbox([{x: 0, y: 0, w: 16, h: 16}]));
    entity.addComponent(new ECS.Components.Hurtbox([{x: 2, y: 0, w: 12, h: 16}]));
    
    // Bind Hat
    ECS.Helpers.addBigHatHatToBoss(entity, scene);

    return entity;
}

ECS.Blueprints.createBigHatHat = function(x, y) {
    const entity = new ECS.Entity();
    entity.addComponent(new ECS.Components.Position(x, y));
    entity.addComponent(new ECS.Components.Dimensions(20, 20));
    entity.addComponent(new ECS.Components.BigHatHatState());
    entity.addComponent(new ECS.Components.AnimatedSprite(Loader.spriteSheets.BigHatHat, "Idle", 10));
    entity.addComponent(new ECS.Components.IsEnemy(true));
    entity.addComponent(new ECS.Components.Hitbox([{x: 0, y: 0, w: 20, h: 20}]));
    entity.addComponent(new ECS.Components.Hurtbox([{x: 0, y: 0, w: 20, h: 20}]));
    
    return entity;
}

ECS.Helpers.addBigHatHatToBoss = function(bossEntity, scene) {
    if(!bossEntity.has('BoundEntities')) {
        bossEntity.addComponent(new ECS.Components.BoundEntities());
    }
    
    // Initial offset for the hat on the boss's head
    const offsetX = -2; 
    const offsetY = -12;
    
    const hat = ECS.Blueprints.createBigHatHat(bossEntity.Position.x + offsetX, bossEntity.Position.y + offsetY);
    
    bossEntity.BoundEntities.entitiesWithOffsets.push({
        entity: hat,
        offsetX: offsetX,
        offsetY: offsetY
    });
    
    if (scene) {
        scene.addEntity(hat);
    } else {
        ECS.register(hat);
    }
}



