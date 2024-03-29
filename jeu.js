class MenuScene extends Phaser.Scene {

    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('background', 'assets/menu/background.png');
        this.load.audio('start', 'assets/sond/menusound.wav');
        this.load.audio('music', 'assets/sond/music.mp3');


    }


    create() {

        this.sound.play('music', { loop: true });


        let title = this.add.text(600, 150, "The last Bridge's knight", {
            fontStyle: 'bold',  
            fontSize: 64,
            color: '#c2c2c2',
            padding: 10,
        }).setOrigin(0.5);
        title.setDepth(1);

        let graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(0, 0, 1200, 800);

        this.add.image(600, 400, 'background').setScale(0.5);
        

        let startButton = this.add.text(600, 400, 'START', { 
            fontSize: 64,
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: 10,
        });
        startButton.setOrigin(0.5);
        startButton.setInteractive();
        startButton.setDepth(1);
        startButton.on('pointerdown', () => {
            this.sound.play('start');
            this.scene.start('GameScene');
        });
    }

}


//jeu
class GameScene extends Phaser.Scene {

    constructor() {
        super({ key: 'GameScene' });
    }

preload ()
{
    this.load.image('backgroundBridge', 'assets/niveau1/bridge.png');
    this.load.image('backgroundTower', 'assets/niveau1/tower.png');
    this.load.image('backgroundSky', 'assets/niveau1/sky.png');
    //load des sprites du joueur
    this.load.spritesheet('playerWalk', 'assets/chevalier/walk.png', { frameWidth: 90, frameHeight: 86 });
    this.load.spritesheet('playerIdle', 'assets/chevalier/idle.png', { frameWidth: 90, frameHeight: 86 });
    this.load.spritesheet('playerAttack1', 'assets/chevalier/attack1.png', { frameWidth: 90, frameHeight: 86 });
    this.load.spritesheet('playerAttack2', 'assets/chevalier/attack2.png', { frameWidth: 90, frameHeight: 86 });
    this.load.spritesheet('playerAttack3', 'assets/chevalier/attack3.png', { frameWidth: 90, frameHeight: 86 });
    this.load.spritesheet('playerHurt', 'assets/chevalier/hurt.png', { frameWidth: 90, frameHeight: 86 });
    this.load.spritesheet('playerDie', 'assets/chevalier/dead.png', { frameWidth: 90, frameHeight: 86 });

    //load des sprite zombie
    this.load.spritesheet('zombieWalkBase', 'assets/baseZombie/walk.png', { frameWidth: 90, frameHeight: 86 });
    this.load.spritesheet('zombieWalkMaster', 'assets/masterZombie/walk.png', { frameWidth: 90, frameHeight: 86 });
    this.load.spritesheet('zombieWalkBoss', 'assets/bossZombie/walk.png', { frameWidth: 90, frameHeight: 86 });


    this.load.image('heart', 'assets/heart/heart.png');

    //on load des son
    this.load.audio('attack1', 'assets/sond/attack1.wav');
    this.load.audio('attack2', 'assets/sond/attack2.wav');
    this.load.audio('attack3', 'assets/sond/attack3.wav');
    this.load.audio('playercry', 'assets/sond/playercry.mp3');


    this.load.audio('zombiecry', 'assets/sond/zombiecry.wav');

    this.load.audio('gameover', 'assets/sond/deathscreen.mp3');
    this.sound.setVolume(2, 'gameover');


    const url = 'json/entity.json';
    fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error('Erreur lors de la récupération du fichier JSON');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        this.playerData = data.player;
        this.zombieData = data.zombie;


    })
    .catch(error => {
        console.error('Erreur :', error);
    });

}

