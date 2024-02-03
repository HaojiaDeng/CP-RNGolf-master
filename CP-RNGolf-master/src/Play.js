class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
        this.shotsTaken = 0; 
        this.goalsScored = 0;
        


    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width/2,height/10, 'cup')
        this.cup.body.setCircle(this.cup.width/4)
        this.cup.body.setOffset(this.cup.width/4)
        this.cup.body.setImmovable(true)
        
        // add ball
        this.ball = this.physics.add.sprite(width/2, height - height/10, 'ball')
        this.ball.body.setCircle(this.ball.width/2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        this.wallA = this.physics.add.sprite(0,height/4, 'wall')
        this.wallA.setX(Phaser.Math.Between(0 + this.wallA.width/2,width - this.wallA.width/2))
        this.wallA.body.setImmovable(true)
        this.wallA.body.setVelocityX(100);

        let wallB = this.physics.add.sprite(0,height/2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2,width - wallB.width/2))
        wallB.body.setImmovable(true)


        this.walls = this.add.group([this.wallA,wallB])
        

        // add one-way
        this.oneWay = this.physics.add.sprite(width/2,height/4*3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false


        // add pointer input
        this.input.on('pointerdown',(pointer) =>{
            let deltaX = pointer.x - this.ball.x
            this.ball.body.setVelocityX(deltaX)
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1; 
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
            this.shotsTaken++
            this.shotsText.setText('Shots: ' + this.shotsTaken)
        })

        

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup,(ball,cup) => {
            ball.setPosition(width/2, height - height/10)
            ball.body.setVelocity(0, 0)
            this.goalsScored++
            this.goalsText.setText('Goals: ' + this.goalsScored)
            
        })

        // ball/wall collision
        this.physics.add.collider(this.ball,this.walls)


        // ball/one-way collision
        this.physics.add.collider(this.ball,this.oneWay)

        this.shotsText = this.add.text(10, 10, 'Shots: 0', { fontSize: '16px', fill: '#fff' })
        this.goalsText = this.add.text(10, 30, 'Goals: 0', { fontSize: '16px', fill: '#fff' })
        this.successRateText = this.add.text(10, 50, 'Success Rate: 0%', { fontSize: '16px', fill: '#fff' })


        

    }

    update() {
        const buffer = 5; 
        if (this.wallA.x <= this.wallA.width / 2 + buffer) {
            this.wallA.body.velocity.x = Math.abs(this.wallA.body.velocity.x)
            this.wallA.x = this.wallA.width / 2 + buffer
        }else if (this.wallA.x >= this.sys.game.config.width - this.wallA.width / 2 - buffer) {
            this.wallA.body.velocity.x = -Math.abs(this.wallA.body.velocity.x)
            this.wallA.x = this.sys.game.config.width - this.wallA.width / 2 - buffer
        }



        let successRate = (this.goalsScored / this.shotsTaken * 100).toFixed(2)
        this.successRateText.setText('Success Rate: ' + successRate + '%')
    }

}

/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[ ] Add ball reset logic on successful shot
[ ] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[ ] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/