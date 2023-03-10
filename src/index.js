const scoreEl = document.querySelector('#scoreEl');
const canvas = document.querySelector('canvas');
const ctx= canvas.getContext('2d')

// canvas.width = window.innerWidth; 
canvas.width = 1024; 

// canvas.height = window.innerHeight;
canvas.height = 576;


class Batman {
    constructor(){
        //stating position
        this.speed = {
            x: 0,
            y: 0
        }
        this.rotation = 0;
        this.opacity = 1
        const image = new Image();
        image.src = './images/batman.png'
        image.onload = () => {
            this.image = image
            this.width = image.width *.08
            this.height = image.height *.08
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height  - this.height - 20
            }
        }

    }

    draw() {
        //save and restore needed for rotate
        ctx.save()
        //opacity
        ctx.globalAlpha = this.opacity
        //
        ctx.translate(
            batman.position.x + batman.width /2,
             batman.position.y + batman.height /2)
        ctx.rotate(this.rotation)    
        ctx.translate(
            -batman.position.x - batman.width /2,
             -batman.position.y - batman.height /2)
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        ctx.restore()

    }
    //position update
    update(){
        //only if img is available
        if(this.image){
            this.draw()
            this.position.x += this.speed.x
        }
    }
}

class Projectile {
    constructor({position, speed}){
        this.position = position
        this.speed = speed
        this.radius = 3
    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = "red"
        ctx.fill()
        ctx.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.speed.x
        this.position.y += this.speed.y
    }
}


class Particle {
    constructor({position, speed, radius, color, fades}){
        this.position = position
        this.speed = speed
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }
    draw(){
        //fade particle
        ctx.save()
        ctx.globalAlpha = this.opacity
        //
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
        //
        ctx.restore()
    }

    update() {
        this.draw()
        this.position.x += this.speed.x
        this.position.y += this.speed.y

        //fade out the particle
        if(this.fades)
        this.opacity -= 0.01
    }
}



class EnemyProjectile {
    constructor({position, speed}){
        this.position = position
        this.speed = speed
        this.height = 10
        this.width = 3
    }
    draw(){
        ctx.fillStyle = 'white'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.speed.x
        this.position.y += this.speed.y
    }
}





class Enemy {
    constructor({position}){
        //stating position
        this.speed = {
            x: 0,
            y: 0
        }
        const image = new Image();
        image.src = './images/invader.png'
        image.onload = () => {
            this.image = image
            this.width = image.width
            this.height = image.height
            this.position = {
                x: position.x,
                y: position.y
            }
        }

    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    //position update
    update({speed}){
        //only if img is available
        if(this.image){
            this.draw()
            this.position.x += speed.x
            this.position.y += speed.y

        }
    }
    shoot(invaderProjectiles){
        invaderProjectiles.push(new EnemyProjectile({
            position: {
                x: this.position.x+ this.width/2,
                y: this.position.y +this.height 
            },
            speed:{
                x: 0,
                y: 5
            }
            
        }))}
}

class Grid {
    constructor(){
        this.position = {
            x: 0,
            y: 0
        }
        this.speed = {
            x: 3,
            y: 0
        }
        this.invaders = []

        //random number of collums/ rows but minimum 5c/2r
        const columns = Math.floor(Math.random()*5 + 5)
        const rows = Math.floor(Math.random()*5 + 0)
        //width of invadersgrid
        this.width = columns * 30
        for(let x = 0; x < columns;x++){
            for(let y = 0; y < rows;y++){
            this.invaders.push(
                new Enemy({
                    position:{
                    //multiply with width/height of image so they are spaced out
                    x: x * 30,
                    y: y *30
                }
            })
            )
        }
    }
    }

    update(){
        this.position.x += this.speed.x
        this.position.y += this.speed.y
        this.speed.y = 0

        if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
            this.speed.x = -this.speed.x
            this.speed.y = 30
        }
    }
}


let batman = new Batman()
let projectiles = []
let grids = []
let enemyProjectiles = []
let particles = []


