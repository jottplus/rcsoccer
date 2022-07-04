import * as CANNON from 'cannon-es'
import Experience from '../Experience'
import Ball from './Ball'
import Boundaries from './Boundaries'
import Car from './Car'
import Environment from './Environment'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        // Objects
        this.boundaries = new Boundaries()
        this.ball = new Ball()
        this.cars = [
            new Car(
                [-3, 1, 0],
                {
                    gas: 'KeyW',
                    brake: 'KeyS',
                    left: 'KeyA',
                    right: 'KeyD'
                },
                -1
            ),
            new Car(
                [3, 1, 0],
                {
                    gas: 'ArrowUp',
                    brake: 'ArrowDown',
                    left: 'ArrowLeft',
                    right: 'ArrowRight'
                },
                1
            )
        ]
        this.environment = new Environment()

        this.physicsData = {
            materials: {
                floor: new CANNON.Material('floor'),
                ball: new CANNON.Material('ball'),
                wheel: new CANNON.Material('wheel')
            }
        }

        this.physicsData.contactMaterials = {
            floorBall: new CANNON.ContactMaterial(
                this.physicsData.materials.floor,
                this.physicsData.materials.ball,
                {
                    friction: 0.1,
                    restitution: 0.7
                }
            ),
            floorWheel: new CANNON.ContactMaterial(
                this.physicsData.materials.floor,
                this.physicsData.materials.wheel,
                {
                    friction: 0.23,
                    restitution: 0.7
                }
            )
        }
    }

    setPhysics() {
        // Init Physics
        this.physics = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0)
        })
        this.physics.broadphase = new CANNON.SAPBroadphase(this.physics)

        // Set contact materials
        for (const contact of Object.keys(this.physicsData.contactMaterials)) {
            this.physics.addContactMaterial(
                this.physicsData.contactMaterials[contact]
            )
        }
        this.physics.defaultContactMaterial = this.physicsData.contactMaterials.floorBall

        // init boundaries physics
        this.boundaries.setPhysics(this.physicsData.materials.floor)
        for (const wall of this.boundaries.physics) {
            this.physics.addBody(wall)
        }

        // init ball physics
        this.ball.setPhysics(this.physicsData.materials.ball)
        this.physics.addBody(this.ball.physics.body)

        // init car physics
        for (const car of this.cars) {
            car.setPhysics(this.physicsData.materials.wheel)
            car.vehicle.addToWorld(this.physics)
        }
    }
}