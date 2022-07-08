import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import Experience from "../Experience";

export default class Boundaries {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.planeData = [
            { position: [0, 0, 0], quaternion: [-Math.PI * 0.5, 0, 0] }, // floor
            { position: [0, 10, 0], quaternion: [Math.PI * 0.5, 0, 0] }, // ceiling
            { position: [-6, 5, 0], quaternion: [0, Math.PI * 0.5, 0] }, // left
            { position: [6, 5, 0], quaternion: [0, -Math.PI * 0.5, 0] }, // right
            { position: [0, 5, -5], quaternion: [0, 0, 0] },             // back
            { position: [0, 5, 5], quaternion: [0, Math.PI, 0] },        // front
        ]
        this.postShape = [0.5, 0.75, 1.75]
        this.barShape = [0.5, 4.625, 5]
        this.boxData = [
            { shape: this.postShape, position: [-5.5, 0.75, -3.25] }, // left side - right post
            { shape: this.postShape, position: [-5.5, 0.75, 3.25] },  // left side - left post
            { shape: this.postShape, position: [5.5, 0.75, -3.25] },  // right side - left post
            { shape: this.postShape, position: [5.5, 0.75, 3.25] },   // right side - right side
            { shape: this.barShape, position: [-5.5, 6.125, 0] },     // left side - goal bar
            { shape: this.barShape, position: [5.5, 6.125, 0] }       // right side - goal bar
        ]

        this.planeMeshes = []
        this.boxMeshes = []
        this.physics = []

        this.setMeshes()
    }

    setMeshes() {
        this.planeGeometry = new THREE.PlaneGeometry(12, 12, 64, 64)
        this.material = new THREE.MeshStandardMaterial({ color: 0xffffff })

        for (let plane of this.planeData) {
            const mesh = new THREE.Mesh(this.planeGeometry, this.material)
            mesh.position.set(...plane.position)
            mesh.quaternion.setFromEuler(new THREE.Euler(...plane.quaternion))
            mesh.receiveShadow = true
            this.planeMeshes.push(mesh)
            this.scene.add(mesh)
        }

        for (let box of this.boxData) {
            const boxGeometry = new THREE.BoxGeometry(box.shape[0] * 2, box.shape[1] * 2, box.shape[2] * 2)
            const mesh = new THREE.Mesh(boxGeometry, this.material)
            mesh.position.set(...box.position)
            mesh.receiveShadow = true
            this.boxMeshes.push(mesh)
            this.scene.add(mesh)
        }
    }

    setPhysics(material) {
        // set plane physics
        for (let plane of this.planeData) {
            const wall = new CANNON.Body({
                shape: new CANNON.Plane(),
                type: CANNON.Body.STATIC,
                position: new CANNON.Vec3(...plane.position),
                material: material
            })
            wall.quaternion.setFromEuler(...plane.quaternion)
            this.physics.push(wall)
        }

        // set box physics - they build the goals
        for (let box of this.boxData) {
            const body = new CANNON.Body({
                shape: new CANNON.Box(new CANNON.Vec3(...box.shape)),
                position: new CANNON.Vec3(...box.position),
                material: material
            })
            this.physics.push(body)
        }
    }
}