//monitor keypresses
let keys = {
    a: {
        pressed: false
    },
    d: {
        pressed:false
    },
    space:{
        pressed: false
    }
}

let frames = 0
let randomInterval = Math.floor(Math.random() *500 +500)
let game = {
    over: false,
    active: true
}
let score = 0

function init(){
    batman = new Batman()
    projectiles = []
    grids = []
    enemyProjectiles = []
    particles = []
    keys = {
        a: {
            pressed: false
        },
        d: {
            pressed:false
        },
        space:{
            pressed: false
        }
    }
    
    frames = 0
    randomInterval = Math.floor(Math.random() *500 +500)
    game = {
        over: false,
        active: true
    }
    score = 0

    //background stars
    for(let i=0; i< 100; i++){
        particles.push(new Particle({
            position:{
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
                },
                speed:{
                // make the explosions go all directions
                x: 0,
                y: 0.3
                },
                radius: Math.random()*2,
                color:  "white"
            }))
        }
    
}
//background stars
// for(let i=0; i< 100; i++){
//     particles.push(new Particle({
//         position:{
//             x: Math.random() * canvas.width,
//             y: Math.random() * canvas.height
//             },
//             speed:{
//             // make the explosions go all directions
//             x: 0,
//             y: 0.3
//             },
//             radius: Math.random()*2,
//             color:  "white"
//         }))
//     }


function createParticles ({object, color, fades}){
    //explosions
    for(let i=0; i< 15; i++){
        particles.push(new Particle({
            position:{
                x: object.position.x + object.width/2,
                y: object.position.y + object.height/2
                },
                speed:{
                // make the explosions go all directions
                x: (Math.random()- 0.5) * 2,
                y: (Math.random() -0.5) * 2
                },
                radius: Math.random()*3,
                color:  color || "#BAA9DE",
                fades: fades
            }))
        }
}


