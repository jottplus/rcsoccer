import * as THREE from 'three'
import Experience from '../Experience'

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.data = [
            [-5, 10, -5],
            [-5, 10, 5],
            [5, 10, -5],
            [5, 10, 5]
        ]

        this.setDirectionalLights()
        this.setAmbientLight()
    }

    setDirectionalLights() {
        this.directionLights = []
        for (const d of this.data) {
            const light = new THREE.DirectionalLight(0xffffff, 0.3)
            light.position.set(...d)
            light.castShadow = true
            this.scene.add(light)
        }
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
        this.directionalLight.position.set(-5, 10, -5)
        this.directionalLight.castShadow = true
        this.scene.add(this.directionalLight)
    }

    setAmbientLight() {
        this.ambientLight = new THREE.AmbientLight(0x1700c2, 0.5)
        this.scene.add(this.ambientLight)
    }
}