import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Experience from '../Experience'

export default class Car {
    constructor(position, controls, direction) {
        this.experience = new Experience()
        this.scene = this.experience.scene

        // Setup
        this.controlsMapping = controls
        this.direction = direction
        this.stats = {
            position,
            parts: {
                chassis: {
                    mass: 1000,
                    size: [0.3, 0.12, 0.2]
                },
                wheels: {
                    mass: 50,
                    size: 0.1,
                    shape: new CANNON.Sphere(0.1)
                }
            },
            bottomGap: 0.08,
            axisWidth: 0.3 + 0.1 * 2,
            maxSteerValue: Math.PI / 8,
            maxForce: 200
        }

        window.addEventListener('keydown', (e) => {
            this.move(e.code, true)
        })

        window.addEventListener('keyup', (e) => {
            this.move(e.code, false)
        })
    }

    setPhysics(wheelMaterial) {
        const chassisBody = new CANNON.Body({
            mass: this.stats.parts.chassis.mass,
            position: new CANNON.Vec3(...this.stats.position),
            shape: new CANNON.Box(new CANNON.Vec3(...this.stats.parts.chassis.size))
        })

        this.vehicle = new CANNON.RigidVehicle({ chassisBody })

        const wheelData = [
            { positionMultiplier: 1, axisDevider: 2 },
            { positionMultiplier: -1, axisDevider: 1.6 }
        ]
        for (const data of wheelData) {
            for (let i = 0; i < 2; i++) {
                const yPos = this.stats.axisWidth / data.axisDevider
                const body = new CANNON.Body({
                    mass: this.stats.parts.wheels.mass,
                    material: wheelMaterial,
                    angularDamping: 0.4
                })
                body.addShape(this.stats.parts.wheels.shape)
                this.vehicle.addWheel({
                    body,
                    position: new CANNON.Vec3(
                        this.stats.parts.chassis.size[0] * data.positionMultiplier * -this.direction,
                        - this.stats.bottomGap,
                        i > 0 ? -yPos : yPos
                    ),
                    axis: new CANNON.Vec3(0, 0, data.positionMultiplier * this.direction)
                })
            }
        }
    }

    move(key, toggle) {
        const force = toggle ? this.stats.maxForce : 0
        const steer = toggle ? this.stats.maxSteerValue : 0
        switch (key) {
            case this.controlsMapping.gas:
                this.vehicle.setWheelForce(force, 0)
                this.vehicle.setWheelForce(force, 1)
                break;
            case this.controlsMapping.brake:
                this.vehicle.setWheelForce(-force, 0)
                this.vehicle.setWheelForce(-force, 1)
                break;
            case this.controlsMapping.left:
                this.vehicle.setSteeringValue(steer, 0)
                this.vehicle.setSteeringValue(steer, 1)
                break;
            case this.controlsMapping.right:
                this.vehicle.setSteeringValue(-steer, 0)
                this.vehicle.setSteeringValue(-steer, 1)
                break;
        }
    }
}