//recursive refresh
function animate () {
    // if game over dont run code below
    if(!game.active) return


    requestAnimationFrame(animate)
    ctx.fillStyle = 'black'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    batman.update()
    // render explosions/particles
    particles.forEach((particle, i)=>{
        //background stars looping with random x
        if(particle.position.y -particle.radius > canvas.height){
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

        //remove particle when not visible
        if(particle.opacity <= 0) {
            // console.log('particle')
            setTimeout(()=>{
            particles.splice(i, 1)
            },0)
        }else{
            particle.update()
        }
    })
    
    // console.log(particles)

    enemyProjectiles.forEach( (enemyProjectile, index) => {
        if(enemyProjectile.position.y + enemyProjectile.height >=canvas.height){
            setTimeout(() =>{
                //remove enemyprojectile 
                enemyProjectiles.splice(index, 1)
            }, 0)
        }else{
            enemyProjectile.update()
        }
        //losecondition projectile hits batman
        if(enemyProjectile.position.y + enemyProjectile.height >= batman.position.y&& 
            enemyProjectile.position.x + enemyProjectile.width >= batman.position.x&&
            enemyProjectile.position.x <= batman.position.x + batman.width){
                // console.log("you lose")
                setTimeout(() =>{
                    //remove enemyprojectile  and makes batman disappear
                    enemyProjectiles.splice(index, 1)
                    batman.opacity = 0
                    game.over = true
                }, 0)
                // allows game to show explostion after it is over 
                //and stops game alltogether
                setTimeout(() =>{
                    game.active = false
                    document.querySelector('#restartScreen').style.display='flex'
                }, 2000)
            createParticles({
                object: batman,
                color: "white",
                fades: true
            })
        }
    })
   
//projectiles positions update
projectiles.forEach((projectile, index) =>{
    //deletes projectiles when off screen
    if(projectile.position.y + projectile.radius <= 0){
        //prevents flickering when it leaves the screen adds a frame
        setTimeout(() =>{
            projectiles.splice(index, 1)
        }, 0)
    }else{
        projectile.update()
    }
})

grids.forEach( (grid, gridIndex) =>{
    grid.update()

    //spawn enemy projectiles 
    if(frames % 100 === 0 && grid.invaders.length > 0 ){
        let randomInvader = Math.floor(Math.random() * grid.invaders.length)
        grid.invaders[randomInvader].shoot(enemyProjectiles)
    }

    grid.invaders.forEach((invader, i)=>{

        //moves invaders
        invader.update({speed: grid.speed})
        //projectile hits enemy
        projectiles.forEach((projectile, j)=>{
            //remove enemies when hit
            if(projectile.position.y-projectile.radius <= invader.position.y+ invader.height&&
                 projectile.position.x + projectile.radius>= invader.position.x &&
                 projectile.position.x - projectile.radius<= invader.position.x + invader.width&&
                 projectile.position.y + projectile.radius >= invader.position.y){ 

                setTimeout(()=>{
                    //check if the projectile and enemy are found
                    const invaderFound= grid.invaders.find(invader2=>{
                        return invader2 === invader
                    })
                    const projectileFound = projectiles.find(projectile2=>{
                        return projectile2 === projectile
                    })
                    //remove the projectile and enemy 
                    if(invaderFound&& projectileFound){
                    score += 100
                    scoreEl.innerHTML = score

                     //explosions
                        createParticles({
                            object: invader,
                            fades: true
                        })
                        grid.invaders.splice(i,1)
                        projectiles.splice(j,1)
                        //set new width and position when removing columns
                        if(grid.invaders.length> 0){
                            const firstInvader = grid.invaders[0]
                            const lastInvader = grid.invaders[grid.invaders.length -1]
                            grid.width = lastInvader.position.x - firstInvader.position.x+ lastInvader.width
                            grid.position.x = firstInvader.position.x;
                        }else{
                            //garbage collection of empty grids
                            grid.splice(gridIndex,1)
                        }
                    }
                },0)
            }
        }
        )
    }
        
        )
})

    // manage batman movement speed and not breaking out of boundries
    if(keys.a.pressed && batman.position.x > 0){
        batman.speed.x = -7
        batman.rotation = -0.15
    }else if(keys.d.pressed && batman.position.x + batman.width< canvas.width){
        batman.speed.x = 7
        batman.rotation = 0.15
    }
    else {
        batman.speed.x = 0
    }

    //spawns new grids of enemies every random Time interval
    if(frames %randomInterval === 0){
        grids.push(new Grid())
        // set new random timeinterval
        randomInterval = Math.floor(Math.random() *500 +900)
    }


    frames ++
}
// animate()

//start screen to game
document.querySelector('#startButton').addEventListener('click',()=>{
    document.querySelector('#startScreen').style.display = 'none';
    document.querySelector('#scoreContainer').style.display = 'block';
    init()
    animate()
})

document.querySelector('#restartButton').addEventListener('click',()=>{
    document.querySelector('#restartScreen').style.display = 'none';
    init()
    animate()
})


//destructoring the key from event obj
window.addEventListener('keydown', ({key})=>{
    if(game.over) return

    //check which key was pressed
    // console.log(key)
    switch(key.toLowerCase()){
        case 'a':
            // console.log('left')
            keys.a.pressed = true
            break
        case 'd':
            // console.log('right')
            keys.d.pressed = true
            break    
        case ' ':
            // console.log('shoot')
            projectiles.push(new Projectile({
                position: {
                    x:batman.position.x + batman.width /2,
                    y:batman.position.y,
                },
                speed: {
                    x: 0,
                    y: -10
                }
            }))
            // console.log(projectiles)
            keys.space.pressed = true
            break         
    }
})

window.addEventListener('keyup', ({key})=>{
    //check which key was pressed
    // console.log(key)
    switch(key.toLowerCase()){
        case 'a':
            // console.log('left')
            keys.a.pressed = false
            break
        case 'd':
            // console.log('right')
            keys.d.pressed = false
            break    
        case ' ':
            // console.log('shoot')
            keys.space.pressed = true
            break         
    }
})