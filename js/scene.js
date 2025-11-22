
// Base Scene class for managing game scenes

class Scene {
    constructor() {
        this.entities = {};
    }

    // Called when scene becomes active
    init() {
        // Override in subclasses
    }

    // Update scene logic
    update(map) {
        // Override in subclasses
    }

    // Draw the scene
    draw(context) {
        // Override in subclasses
    }

    // Called when scene is being switched away from
    cleanup() {
        // Clean up all entities
        Object.keys(this.entities).forEach(id => {
            ECS.removeEntity(id);
        });
        this.entities = {};
    }

    // Add an entity to the scene
    addEntity(entity) {
        ECS.register(entity);
        this.entities[entity.id] = entity;
        return entity;
    }

    // Remove an entity from the scene
    removeEntity(id) {
        ECS.removeEntity(id);
        delete this.entities[id];
    }

    // Get entity by id
    getEntity(id) {
        return this.entities[id];
    }

    // Get all entities
    getEntities() {
        return Object.values(this.entities);
    }
}


// LevelScene - handles gameplay with map, entities, and systems
class LevelScene extends Scene {
    constructor(mapXml) {
        super();
        this.map = new Map(mapXml);
    }

    init() {
        // Spawn player at map spawn point
        if (this.map.playerSpawn) {
            const player = ECS.Blueprints.createPlayer(
                this.map.playerSpawn.x, 
                this.map.playerSpawn.y
            );
            this.addEntity(player);
            this.player = player;

            const testEnemy = ECS.Blueprints.testCharonEnemy(this.map.playerSpawn.x, this.map.playerSpawn.y - 20);
            this.addEntity(testEnemy);
        }
    }

    update() {
        // Run player systems first (order matters!)
        ECS.Systems.playerPhysicsSystem(this.entities);
        ECS.Systems.playerDashSystem(this.entities);
        ECS.Systems.playerJumpSystem(this.entities, this.map);
        ECS.Systems.playerWallSystem(this.entities, this.map);
        ECS.Systems.playerMovementSystem(this.entities);
        ECS.Systems.playerGlideSystem(this.entities, this.map);
        ECS.Systems.playerFlyingSystem(this.entities);
        
        // Run core ECS systems
        ECS.Systems.physicsSystem(this.entities);
        ECS.Systems.mapCollisionSystem(this.entities, this.map);
        
        // Reset wall jump flag after physics is done
        ECS.Systems.playerResetWallJumpSystem(this.entities);
        
        // Run player collision systems
        ECS.Systems.playerSpikeDamageSystem(this.entities, this.map);
        ECS.Systems.playerOffMapSystem(this.entities, this.map);
        ECS.Systems.playerInvincibilitySystem(this.entities);
        
        // Run other systems
        ECS.Systems.entityCollisionSystem(this.entities);
        
        // Update player state and animation
        ECS.Systems.playerStateMachineSystem(this.entities);
        ECS.Systems.playerAnimationSystem(this.entities);
        ECS.Systems.animationSystem(this.entities);

        ECS.Systems.viewSystem(this.entities, context);

        // Remove dead entities
        Object.keys(this.entities).forEach(id => {
            const entity = this.entities[id];
            if (entity.has('Dead') && entity.Dead.dead) {
                this.removeEntity(id);
            }
            if (entity.has('RemoveFromScene') && entity.RemoveFromScene.remove) {
                this.removeEntity(id);
            }
        });
    }

    draw(context) {
        // Draw the map
        this.map.draw(context);

        // Run render system to draw all entities
        ECS.Systems.renderSystem(this.entities, context);
    }

    cleanup() {
        super.cleanup();
        // Additional cleanup for level-specific resources if needed
    }
}
