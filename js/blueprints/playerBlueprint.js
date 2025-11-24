
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
            freezeFrame(30);
            setFrameTimeout(() => {
                shakeScreen(5);

            }, 30);

            // remove a bunch of components to "disable" the player
            this.removeComponent('PlayerMovement');
            this.removeComponent('PlayerJump');
            this.removeComponent('PlayerDash');
            this.removeComponent('PlayerFlying');
            this.removeComponent('PlayerEnemyCollision');
            this.removeComponent('Hurtbox');
            this.removeComponent('Hitbox');
            this.removeComponent('CollidesWithMap');
            this.removeComponent('MapCollisionState');
            // this.removeComponent('PlayerState');
            this.removeComponent('PlayerSpawn');
            // this.removeComponent('Dimensions');
            this.AnimatedSprite.setAnimation("Fall");
            
            this.Velocity.x = 0;
            this.Velocity.y = -3;

            this.Gravity.gravity = {x: 0, y: 0.06};

            setFrameTimeout(() => {
                
                this.Dead.dead = true;
            }, 180);

        }
    }
}
