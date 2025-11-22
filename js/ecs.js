

const ECS = {
	Components: {},
	Blueprints: {},
	Systems: {},
	Helpers: {},
	
	// entityID: entity
	entities: {},
	register: function(entity) {
		this.entities[entity.id] = entity;
	},
	removeEntity: function(id) {
		// console.log(this.entities[id].components);
		// this.entities[id].components.forEach(name => {
		// 	this.entities[id].removeComponent(name);
		// });
		if(!this.entities[id]) return;
		this.entities[id].destroy();
		delete this.entities[id];
		//console.log("Entities: " + Object.entries(this.entities).length);
	}
};