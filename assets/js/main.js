
let game;
let score = 0;
let scoreText;
let moveList = ["Jump", "Dive"];
let moveText;
let frames = 0;
let coin_counter = 0;
let fire_counter = 0;
let graphics;
let bounds;



// global game options
let gameOptions = {
  platformStartSpeed: 350,
  spawnRange: [50, 51],
  spawnHeight: [580, 720],
  platformType: [0, 3],
  playerGravity: 900,
  jumpForce: 500,
  playerStartPosition: 200,
  jumps: 2,
  platformTypeList: ["platform_pillar", "platform_pillar_alt", "platform_smol", "platform_smol_alt"]
};


window.onload = function () {
  // object containing configuration options
  let gameConfig = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    scene: playGame,
    backgroundColor: 0x444444,

    // physics settings
    physics: {
      default: "arcade",
    },
    
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
};

// playGame scene
class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  preload() {
    // LOAD du background
    this.load.image("background_1", "assets/sprites/bg/Background.png")
    this.load.image("background_2", "assets/sprites/bg/Ground.png")
    this.load.image("background_3", "assets/sprites/bg/Rocks.png")
    this.load.image("background_4", "assets/sprites/bg/Ground Front.png")

    // LOAD des Plateformes
    this.load.image("platform_start", "assets/img/platform_start.png")
    this.load.image("platform_smol", "assets/img/platform_smol.png")
    this.load.image("platform_smol_alt", "assets/img/platform_smol_alt.png")
    this.load.image("platform_pillar", "assets/img/platform_pillar.png")
    this.load.image("platform_pillar_alt", "assets/img/platform_pillar_alt.png")
    // LOAD des pièces
    this.load.spritesheet("coin", "assets/sprites/coin.png", {
        frameWidth: 128,
        frameHeight: 128,
      });
          // LOAD des pièces
    this.load.spritesheet("fireball", "assets/sprites/fireball.png", {
      frameWidth: 64,
      frameHeight: 32,
    });
    // LOAD du personnage.
    this.load.spritesheet("player", "assets/sprites/player.png", {
      frameWidth: 69,
      frameHeight: 44,
    });
  }
  create() {


    // Background and parallax
    this.bg_1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background_1")
    this.bg_1.setScale(2);
    this.bg_1.alpha = 0.2;
    this.bg_1.setOrigin(0, 0);
    this.bg_1.setScrollFactor(0);
    
    this.bg_2 = this.add.tileSprite(0, 300, game.config.width, game.config.height, "background_3")
    this.bg_2.setOrigin(0, 0);
    this.bg_2.setScrollFactor(0);
    
    this.bg_3 = this.add.tileSprite(0, 370, game.config.width, game.config.height, "background_2")
    this.bg_3.setOrigin(0, 0);
    this.bg_3.setScrollFactor(0);

    this.bg_4 = this.add.tileSprite(0, 360, game.config.width, game.config.height, "background_4")
    this.bg_4.setOrigin(0, 0);
    this.bg_4.setScrollFactor(0);


    scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#FFFFFF",
    });
    moveText = this.add.text(16, 50, "Next move : Jump", {
      fontSize: "20px",
      fill: "#FFFFFF",
    });
    // group with all active platforms.
    this.platformGroup = this.add.group({
      // once a platform is removed, it's added to the pool
      removeCallback: function (platform) {
        platform.scene.platformPool.add(platform);
      },
    });

    // pool
    this.platformPool = this.add.group({
      // once a platform is removed from the pool, it's added to the active platforms group
      removeCallback: function (platform) {
        platform.scene.platformGroup.add(platform);
      },
    });

    

    // number of consecutive jumps made by the player
    this.playerJumps = 0;

    // adding a platform to the game, the arguments are platform width and x position
    this.addPlatform(game.config.width / 2, 500,
        "platform_start");

    // adding the player;
    this.player = this.physics.add.sprite(
      gameOptions.playerStartPosition,
      game.config.height / 2.5,
      "player"
    );
    this.player.setGravityY(gameOptions.playerGravity).setScale(1.7);
    this.player.body.setSize(10, 30).setOffset(30, 10)

    this.time.addEvent({
      delay: 1000,
      callback: this.delayDone,
      callbackScope: this,
      loop: false
  });

        // adding a coin as original
        this.coin = this.physics.add.sprite(
          -100,
          game.config.height / 2.5 + 1,
          "coin"
        ).setScale(0.2);
        // adding a fireball as original
        this.fireball = this.physics.add.sprite(
          -100,
          game.config.height / 2.5 + 2,
          "fireball"
        ).setScale(1);

    // setting collisions between the player and the platform group
    this.physics.add.collider(this.player, this.platformGroup);
    graphics = this.add.graphics();





    // checking for input
    this.input.on("pointerdown", this.jump, this);
    

    // Animations
    this.anims.create({
      key: "fire_anim",
      frames: this.anims.generateFrameNumbers("fireball", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: 0,
    });
    this.anims.create({
        key: "coin_anim",
        frames: this.anims.generateFrameNumbers("coin", {
          start: 0,
          end: 3,
        }),
        frameRate: 5,
        repeat: -1,
      });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 6,
        end: 12,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player", {
        start: 42,
        end: 49,
      }),
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 5,
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "Djump",
      frames: this.anims.generateFrameNumbers("player", {
        start: 42,
        end: 49,
      }),
      frameRate: 5,
      repeat: 0,
    });
    this.anims.create({
      key: "BottomDash",
      frames: this.anims.generateFrameNumbers("player", {
        start: 86,
        end: 90,
      }),
      frameRate: 10,
      repeat: 0,
    });
  }



  // the core of the script: platform are added from the pool or created on the fly
  addPlatform(posX, Yperc, platformType) {
    let platform;
  
      platform = this.physics.add.sprite(
        posX,
        Yperc,
        platformType
      );
      platform.setImmovable(true);
      platform.setVelocityX(gameOptions.platformStartSpeed * -1);
      this.platformGroup.add(platform);
    platform.setScale(1.5);
    this.nextPlatformDistance = Phaser.Math.Between(
      gameOptions.spawnRange[0],
      gameOptions.spawnRange[1]
    );
    coin_counter++;
    fire_counter++;
    if (coin_counter == 3){
        // adding the coins
        this.coin = this.physics.add.sprite(
          Phaser.Math.Between(
            1000, 1500
          ),
          game.config.height / 3,
          "coin"
        ).setScale(0.2);
        coin_counter = 0;
        this.physics.add.overlap(this.player, this.coin, collectCoin, null, this);

    }
    if (fire_counter == 5){
              // adding a fireball
              this.fireball = this.physics.add.sprite(
                1500,
                game.config.height / 3,
                "fireball"
              ).setScale(Phaser.Math.Between(
                0.5, 0.9
              ),);
              fire_counter = 0;
              this.physics.add.overlap(this.player, this.fireball, death, null, this);

    }
  }

  // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
  jump() {
    if (this.playerJumps >= 2) {
      this.player.setVelocityY(300);
      this.player.anims.play("BottomDash", true);
  }
    if (
      this.player.body.touching.down ||
      (this.playerJumps > 0, this.playerJumps < gameOptions.jumps)
    ) {
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
      }
      if (this.playerJumps <= 2){
        this.playerJumps++;

      this.player.setVelocityY(gameOptions.jumpForce * -1);
      if (this.playerJumps == 1) {
        this.player.anims.play("jump", true);
      } else {
        this.player.anims.play("Djump", true);
      }
    
    }
    }

}
  update() {
    moveText.setText('Next move : ' + this.playerJumps);

    // Animation parallax
    this.bg_1.tilePositionX += 1;
    this.bg_2.tilePositionX += 5;
    this.bg_3.tilePositionX += 3;
    this.bg_4.tilePositionX += 6;

    frames++;
    if (frames == 100) {
      score_each_seconds();
    }
    if (this.player.body.touching.down) {
      this.player.anims.play("right", true);
      this.playerJumps = 0;
    }
    // game over by fall
    if (this.player.y > game.config.height) {
      this.scene.start("PlayGame");
      score = 0;
    }
    this.player.x = gameOptions.playerStartPosition;

    // recycling platforms
    let minDistance = game.config.width;
    this.platformGroup.getChildren().forEach(function (platform) {
      let platformDistance =
        game.config.width - platform.x - platform.displayWidth / 2;
      minDistance = Math.min(minDistance, platformDistance);
      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      var nextPlatformType = Phaser.Math.Between(
        gameOptions.platformType[0],
        gameOptions.platformType[1]
      );
      this.addPlatform(
        game.config.width + Phaser.Math.Between(
            300, 500
          ),
        Phaser.Math.Between(
            gameOptions.spawnHeight[0],
            gameOptions.spawnHeight[1]
          ),
          gameOptions.platformTypeList[nextPlatformType]

      );
    }
    // coin mechanic
    this.coin.anims.play("coin_anim", true);
    this.coin.setVelocityX(gameOptions.platformStartSpeed * -1);
    // Fireball mechanic
    this.fireball.anims.play("fire_anim", true);
    this.fireball.setVelocityX(-500);


    // Display hitbox
    // bounds = this.player.body;

    // graphics.clear();
    // graphics.lineStyle(1, 0xffff00);
    // graphics.strokeRectShape(bounds);
  }
}


function score_each_seconds() {
  frames = 0;
  score += 5;
  scoreText.setText("Score: " + score);
}

function collectCoin (player, coin)
{
    coin.disableBody(true, true);

    score += 20;
    scoreText.setText('Score: ' + score);
}
function death() {
  this.scene.start("PlayGame");
  score = 0;
  console.log("ded by fire")
}