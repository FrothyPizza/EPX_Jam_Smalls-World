
// Player blueprint - creates a player entity with all necessary components

ECS.Blueprints.createPlayer = function(x, y) {
    const player = new ECS.Entity();

    // Core components
    player.addComponent(new ECS.Components.Position(x, y));
    player.addComponent(new ECS.Components.Velocity(0, 0));
    player.addComponent(new ECS.Components.Gravity(0.12));
    player.addComponent(new ECS.Components.Dimensions(8, 8));

    // Collision components
    player.addComponent(new ECS.Components.CollidesWithMap(true));
    player.addComponent(new ECS.Components.MapCollisionState());
    player.addComponent(new ECS.Components.Hitbox([{x: 0, y: 0, w: 8, h: 8}]));
    player.addComponent(new ECS.Components.Hurtbox([{x: 0, y: 0, w: 8, h: 8}]));

    // Sprite
    const sprite = new ECS.Components.AnimatedSprite(
        Loader.spriteSheets.Smalls, 
        "Run", 
        6
    );
    player.addComponent(sprite);
    player.addComponent(new ECS.Components.ViewLock(true));

    // Player-specific components
    player.addComponent(new ECS.Components.PlayerState());
    player.addComponent(new ECS.Components.PlayerMovement());
    player.addComponent(new ECS.Components.PlayerJump());
    player.addComponent(new ECS.Components.PlayerDash());
    player.addComponent(new ECS.Components.PlayerLives(CONSTANTS.playerMaxLives));
    player.addComponent(new ECS.Components.PlayerInvincibility());
    player.addComponent(new ECS.Components.PlayerSpawn(x, y));
    player.addComponent(new ECS.Components.PlayerFlying());
    player.addComponent(new ECS.Components.PlayerSpikeDamage());
    player.addComponent(new ECS.Components.PlayerEnemyCollision());

    // Game state
    player.addComponent(new ECS.Components.Dead(false));

    player.blueprint = 'Player';
    player.interactWith = ECS.Blueprints.PlayerInteract;

    return player;
}

ECS.Blueprints.PlayerInteract = function(other) {
    if(other.has('DamagesPlayer')) {
        if (this.has('PlayerInvincibility') && this.PlayerInvincibility.isInvincible) return;
        if (this.has('InvincibilityFrames') && this.InvincibilityFrames.duration > 0) return;

        if (this.has('Dead')) {
            this.Dead.dead = true;
        }
    }
}
