import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import Experience from "../Experience";

export default class Boundaries {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.data = [
            { position: [0, 0, 0], quaternion: [-Math.PI * 0.5, 0, 0] }, // floor
            { position: [0, 10, 0], quaternion: [Math.PI * 0.5, 0, 0] }, // ceiling
            { position: [-5, 5, 0], quaternion: [0, Math.PI * 0.5, 0] }, // left
            { position: [5, 5, 0], quaternion: [0, -Math.PI * 0.5, 0] }, // right
            { position: [0, 5, -5], quaternion: [0, 0, 0] },             // back
            { position: [0, 5, 5], quaternion: [0, Math.PI, 0] },        // front
        ]

        this.meshes = []
        this.physics = []

        this.setMeshes()
    }

    setMeshes() {
        this.geometry = new THREE.PlaneGeometry(10, 10, 64, 64)
        this.material = new THREE.MeshStandardMaterial({ color: 0xffffff })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        for (let d of this.data) {
            const mesh = new THREE.Mesh(this.geometry, this.material)
            mesh.position.set(...d.position)
            mesh.quaternion.setFromEuler(new THREE.Euler(...d.quaternion))
            mesh.receiveShadow = true
            this.meshes.push(mesh)
            this.scene.add(mesh)
        }
    }

    setPhysics(material) {
        for (let d of this.data) {
            const wall = new CANNON.Body({
                shape: new CANNON.Plane(),
                type: CANNON.Body.STATIC,
                position: new CANNON.Vec3(...d.position),
                material: material
            })
            wall.quaternion.setFromEuler(...d.quaternion)
            this.physics.push(wall)
        }
    }
}