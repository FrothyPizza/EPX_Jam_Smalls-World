



ECS.Blueprints.createSaloonOutlaw = function(x, y) {
    let entity = new ECS.Entity();

    entity.addComponent(new ECS.Components.Position(x, y));
    entity.addComponent(new ECS.Components.Velocity(0, 0));


    entity.addComponent(new ECS.Components.Dimensions(32, 24));

    entity.addComponent(new ECS.Components.CollidesWithMap(true));
    entity.addComponent(new ECS.Components.MapCollisionState());
    entity.addComponent(new ECS.Components.Hitbox([{x: 0, y: 0, w: 8, h: 8}]));
    entity.addComponent(new ECS.Components.Hurtbox([{x: 0, y: 0, w: 8, h: 8}]));

    const sprite = new ECS.Components.AnimatedSprite(
        Loader.spriteSheets.Theo, 
        "Idle", 
        8
    );

    

    entity.addComponent(sprite);
    return entity;
}