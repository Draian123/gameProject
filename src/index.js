const canvas = document.querySelector('canvas');
const ctx= canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


class Batman {
    constructor(){
        //stating position
        this.speed = {
            x: 0,
            y: 0
        }
        this.rotation = 0;

        const image = new Image();
        image.src = './images/spaceship.png'
        image.onload = () => {
            this.image = image
            this.width = image.width *.15
            this.height = image.height *.15
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height  - this.height - 20
            }
        }

    }

    draw() {
        //save and restore needed for rotate
        ctx.save()
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


const batman = new Batman()
//monitor keypresses
const keys = {
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

//recursive refresh
function animate () {
    // console.log('animating')
    requestAnimationFrame(animate)
    ctx.fillStyle = 'black'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    batman.update()
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

}
animate()


//destructoring the key from event obj
window.addEventListener('keydown', ({key})=>{
    //check which key was pressed
    console.log(key)
    switch(key){
        case 'a':
            console.log('left')
            keys.a.pressed = true
            break
        case 'd':
            console.log('right')
            keys.d.pressed = true
            break    
        case ' ':
            console.log('shoot')
            keys.space.pressed = true
            break         
    }
})

window.addEventListener('keyup', ({key})=>{
    //check which key was pressed
    // console.log(key)
    switch(key){
        case 'a':
            console.log('left')
            keys.a.pressed = false
            break
        case 'd':
            console.log('right')
            keys.d.pressed = false
            break    
        case ' ':
            console.log('shoot')
            keys.space.pressed = true
            break         
    }
})