// =========================================
// =========================================
// =========================================
// Global variables
let game;
let score = 0;
let best_score = 0;
let scoreText;
let BscoreText;
let death_count = 1;
let frames = 0;
let coin_counter = 0;
let fire_counter = 0;
let graphics;
let bounds;
let player_dead = false;
let dead_loop_once = true;
let reason = "none";
// =========================================
// =========================================
// =========================================
// global game options
let gameOptions = {
  platformStartSpeed: 350,
  spawnRange: [30, 50],
  spawnHeight: [580, 720],
  platformType: [0, 3],
  playerGravity: 900,
  jumpForce: 400,
  playerStartPosition: 150,
  
  jumps: 2,
  platformTypeList: ["platform_pillar", "platform_pillar_alt", "platform_smol", "platform_smol_alt"]
};
// =========================================
// =========================================
// =========================================
// object containing configuration options
window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    width: 900,
    height: 500,
    scene: [
      menu_scene,
      play_game_scene,
    ],
    backgroundColor: 0x292929,
    // physics settings
    physics: {
      default: "arcade",
    },    
  };
  game = new Phaser.Game(gameConfig);
  game.scene.start("menu_scene");
  window.focus();
  
};
// =========================================
// =========================================
// =========================================
// Scène du menu
class menu_scene extends Phaser.Scene {
  constructor() {
    super("menu_scene");
  }
  // =========================================
  // =========================================
  // =========================================
  // Preload the files used in the game.
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
    // LOAD de la mort du personnage.
    this.load.spritesheet("death", "assets/sprites/death.png", {
      frameWidth: 100,
      frameHeight: 100,
    });
    // LOAD des sons.
    this.load.audio('music_theme', ["assets/sound/theme_game_Pandora_Palace_master_of_disaster.mp3"])
    this.load.audio('jump_1', ["assets/sound/female_jump.wav"])
    this.load.audio('jump_2', ["assets/sound/female_jump2.wav"])
    this.load.audio('coin_sound', ["assets/sound/coin.wav"])
    this.load.audio('death_1', ["assets/sound/female_death.wav"])
    this.load.audio('click_button', ["assets/sound/click_button.wav"])
    // LOAD des boutons.
    this.load.image("play_button", "assets/sprites/PlayButton.png")
    this.load.image("go_menu_button", "assets/sprites/Home_Doorway.png")
    this.load.image("logo", "assets/img/logo_jeu.png")
    this.load.image("signature", "assets/img/KC_sign.png")

  }
  create() {
          // Adding sounds
          this.click_sound = this.sound.add("click_button", {volume: 0.4, loop: false});
        // Creating the menu
        this.logo = this.add.image(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.cameras.main.worldView.y + this.cameras.main.height / 3, 'logo')
        this.logo.setScale(0.15);
        this.signature = this.add.image(this.cameras.main.worldView.x + this.cameras.main.width / 1.15, this.cameras.main.worldView.y + this.cameras.main.height / 1.1, 'signature')
        this.signature.setScale(0.2);
        this.play_button = this.add.image(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.cameras.main.worldView.y + this.cameras.main.height / 1.3, 'play_button')
        this.play_button.setInteractive().setScale(2);
        this.play_button.on('pointerdown', () => {  
          this.cameras.main.fadeOut(300);             
          this.click_sound.play();

          this.time.addEvent({
            delay: 500,
            callback: ()=>{
              this.scene.switch("play_game_scene")
            },
            loop: false
          })
        });
        this.bg_1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background_1")
        this.bg_1.setScale(2);
        this.bg_1.alpha = 0.2;
        this.bg_1.setOrigin(0, 0);
        this.bg_1.setScrollFactor(0);
  

  }
  update(){
    this.bg_1.tilePositionX += 1;
  }
}
// Scène de jeu
class play_game_scene extends Phaser.Scene {
  constructor() {
    super("play_game_scene");
  }
// =========================================
// =========================================
// =========================================
// Create the elements that only need to be created once.
  create() {
    // Reset speed
    gameOptions.platformStartSpeed = 350;
// =========================================
// Vitesse qui augmente
      this.time.addEvent({
        delay: 500,
        callback: ()=>{
          if (gameOptions.platformStartSpeed < 700){
          gameOptions.platformStartSpeed = gameOptions.platformStartSpeed + 2;
          console.log(gameOptions.platformStartSpeed);
        }},
        loop: true
      })

// =========================================
    // Fade and deatfh system init
    this.cameras.main.fadeIn(500);
    player_dead = false;
    dead_loop_once = true;
// =========================================
// Adding the sounds and music
  this.music_theme = this.sound.add("music_theme", {volume: 0.07, loop: true});
  this.jump_sound_1 = this.sound.add("jump_1", {volume: 0.4, loop: false});
  this.jump_sound_2 = this.sound.add("jump_2", {volume: 0.5, loop: false});
  this.coin_sound = this.sound.add("coin_sound", {volume: 0.1, loop: false});
  this.death_sound_1 = this.sound.add("death_1", {volume: 0.4, loop: false});
  this.click_sound = this.sound.add("click_button", {volume: 0.4, loop: false});
  this.music_theme.play();
  // =========================================

      // UI :
    // leave button
    this.pause_button= this.add.image(800, 55, 'go_menu_button')
    this.pause_button.setInteractive().setScale(1.3);
      this.pause_button.on('pointerdown', () => {  
        this.cameras.main.fadeOut(300);
       this.click_sound.play();
        this.music_theme.stop();  
        this.time.addEvent({
          delay: 500,
          callback: ()=>{
            this.scene.switch("menu_scene")
            this.scene.start("menu_scene")
                  },
          loop: false
        })
      });
// =========================================
// Background and parallax
    this.bg_1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background_1")
    this.bg_1.setScale(2);
    this.bg_1.alpha = 0.2;
    this.bg_1.setOrigin(0, 0);
    this.bg_1.setScrollFactor(0);
    
    this.bg_2 = this.add.tileSprite(0, 200, game.config.width, game.config.height, "background_3")
    this.bg_2.setOrigin(0, 0);
    this.bg_2.setScrollFactor(0);
    
    this.bg_3 = this.add.tileSprite(0, 270, game.config.width, game.config.height, "background_2")
    this.bg_3.setOrigin(0, 0);
    this.bg_3.setScrollFactor(0);

    this.bg_4 = this.add.tileSprite(0, 260, game.config.width, game.config.height, "background_4")
    this.bg_4.setOrigin(0, 0);
    this.bg_4.setScrollFactor(0);
// =========================================
// Add overlay UI
    scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#FFFFFF",
    });