create ()
{

    this.backSky = this.add.image(550, 90, 'backgroundSky').setScale(0.4);
    this.backTower = this.physics.add.image(550, 135, 'backgroundTower').setScale(0.4);
    this.backTower2 = this.physics.add.image(2080, 135, 'backgroundTower').setScale(0.4);
    this.backBridge = this.physics.add.image(550, 550, 'backgroundBridge').setScale(0.4);
    this.backBridge2 = this.physics.add.image(2050, 550, 'backgroundBridge').setScale(0.4);

    //ajout d'un sprite du joueur
    this.player = this.physics.add.sprite(200, 450).setScale(3);
    this.player.body.setSize(35, 64);
    this.player.body.offset.y = 22;
    this.player.body.offset.x = 0;
    this.playerLife = this.playerData.health;
    this.playerDamage = this.playerData.damage;




    //ajout des l'animations du joueur
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('playerWalk', { start: 0, end: 7 }),
        frameRate: 7,
        repeat: -1
    });
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 3 }),
        frameRate: 3,
        repeat: -1
    });
    this.anims.create({
        key: 'attack1',
        frames: this.anims.generateFrameNumbers('playerAttack1', { start: 0, end: 4 }),
        frameRate: 10,
    });
    this.anims.create({
        key: 'attack2',
        frames: this.anims.generateFrameNumbers('playerAttack2', { start: 0, end: 3 }),
        frameRate: 10,
    });
    this.anims.create({
        key: 'attack3',
        frames: this.anims.generateFrameNumbers('playerAttack3', { start: 0, end: 3 }),
        frameRate: 10,
    });
    this.anims.create({
        key: 'hurt',
        frames: this.anims.generateFrameNumbers('playerHurt', { start: 0, end: 1 }),
        frameRate: 4
    });
    this.anims.create({
        key: 'die',
        frames: this.anims.generateFrameNumbers('playerDie', { start: 0, end: 5 }),
        frameRate: 4
    });

    //on joue l'animation de base
    this.player.anims.play('idle', true);

    //ajout d'un sprite du zombie

    let baseY = Phaser.Math.Between(200, 600);
    this.zombie = this.physics.add.sprite(1200, baseY).setScale(3);
    this.zombie.body.setSize(35, 64);
    this.zombie.body.offset.y = 22;
    this.zombie.body.offset.x = 55;
    this.zombieLife = this.zombieData.baseZombie.health;
    this.zombieDamage = this.zombieData.baseZombie.damage;
    this.zombieVelocity = -this.zombieData.baseZombie.velocity;


    //ajout des l'animations du zombie
    this.anims.create({
        key: 'walkZombieBase',
        frames: this.anims.generateFrameNumbers('zombieWalkBase', { start: 7, end: 0 }),
        frameRate: 7,
        repeat: -1
    });
    this.anims.create({
        key: 'walkZombieMaster',
        frames: this.anims.generateFrameNumbers('zombieWalkMaster', { start: 7, end: 0 }),
        frameRate: 7,
        repeat: -1
    });
    this.anims.create({
        key: 'walkZombieBoss',
        frames: this.anims.generateFrameNumbers('zombieWalkBoss', { start: 7, end: 0 }),
        frameRate: 7,
        repeat: -1
    });
    //on joue l'annimation de base du zombie
    this.zombie.anims.play('walkZombieBase', true);
    
    
    //detection du joueur qui se déplace
    this.playerMvt = false
    
    //on crée x coeur de vie
    this.hearts = this.add.group();
    for (let i = 0; i < this.playerLife; i++)
    {
        let heart = this.hearts.create(50 + (i * 50), 50, 'heart').setScale(3);

    }




}

