import * as THREE from 'three'

export default class ActivitiesBillboard
{
    constructor(_options)
    {
        this.time = _options.time
        this.resources = _options.resources
        this.scene = _options.scene
        this.x = _options.x || 0
        this.y = _options.y || 0
        this.scale = _options.scale || 1.0

        this.container = new THREE.Object3D()
        this.container.position.set(this.x, this.y, 0)
        this.container.scale.set(this.scale, this.scale, this.scale)

        this.setCanvasTexture()
        this.setBillboardMesh()
    }

    setCanvasTexture()
    {
        // 1. High-Resolution Canvas (1024 x 1024)
        const canvas = document.createElement('canvas')
        canvas.width = 1024
        canvas.height = 1024
        const ctx = canvas.getContext('2d')

        // Clear Background with semi-transparent dark panel
        ctx.fillStyle = '#0d0f18'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Outer Neon Border
        ctx.strokeStyle = '#ff0055'
        ctx.lineWidth = 16
        ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32)

        // Header: ACTIVITIES
        ctx.fillStyle = '#ff0055'
        ctx.font = '900 68px "Arial Black", sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.shadowColor = '#ff0055'
        ctx.shadowBlur = 25
        ctx.fillText('ACTIVITIES & ROLES', canvas.width / 2, 60)
        ctx.shadowBlur = 0 // Reset glow for body text

        // Activity Data List
        const items = [
            { title: 'STUDENT : BS COMPUTER SCIENCE', date: '2024 >>> PRESENT', color: '#00f3ff' },
            { title: 'CREATIVE WEB DEVELOPER',       date: '2024 >>> PRESENT', color: '#00ff88' },
            { title: 'AI AUTOMATION ENGINEER',       date: '2026 >>> PRESENT', color: '#ff0077' },
            { title: 'FREELANCER',                   date: '2022 >>> PRESENT', color: '#ffa500' }
        ]

        let startY = 180
        const cardHeight = 175

        items.forEach((item, index) =>
        {
            const y = startY + index * cardHeight

            // Card Background Panel
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
            ctx.fillRect(60, y, canvas.width - 120, 140)

            // Accent Left Stripe
            ctx.fillStyle = item.color
            ctx.fillRect(60, y, 12, 140)

            // Role Title
            ctx.fillStyle = '#ffffff'
            ctx.font = '900 38px "Arial Black", sans-serif'
            ctx.textAlign = 'left'
            ctx.fillText(item.title, 95, y + 30)

            // Date Badge (Pill Container)
            ctx.fillStyle = item.color
            ctx.font = '700 28px sans-serif'
            ctx.fillText(`🗓️  ${item.date}`, 95, y + 85)
        })

        this.texture = new THREE.CanvasTexture(canvas)
        this.texture.magFilter = THREE.LinearFilter
        this.texture.minFilter = THREE.LinearFilter
        this.texture.needsUpdate = true
    }

    setBillboardMesh()
    {
        // 2. Main Billboard Display Board Plane
        const width = 8
        const height = 8
        const boardGeometry = new THREE.PlaneGeometry(width, height)
        const boardMaterial = new THREE.MeshBasicMaterial({
            map: this.texture,
            side: THREE.DoubleSide
        })

        this.boardMesh = new THREE.Mesh(boardGeometry, boardMaterial)
        
        // Tilt mesh upright to face the camera nicely
        this.boardMesh.position.z = 4.2
        this.boardMesh.rotation.x = Math.PI * 0.28 // Adjust angle for camera perspective
        this.container.add(this.boardMesh)

        // 3. 3D Bezel & Legs (Wooden / Metallic Stand)
        const legGeo = new THREE.CylinderGeometry(0.12, 0.12, 5, 16)
        const legMat = new THREE.MeshBasicMaterial({ color: 0x222533 })

        // Left Leg
        const leftLeg = new THREE.Mesh(legGeo, legMat)
        leftLeg.position.set(-3.8, 0, 2.5)
        leftLeg.rotation.x = Math.PI * 0.5
        this.container.add(leftLeg)

        // Right Leg
        const rightLeg = new THREE.Mesh(legGeo, legMat)
        rightLeg.position.set(3.8, 0, 2.5)
        rightLeg.rotation.x = Math.PI * 0.5
        this.container.add(rightLeg)
    }
}