

const ECS = {
	Components: {},
	Blueprints: {},
	Systems: {},
	Helpers: {},
	
	// entityID: entity
	entities: {},
    cache: {},
    invalidateCache: function() {
        this.cache = {};
    },
	register: function(entity) {
		this.entities[entity.id] = entity;
        this.invalidateCache();
	},
	removeEntity: function(id) {
		// console.log(this.entities[id].components);
		// this.entities[id].components.forEach(name => {
		// 	this.entities[id].removeComponent(name);
		// });
		if(!this.entities[id]) return;
		this.entities[id].destroy();
		delete this.entities[id];
        this.invalidateCache();
		//console.log("Entities: " + Object.entries(this.entities).length);
	},

	getEntitiesWithComponents: function(...components) {
        const key = components.sort().join(',');
        if (this.cache[key]) return this.cache[key];

		const result = Object.values(this.entities).filter(entity => {
			return components.every(comp => entity.has(comp));
		});
        this.cache[key] = result;
        return result;
	}
};