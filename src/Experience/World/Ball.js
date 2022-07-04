import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Experience from '../Experience'

export default class Ball {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.radius = 0.18
        this.position = [0, 1, 0]

        this.setMesh()
    }

    setMesh() {
        this.geometry = new THREE.SphereGeometry(this.radius, 128, 128)
        this.material = new THREE.MeshStandardMaterial({ color: 0xffffff })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.receiveShadow = true
        this.mesh.castShadow = true
        this.mesh.position.set(...this.position)
        this.scene.add(this.mesh)
    }

    setPhysics(material) {
        this.physics = {
            shape: new CANNON.Sphere(this.radius),
            body: new CANNON.Body({
                mass: 1,
                position: new CANNON.Vec3(...this.position),
                material
            })
        }
        this.physics.body.addShape(this.physics.shape)
    }
}