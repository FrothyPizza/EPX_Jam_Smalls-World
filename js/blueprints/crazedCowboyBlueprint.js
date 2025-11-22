ECS.Blueprints.CrazedCowboy = function(x, y) {
    let entity = new ECS.Entity();
    entity.addComponent(new ECS.Components.Position(x, y));
    entity.addComponent(new ECS.Components.Velocity(0, 0));
    entity.addComponent(new ECS.Components.Gravity());
    entity.addComponent(new ECS.Components.Dimensions(32, 32)); // Placeholder dimensions
    entity.addComponent(new ECS.Components.BossState());
    entity.addComponent(new ECS.Components.BossHealth(500));
    entity.addComponent(new ECS.Components.CrazedCowboy());
    entity.addComponent(new ECS.Components.IsEnemy(true));
    entity.addComponent(new ECS.Components.CollidesWithMap(true));
    entity.addComponent(new ECS.Components.MapCollisionState());
    
    // Add sprite if available, otherwise placeholder
    // entity.addComponent(new ECS.Components.Sprite(Loader.images['cowboy'], 32, 32)); 

    return entity;
}
