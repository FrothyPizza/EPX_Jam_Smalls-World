class SaloonScene extends LevelScene {
  constructor(mapXml) {
    super(mapXml);
  }

  init() {
    super.init();

    this.bossSpawned = false;
    this.outlawsActive = false;

    let outlawLeft = null;
    let outlawRight = null;

    let OVERRIDE_ENTITIY_COUNT = 100;
    let spawned = 0;
    if (CONSTANTS.SPEEDY_MODE) {
      OVERRIDE_ENTITIY_COUNT = 0;
      spawned = 0;
    }

    // Spawn enemies from map data
    this.map.enemies.forEach((spawn) => {
      let enemyEntity = null;
      if (spawn.name === "SaloonOutlaw") {
        if (spawned >= OVERRIDE_ENTITIY_COUNT) return;
        enemyEntity = ECS.Blueprints.createSaloonOutlaw(spawn.x, spawn.y);
        enemyEntity.addComponent(
          new ECS.Components.LooksBackAndForthIntermittently(
            60 + Math.floor(Math.random() * 60)
          )
        );
        spawned++;
      }
      if (spawn.name === "SaloonOutlawInitial") {
        enemyEntity = ECS.Blueprints.createSaloonOutlaw(spawn.x, spawn.y);

        if (!outlawLeft) {
          outlawLeft = enemyEntity;
          enemyEntity.name = "OutlawLeft";
        } else if (!outlawRight) {
          outlawRight = enemyEntity;
          enemyEntity.name = "OutlawRight";
        }
      }

      if (enemyEntity) {
        this.addEntity(enemyEntity);
      }
    });

    // // find player in ECS entittes and add stunned birds to him
    // ECS.getEntitiesWithComponents('PlayerState').forEach(playerEntity => {
    //     console.log("Adding stunned birds to player");

    //     ECS.Helpers.addStunnedBirdsToEntity(playerEntity, this);
    //     console.log("Added stunned birds to player");
    // });

    if (Loader.cutscenes && Loader.cutscenes.saloon) {
      this.playCutscene(
        CONSTANTS.SPEEDY_MODE ? "saloon_abridged" : "saloon",
        {
          Player: this.player,
          OutlawLeft: outlawLeft,
          OutlawRight: outlawRight,
        },
        {
          onComplete: () => {
            // GlobalState.sceneManager.switchScene(new DesertScene(Loader.levels['desert'].xml));

            let index = 1;
            this.getEntities().forEach((entity) => {
              if (
                entity.isSaloonOutlaw ||
                entity.blueprint === "SaloonOutlaw"
              ) {
                entity.addComponent(
                  new ECS.Components.SaloonKnifeOutlaw(
                    240 * index + Math.floor(Math.random() * 120)
                  )
                );
                index++;
              }
            });
            this.outlawsActive = true;
          },
        }
      );
    }
  }

  update() {
    super.update();

    ECS.Systems.saloonBottleSystem(this.getEntities(), this.map, this);

    // Check if we need to replay the boss appearance cutscene (e.g. after reload)
    if (!this.cutscenePlayer) {
      const boss = this.getEntities().find((e) => e.has("BossIntroSeen"));
      if (
        boss &&
        boss.has("CrazedCowboy") &&
        boss.CrazedCowboy.state === "INACTIVE"
      ) {
        this.playBossAppearance(boss);
      }
    }

    if (this.outlawsActive && !this.bossSpawned) {
      let outlawCount = 0;
      this.getEntities().forEach((entity) => {
        if (
          (entity.isSaloonOutlaw || entity.blueprint === "SaloonOutlaw") &&
          !entity.dead
        ) {
          // Assuming dead flag or removal
          outlawCount++;
        }
      });

      if (outlawCount === 0) {
        this.spawnBoss();
      }
    }
  }

  spawnBoss() {
    this.bossSpawned = true;
    console.log("Spawning Boss!");

    let bossX = 0;
    let bossY = 0;
    this.map.enemies.forEach((spawn) => {
      if (spawn.name === "MadSheriff") {
        bossX = spawn.x;
        bossY = spawn.y;
      }
    });

    // Spawn Boss
    // Position should probably be defined in map or hardcoded for now
    let boss = ECS.Blueprints.CrazedCowboy(bossX, bossY, "INACTIVE");
    this.addEntity(boss);

    // Play Boss Intro Cutscene if available

    if (Loader.cutscenes && Loader.cutscenes.saloon_boss) {
      this.playCutscene(
        "saloon_boss",
        { Sheriff: boss },
        {
          shouldSave: true,
          onComplete: () => {
            boss.addComponent(new ECS.Components.BossIntroSeen());
            this.playBossAppearance(boss);
          },
        }
      );
    }
  }

  playBossAppearance(boss) {
    this.playCutscene(
      "saloon_boss_appearance",
      { Sheriff: boss },
      {
        shouldSave: false,
        onComplete: () => {
          // Boss fight starts
          if (boss.CrazedCowboy) {
            boss.CrazedCowboy.state = "IDLE";
          }

          boss.CrazedCowboy.startPos = {
            x: boss.Position.x,
            y: boss.Position.y,
          };
        },
      }
    );
  }
}