// =========================================
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
// =========================================
// number of consecutive jumps made by the player
    this.playerJumps = 0;
// =========================================
// adding a platform to the game, the arguments are platform width and x position
    this.addPlatform(game.config.width / 2, 500,
        "platform_start");
// =========================================
// adding the player;
    this.player = this.physics.add.sprite(
      gameOptions.playerStartPosition,
      game.config.height / 2.5,
      "player"
    );
    this.player.setGravityY(gameOptions.playerGravity).setScale(1.7);
    this.player.body.setSize(10, 30).setOffset(30, 10)
// =========================================
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
// =========================================
// setting collisions between the player and the platform group
    this.physics.add.collider(this.player, this.platformGroup);
// Debug : hitbox display
    // graphics = this.add.graphics();
// =========================================
// checking for input from the player
    this.input.on("pointerdown", this.jump, this);
// =========================================
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
    this.anims.create({
      key: "death",
      frames: this.anims.generateFrameNumbers("death", {
        start: 0,
        end: 89,
      }),
      frameRate: 60,
      repeat: 0,
    });
    
  }

// =========================================
// =========================================
// =========================================
// the core of the script: platform are added from the pool or created on the fly
// fonction addPlatform + Coin + Fireball
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
    this.nextPlatformDistance = Phaser.Math.FloatBetween(
      gameOptions.spawnRange[0],
      gameOptions.spawnRange[1]
    );
    coin_counter++;
    fire_counter++;
    if (coin_counter == 3){
        // adding the coins
        this.coin = this.physics.add.sprite(
          Phaser.Math.Between(
            1300, 1700
          ),
          game.config.height / Phaser.Math.Between(2, 4),
          "coin"
        ).setScale(0.2);
        coin_counter = 0;
        this.physics.add.overlap(this.player, this.coin, collectCoin, null, this);

    }
    if (fire_counter == 2){
              // adding a fireball
              this.fireball = this.physics.add.sprite(
                1500,
                game.config.height / Phaser.Math.FloatBetween(2, 4),
                "fireball"
              );
              fire_counter = 0;
    this.physics.add.overlap(this.player, this.fireball, function(){
      player_dead = true;
      reason = "t'a cramé";
    });
              console.log("feu !")
          
  }
  }
