export default class Sizes {
    constructor() {
        // Setup
        this.onResize()
    }

    onResize() {
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    }
}