const scene_w = 640;
const scene_h = 480;

let player_init_x = 32;

let player_speed = 1;

let background;
let player;
let enemies = [];
let bullets = [];

let left_key;
let up_key;
let right_key;
let down_key;
let space_key;

const MAX_ENEMIES = 128;
const MAX_BULLETS = 3;

const BULLET_INIT_X = -1000;
const BULLET_INIT_Y = -1000;

const SCREEN_MARGIN = 32;

function preload () {

	the_game = this;

	this.load.image("background", "stars.jpg");
	this.load.image("player", "PNG/Default/ship_K.png");
	this.load.image("enemy", "PNG/Default/enemy_A.png");
	this.load.image("bullet", "PNG/Default/star_tiny.png");
}

function create () {
	
	enemies = [];
	bullets = [];
	
	 background = this.add.image(scene_w/2, scene_h/2, "background");
	 background.setScale(1.3);
	 player = this.physics.add.image(player_init_x, scene_h/2, "player");
	 player.setScale(0.8);

	for (let i = 0; i < MAX_ENEMIES; i++) {
		let x = Math.random()*scene_w*10 + scene_w/2;
		let y = Math.random()*scene_h;
		
		enemies.push(this.physics.add.image(x, y, "enemy"));
	}

	enemies.forEach((element)=>{
			element.setScale(0.6);
	});
	
	enemies.forEach(function(element){
			the_game.physics.add.overlap(player, element, function (p, c) {
				the_game.scene.restart();
			}, null, the_game);
		});


	for (let i = 0; i < MAX_BULLETS; i++){
		bullets.push(this.add.image(BULLET_INIT_X, BULLET_INIT_Y, "bullet"));
		bullets[i].moving = false;
	}

   left_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	 up_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
	 right_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
	 down_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	 space_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	}

function update () {

	if (left_key.isDown){
			player.x -= player_speed;
		}else if(up_key.isDown){
			player.y -= player_speed;
		}else if(right_key.isDown){
			player.x += player_speed;
		}else if(down_key.isDown){
			player.y += player_speed;
		};

	if (space_key.isDown){
			let found = false;
			for (let i = 0; i < MAX_BULLETS && !found; i++){
				if(!bullets[i].moving && this.time.now > 1){
					bullets[i].moving = true;
					bullets[i].x = player.x;
					bullets[i].y = player.y;
					found = true;
				}
			}
	}

	for (let i = 0; i < MAX_BULLETS; i++){
		if (bullets[i].moving){
			bullets[i].x++;

			if (bullets[i].x >= scene_w + SCREEN_MARGIN){
				bullets[i].x = BULLET_INIT_X;
				bullets[i].y = BULLET_INIT_Y;
				bullets[i].moving = false;
			}
		}
	}

	for (let i = 0; i < MAX_ENEMIES; i++){
		enemies[i].x--;
	}

}

const config = {
  type: Phaser.AUTO,
  width: scene_w,
  height: scene_h,
  pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
		}
	},
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let game = new Phaser.Game(config);

