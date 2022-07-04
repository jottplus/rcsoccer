
import * as THREE from 'three'
import Sizes from "./Utils/Sizes"
import Time from './Utils/Time'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import CannonDebugger from 'cannon-es-debugger'

let instance = null

export default class Experience {
    constructor(canvas) {
        // Singleton
        if (instance) return instance
        instance = this

        // Setup
        this.canvas = canvas
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        this.world.setPhysics()
        this.cannonDebugger = new CannonDebugger(this.scene, this.world.physics, {})

        // Resize
        window.addEventListener('resize', () => {
            this.resize()
        })

        // Update
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick() {
        this.time.tick()
        this.update()
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    resize() {
        this.sizes.onResize()
        this.camera.onResize()
        this.renderer.onResize()
    }

    update() {
        // this.world.physics.step(1 / 60, this.time.delta, 3)
        this.world.physics.fixedStep()

        // Update Ball
        this.world.ball.mesh.position.copy(this.world.ball.physics.body.position)
        this.world.ball.mesh.quaternion.copy(this.world.ball.physics.body.quaternion)

        // Update Cars
        // this.world.homeCar.mesh.position.copy(this.world.homeCar.physics.body.position)
        // this.world.homeCar.mesh.quaternion.copy(this.world.homeCar.physics.body.quaternion)
        // this.world.awayCar.mesh.position.copy(this.world.awayCar.physics.body.position)
        // this.world.awayCar.mesh.quaternion.copy(this.world.awayCar.physics.body.quaternion)

        // this.camera.update()
        // this.world.update()
        this.cannonDebugger.update()
        this.renderer.onUpdate()
    }
}