// =========================================
// =========================================
// =========================================
// the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
// fonction jump
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
        console.log("jump_reset")
      }
      if (this.playerJumps <= 2){
        this.playerJumps++;

      this.player.setVelocityY(gameOptions.jumpForce * -1);
      if (this.playerJumps == 1) {
        this.player.anims.play("jump", true);
        this.jump_sound_1.play();
      } else {
        this.player.anims.play("Djump", true);
        this.jump_sound_2.play();
      }
    
    }
    }

}

// =========================================
// =========================================
// =========================================
// fonction update
  update() {

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
    }
    // game over by fall
    if (this.player.y > game.config.height) {
      player_dead = true;
      reason = "t'es tombé";
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
// =========================================
// coin mechanic
    this.coin.anims.play("coin_anim", true);
    this.coin.setVelocityX(gameOptions.platformStartSpeed * -1);
// =========================================
// Fireball mechanic
    this.fireball.anims.play("fire_anim", true);
    this.fireball.setVelocityX(gameOptions.platformStartSpeed * -2);


// Check if dead {
  if (player_dead == true){
    if (dead_loop_once == true){
      // Kill character
      dead_loop_once = false;
      this.death_sound_1.play();
      this.player.setActive(false).setVisible(false);
      // Animated the death
      this.death_explosion = this.physics.add.sprite(
        gameOptions.playerStartPosition,
        this.player.y,
        "death"
      );
      this.death_explosion.setScale(3);
      this.death_explosion.setVelocityX(gameOptions.platformStartSpeed * -1);

      this.death_explosion.anims.play("death", true);

      this.time.addEvent({
        delay: 500,
        callback: ()=>{
          this.cameras.main.fadeOut(100);
          this.time.addEvent({
            delay: 1000,
            callback: ()=>{
              game.scene.start("play_game_scene")
              if (score > best_score){
                best_score = score;
              }
              BscoreText = this.add.text(16, 50, "Meilleur score: " + best_score, {
                fontSize: "20px",
                fill: "#FFFFFF",
              });
              BscoreText = this.add.text(16, 70, "Morts: " + death_count++, {
                fontSize: "20px",
                fill: "#FFFFFF",
              });
              console.log(best_score)
              score = 0;
              this.music_theme.stop();
              console.log("Raison de la mort : " + reason);
            },
            loop: false
          })
        },
        loop: false
      })

    }
    

    
  }

// =========================================
// DEBUG : Display hitbox
    // bounds = this.player.body;
    // graphics.clear();
    // graphics.lineStyle(1, 0xffff00);
    // graphics.strokeRectShape(bounds);
  }
}



// =========================================
// =========================================
// =========================================
// JS fonctions used for differents things.
// =========================================
// Increment score per seconds
function score_each_seconds() {
  frames = 0;
  score += 5;
  scoreText.setText("Score: " + score);
}
// =========================================
// Add score when coin get then destroy coin
function collectCoin (player, coin)
{
    coin.disableBody(true, true);
   this.coin_sound.play();
    score += 20;
    scoreText.setText('Score: ' + score);
}