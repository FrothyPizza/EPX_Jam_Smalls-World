ECS.Blueprints.CrazedCowboy = function(x, y, initialState = "IDLE") {
    let entity = new ECS.Entity();
    entity.addComponent(new ECS.Components.Position(x, y));
    entity.addComponent(new ECS.Components.Velocity(0, 0));
    entity.addComponent(new ECS.Components.Gravity());
    entity.addComponent(new ECS.Components.Dimensions(16, 16)); // Placeholder dimensions
    entity.addComponent(new ECS.Components.BossState());
    entity.addComponent(new ECS.Components.BossHealth(15));
    entity.addComponent(new ECS.Components.CrazedCowboy({
        phase: 1,
        health: 15,
        maxHealth: 15,
        state: initialState
    }));
    entity.addComponent(new ECS.Components.IsEnemy(true));
    entity.addComponent(new ECS.Components.CollidesWithMap(true));
    entity.addComponent(new ECS.Components.MapCollisionState());
    entity.addComponent(new ECS.Components.AnimatedSprite(
        Loader.spriteSheets.MadSheriff, 
        "Idle", 
        6
    ));
    
    return entity;
}
