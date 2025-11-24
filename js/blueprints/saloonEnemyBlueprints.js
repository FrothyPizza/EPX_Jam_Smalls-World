



ECS.Blueprints.createSaloonOutlaw = function(x, y) {
    let entity = new ECS.Entity();

    entity.addComponent(new ECS.Components.Position(x, y));
    entity.addComponent(new ECS.Components.Velocity(0, 0));
    entity.addComponent(new ECS.Components.Gravity());


    entity.addComponent(new ECS.Components.Dimensions(8, 8));

    entity.addComponent(new ECS.Components.CollidesWithMap(true));
    entity.addComponent(new ECS.Components.MapCollisionState());
    entity.addComponent(new ECS.Components.Hitbox([{x: 0, y: 0, w: 8, h: 8}]));
    entity.addComponent(new ECS.Components.Hurtbox([{x: 1, y: 1, w: 6, h: 6}]));

    entity.addComponent(new ECS.Components.IsEnemy(true));
    entity.addComponent(new ECS.Components.DamagesPlayer(true));
    entity.isSaloonOutlaw = true;
    entity.blueprint = 'SaloonOutlaw';
    

    const sprite = new ECS.Components.AnimatedSprite(
        Loader.spriteSheets.KnifeOutlaw, 
        "Idle", 
        12
    );
    sprite.paused = true;

    

    entity.addComponent(sprite);
    return entity;
}