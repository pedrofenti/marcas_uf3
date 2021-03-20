const scene_w = 640;
const scene_h = 480;

let player_init_x = 32;

let player_speed = 1;

let background;
let bgTiles;
let bgGraphics;
let player;
let enemies = [];
let bullets = [];

let left_key;
let up_key;
let right_key;
let down_key;
let space_key;

let explosion_audio;

let score = 0;
let score_text;

let canShoot = true;

const MAX_ENEMIES = 128;
const MAX_BULLETS = 3;

const BULLET_INIT_X = -1000;
const BULLET_INIT_Y = -1000;

const SCREEN_MARGIN = 32;

function preload () {

	//para poder usar en diferentes contextos
	the_game = this;

	this.load.image("background", "stars.jpg");
	this.load.image("player", "PNG/Default/ship_K.png");
	this.load.image("enemy", "PNG/Default/enemy_A.png");
	this.load.image("bullet", "PNG/Default/star_tiny.png");

	this.load.audio("explosion", "Audio/explosionCrunch_000.ogg");
}

function create_particle(color){
	particles.createEmitter({
  		  alpha: { start: 1, end: 0 },
        scale: { min: 0.05, max: 0.4 },
				angle: { min: 0, max: 300 },
        speed: { min: 100, max: 500 },
        quantity: { min: 2, max: 10 },
        lifespan: 4000,
        rotate: { start: 0, end: 360, /*ease: 'Back.easeOut'*/ },
        quantity: 32,
				tint: color,
        on: false
	 });

	 }


function create () {
	
	//seteo los arrays y los puntos para q al resetear, que no se queden colgados 
	enemies = [];
	bullets = [];
	score = 0;
	
	 background = this.add.image(scene_w/2, scene_h/2, "background");
	 background.setScale(1.3);
	 
	 //genero los graficos para el fondo y los guardo en la variable
	 bgGraphics =  this.make.graphics({ x: 0, y:0, add: false });
	 
	 //le digo que usare la imagen background con el tamanyo de la imagen
	 bgGraphics.generateTexture("background", 626, 375);
	 
	 //no acabo de saber muy bien porque la verdad..
	 bgTiles = this.add.tileSprite(400, 300, 800, 600, 'background');

	 //anyadir las particulas 
   particles = this.add.particles("bullet");
	 
	//poner el texto en partida
	score_text = this.add.text(scene_w/2, scene_h/2 - 200, "Points: 0",{ fontWeight: 'bold', fontStyle: 'italic', fontFamily: 'sans-serif',  color:'#fff', fontSize: '30px'}).setOrigin(0.5,0.5);

	 //meto en la variable player la imagen que he definido como player
	 //le digo que tenga fisicas y la pongo en una posicion
	 //seteo la escala de la imagen, la orientacion y su collider
	 player = this.physics.add.image(player_init_x, scene_h/2, "player");
	 player.setScale(0.8);
	 player.setAngle(90);
	 player.setSize(10,10);

	//meto en el array enemies la cantidad MAX_ENEMIES
	//seteando de manera random la x de la mitad de la x + la scena_w*10
	//seteando la y de manera random entre la altura de la ventana
	//haciendo un push al array con fisicas como el player y la orientacion
	//y seteando el color de los enemigos de manera random
	for (let i = 0; i < MAX_ENEMIES; i++) {
		let x = Math.random()*scene_w*10 + scene_w/2;
		let y = Math.random()*scene_h;
		
		enemies.push(this.physics.add.image(x, y, "enemy"));
		enemies[i].setAngle(270);
		enemies[i].setScale(0.6);
		enemies[i].color = Math.random() * 0xffffff;
		enemies[i].tint = enemies[i].color;
	}

	//funcion para las colisiones entre los enemigos y el jugador
	//overlap es cuando se sobreponen, cuando colisionan
	//null -> callback de proceso, que ocurre mientras colisiona
	//the_game -> este contexto
	enemies.forEach(function(element){
			the_game.physics.add.overlap(player, element, function (p, e) {
				the_game.scene.restart();
			}, null, the_game);
		});

	//poner las balas en su array y setearlas a una posicion lejana 
	//movere su posicion cuando quiera usarlas
	//anyadir la propiedad moving de manera dinamica y setear todas a false
	//setear con el setSize la boxCollider
	for (let i = 0; i < MAX_BULLETS; i++){
		bullets.push(this.physics.add.image(BULLET_INIT_X, BULLET_INIT_Y, "bullet"));
		bullets[i].moving = false;
		bullets[i].setSize(20,20);
	}

	
	//colision de las balas y los enemigos
	bullets.forEach(function(element){
			the_game.physics.add.overlap(enemies, element, function (e, b) {
				element.x = BULLET_INIT_X;
				element.y = BULLET_INIT_Y;
				element.moving = false;
				score++;
				score_text.setText('Points: ' + score);
				create_particle(e.color);
				particles.emitParticleAt(e.x, e.y);
				e.destroy();
				explosion_audio.play();
			}, null, the_game);
	});
	
	//setear en las variables los input del teclado
  left_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	up_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
	right_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
	down_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	space_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


	explosion_audio = this.sound.add("explosion");
	explosion_audio.setVolume(0.1);

	}

function update () {
	
	//movimiento del fondo
	bgTiles.tilePositionX += 0.3;		
	
	//movimiento con las teclas
	if (left_key.isDown){
		player.x -= player_speed;
	}else if(up_key.isDown){
		player.y -= player_speed;
	}else if(right_key.isDown){
		player.x += player_speed;
	}else if(down_key.isDown){
		player.y += player_speed;
	};
	
	//disparar 
	if (space_key.isUp){ canShoot = true; }

	if (space_key.isDown && canShoot){
			canShoot = false;
			let found = false;
			for (let i = 0; i < MAX_BULLETS && !found; i++){
				if(!bullets[i].moving){
					bullets[i].moving = true;
					bullets[i].x = player.x;
					bullets[i].y = player.y;
					found = true;
				}
			}
	}

	//movimiento de las balas y resetear su posicion cuando
	//se pasen del margen de la escena
	for (let i = 0; i < MAX_BULLETS; i++){
		if (bullets[i].moving){
			bullets[i].x += 2;

			if (bullets[i].x >= scene_w + SCREEN_MARGIN){
				bullets[i].x = BULLET_INIT_X;
				bullets[i].y = BULLET_INIT_Y;
				bullets[i].moving = false;
			}
		}
	}

	//mover a los enemigos hacia la izquierda 
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
		//	debug: true,  //para mirar las box colliders
		}
	},
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let game = new Phaser.Game(config);