update ()
{

  


    //gestion des déplacements des éléments du décor
    if
    (this.backBridge.x < -800)
    {
        this.backBridge.x = 2050;
    }
    if
    (this.backBridge2.x < -800)
    {
        this.backBridge2.x = 2050;
    }
    if
    (this.backTower.x < -800)
    {
        this.backTower.x = 2050;
    }
    if
    (this.backTower2.x < -800)
    {
        this.backTower2.x = 2050;
    }


    //attaquer avec la barre d'espace
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey('SPACE'), 500))
    {
        if(this.hitBoxAttack !== undefined)
            this.hitBoxAttack.destroy();
        this.hitBoxAttack = this.physics.add.sprite(this.player.x + 30, this.player.y, null).setScale(1);
        this.hitBoxAttack.body.setSize(100, 128);
        this.hitBoxAttack.visible = false;


        this.physics.add.overlap(this.hitBoxAttack, this.zombie, () => {
        this.zombieLife -= this.playerDamage;
           this.zombie.x += 100;
           this.sound.play('zombiecry');
        })

        //on crée une hit box pour l'attaque invisible        

        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        //on tire au hasard l'attaque
        let attack = Phaser.Math.Between(1, 3);
        switch (attack) {
            case 1:
                this.player.anims.play('attack1', true);
                this.sound.play('attack1');

                break; 
            case 2:
                this.player.anims.play('attack2', true);
                this.sound.play('attack2');

                break;
            case 3:
                this.player.anims.play('attack3', true);
                this.sound.play('attack3');

                break;
        }
        this.playerMvt = false;

        this.player.once('animationcomplete', () => {
            this.hitBoxAttack.destroy();
            this.player.anims.play('idle', true);
        });


    }

    //Mouvement du joueur
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey('D'), 500))
    {
        this.player.anims.play('walk', true);

        this.player.setVelocityX(this.playerData.velocity);
        if(this.hitBoxAttack !== undefined)
        this.hitBoxAttack.destroy();

    }
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey('Q'), 500))
    {
        this.player.anims.play('idle', true);
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);

        this.playerMvt = false;

        if(this.hitBoxAttack !== undefined)
        this.hitBoxAttack.destroy();
    }
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey('Z'), 500))
    {   
        this.player.anims.play('walk', true);
        this.player.setVelocityY(-this.playerData.velocity);

        if(this.hitBoxAttack !== undefined)
        this.hitBoxAttack.destroy();
    }
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey('S'), 500))
    {   
        this.player.anims.play('walk', true);
        this.player.setVelocityY(this.playerData.velocity);
        
        if(this.hitBoxAttack !== undefined)
        this.hitBoxAttack.destroy();
    }

    //si le joueur arrive  au bout de l'écran on bouge le pont
    if (this.player.x > 450 && this.player.anims.currentAnim.key === 'walk')
    {
        this.player.setVelocityX(0);
        this.backBridge.setVelocityX(-80);
        this.backBridge2.setVelocityX(-80);
        this.backTower.setVelocityX(-10);
        this.backTower2.setVelocityX(-10);
        this.playerMvt = true;

    }

    if (this.playerMvt === false) {
        this.backBridge.setVelocityX(0);
        this.backBridge2.setVelocityX(0);
        this.backTower.setVelocityX(0);
        this.backTower2.setVelocityX(0);
    }

    //si le joueur arrive  au bout de l'écran on bouge le stop
    if (this.player.y < 200 && this.player.anims.currentAnim.key === 'walk')
    {
        this.player.setVelocityY(0);
        this.player.y += 1;

    }
    if (this.player.y > 600 && this.player.anims.currentAnim.key === 'walk')
    {
        this.player.setVelocityY(0);
        this.player.y -= 1;

    }


    //"ia" zombie
    this.zombie.setVelocityX(0);
    this.zombie.setVelocityY(0);
    if (this.zombie.x > this.player.x)
    {
        this.zombie.setVelocityX(this.zombieVelocity);
    }
    if (this.zombie.y < this.player.y)
    {
        this.zombie.setVelocityY(-this.zombieVelocity);
    }
    else if (this.zombie.y > this.player.y)
    {
        this.zombie.setVelocityY(this.zombieVelocity);
    }
    else if (this.zombie.y === this.player.y)
    {
        this.zombie.setVelocityY(0);
    }
    if (this.playerMvt === true)
    {
        this.zombie.setVelocityX(this.zombieVelocity - 80);
    }


    //gestion des colision zombie joueur
    this.physics.add.collider(this.player, this.zombie, () => {
        this.playerLife -= this.zombieDamage;
        this.player.anims.play('hurt', true);
        this.sound.play('playercry');
        this.player.x -= 100;
        this.player.setVelocityY(0);
        this.zombie.x += 100;
        this.playerMvt = false;
        this.hearts.getChildren()[this.playerLife].destroy();
        this.player.once('animationcomplete', () => {
            this.player.anims.play('idle', true);
            this.player.setVelocityX(0);
        });
        console.log(this.playerLife);
        this.player.once('animationcomplete', () => {
            if (this.playerLife <= 0)
            {
                //on détruit le collider du joueur
                this.player.anims.stop();
                this.zombie.anims.stop();
                this.player.setVelocityY(0);
                this.player.setVelocityX(0);
                this.zombie.setVelocityX(0);
                this.zombie.setVelocityY(0);
                this.zombie.x = 10000;
                this.player.anims.play('die');
                this.sound.stopAll();
                this.sound.play('gameover');
                this.input.keyboard.enabled = false;

                    //un fois l'écran de mort affiché on sort de la boucle

                if (this.deathScreen == undefined) {
                    console.log('mort');
                    this.add.text(600, 400, 'YOU DIED', { 
                        fontSize: 64,
                        color: '#000000',
                        padding: 10,
                    }).setOrigin(0.5);
                    this.add.text(1300, 400, '------------------------------------------------------------------------', { 
                        fontSize: 64,
                        color: '#000000',
                        padding: 10,
                    }).setOrigin(1);
                    this.add.text(-100, 400, '------------------------------------------------------------------------', { 
                        fontSize: 64,
                        color: '#000000',
                        padding: 10,
                    }).setOrigin(0);
                    this.add.text(600, 550, 'RESTART', { 
                        fontSize: 64,
                        color: '#000000',
                        backgroundColor: '#ffffff',
                        padding: 10,
                    }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
                        this.scene.start('MenuScene');
                    });
                }
            }
        });
    })

    //si le zombie meurt
    if (this.zombieLife <= 0)
    { 
        //console.log('mort' + this.zombieLife);

        this.zombie.x = 1200;
        //on tire une chiffre au sort
        let tirageZombie = Phaser.Math.Between(1, 3);
        switch (tirageZombie) {
            case 1:
                this.zombieLife = this.zombieData.baseZombie.health;
                this.zombieDamage = this.zombieData.baseZombie.damage;
                this.zombieVelocity = -this.zombieData.baseZombie.velocity;
                this.zombie.anims.play('walkZombieBase', true);
                break; 
            case 2:
                this.zombieLife = this.zombieData.masterZombie.health;
                this.zombieDamage = this.zombieData.masterZombie.damage;
                this.zombieVelocity = -this.zombieData.masterZombie.velocity;
                this.zombie.anims.play('walkZombieMaster', true);
                break;
            case 3:
                this.zombieLife = this.zombieData.bossZombie.health;
                this.zombieDamage = this.zombieData.bossZombie.damage;
                this.zombieVelocity = -this.zombieData.bossZombie.velocity;
                this.zombie.anims.play('walkZombieBoss', true);
                break;

        }
    }


}

}


const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    //on démarre sur le menu
    scene: [MenuScene, GameScene],

    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);