import * as THREE from 'three'
import Project from './Project'
import gsap from 'gsap'

// --- Import Project Billboard Images from src/images/mobile/ ---
import forgepathDashboard from '../../../images/ForgePath-Dashboard.png'
import forgepathMentor from '../../../images/ForgePath-AI Mentor.png'
import forgepathProgress from '../../../images/ForgePath-Progress Page.png'

import fitnovaHome from '../../../images/FitNova- Home Page.png'
import fitnovaAbout from '../../../images/FitNova- About Page.png'
import fitnovaServices from '../../../images/FitNova- Services Page.png'
import fitnovaPricing from '../../../images/FitNova- Pricing Page.png'

import eggifyHome from '../../../images/Eggify-Home Page.png'
import eggifyMenu from '../../../images/Eggify- Menu.png'
import eggifyTimer from '../../../images/Eggify- Timer.png'
import eggifyChatbot from '../../../images/Eggify- AI Chatbot.png'

export default class ProjectsSection
{
    constructor(_options)
    {
        // Options
        this.time = _options.time
        this.resources = _options.resources
        this.camera = _options.camera
        this.passes = _options.passes
        this.objects = _options.objects
        this.areas = _options.areas
        this.zones = _options.zones
        this.tiles = _options.tiles
        this.debug = _options.debug
        this.x = _options.x
        this.y = _options.y

        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder('projects')
            this.debugFolder.open()
        }

        // Set up
        this.items = []

        this.interDistance = 24
        this.positionRandomess = 5
        this.projectHalfWidth = 9

        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false
        this.container.updateMatrix()

        this.setGeometries()
        this.setMeshes()
        this.setList()
        this.setZone()

        // Cyberpunk dynamic lights array for pulse animation
        this.projectCyberLights = []

        // Add all projects from the list
        for(const _options of this.list)
        {
            this.add(_options)
        }

        this.setCyberAnimations()
    }

    setGeometries()
    {
        this.geometries = {}
        this.geometries.floor = new THREE.PlaneGeometry(16, 8)
    }

    setMeshes()
    {
        this.meshes = {}

        this.resources.items.areaOpenTexture.magFilter = THREE.NearestFilter
        this.resources.items.areaOpenTexture.minFilter = THREE.LinearFilter
        
        // Cyberpunk Emissive Neon Area Label
        this.meshes.boardPlane = this.resources.items.projectsBoardPlane.scene.children[0]
        this.meshes.areaLabel = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 0.5),
            new THREE.MeshBasicMaterial({
                transparent: true,
                depthWrite: false,
                color: 0x00f3ff,
                alphaMap: this.resources.items.areaOpenTexture
            })
        )
        this.meshes.areaLabel.matrixAutoUpdate = false
    }

    /**
     * Generates a high-resolution canvas floor texture with Title & Description
     */
    createFloorTexture(title, description)
    {
        const canvas = document.createElement('canvas')
        canvas.width = 2048
        canvas.height = 1024
        const context = canvas.getContext('2d')

        // Clear transparent canvas
        context.clearRect(0, 0, canvas.width, canvas.height)

        // 1. Draw Project Title (Bold white text)
        context.font = 'bold 110px "Impact", "Arial Black", sans-serif'
        context.fillStyle = '#FFFFFF'
        context.textAlign = 'left'
        context.textBaseline = 'top'
        context.fillText(title.toUpperCase(), 80, 180)

        // 2. Draw Project Description (Cyberpunk Cyan text)
        context.font = '500 48px "Arial", sans-serif'
        context.fillStyle = '#00F3FF'

        // Word wrapper for multi-line descriptions
        const words = description.split(' ')
        let line = ''
        let y = 330
        const maxWidth = 1800
        const lineHeight = 65

        for(let n = 0; n < words.length; n++)
        {
            const testLine = line + words[n] + ' '
            const metrics = context.measureText(testLine)
            if (metrics.width > maxWidth && n > 0)
            {
                context.fillText(line, 80, y)
                line = words[n] + ' '
                y += lineHeight
            }
            else
            {
                line = testLine
            }
        }
        context.fillText(line, 80, y)

        const texture = new THREE.CanvasTexture(canvas)
        texture.magFilter = THREE.LinearFilter
        texture.minFilter = THREE.LinearFilter
        texture.needsUpdate = true

        return texture
    }

    setList()
    {
        this.list = [
            {
                name: 'ForgePath AI',
                description: 'AI-Powered Career Guidance & Personal Learning Mentor Platform',
                imageSources: [
                    forgepathDashboard,
                    forgepathMentor,
                    forgepathProgress
                ],
                floorTexture: null,
                link:
                {
                    href: 'https://forgepath-ai.ai.studio/',
                    x: - 4.8,
                    y: - 3,
                    halfExtents:
                    {
                        x: 3.2,
                        y: 1.5
                    }
                },
                distinctions: []
            },
            {
                name: 'Fitnova',
                description: 'Modern Fitness, Gym Management & Health Services Portal',
                imageSources: [
                    fitnovaHome,
                    fitnovaAbout,
                    fitnovaServices,
                    fitnovaPricing
                ],
                floorTexture: null,
                link:
                {
                    href: 'https://github.com/CaptainFlip16/Fitnova-website',
                    x: - 4.8,
                    y: - 3,
                    halfExtents:
                    {
                        x: 3.2,
                        y: 1.5
                    }
                },
                distinctions: []
            },
            {
                name: 'Eggify',
                description: 'AI Culinary Assistant & Smart Cooking Timer Web App',
                imageSources: [
                    eggifyHome,
                    eggifyMenu,
                    eggifyTimer,
                    eggifyChatbot
                ],
                floorTexture: null,
                link:
                {
                    href: 'https://github.com/CaptainFlip16/Eggify-Website',
                    x: - 4.8,
                    y: - 3,
                    halfExtents:
                    {
                        x: 3.2,
                        y: 1.5
                    }
                },
                distinctions: []
            }
        ]

        // Dynamically create and attach floor textures with titles + descriptions
        for(const project of this.list)
        {
            project.floorTexture = this.createFloorTexture(project.name, project.description)
        }
    }

    setZone()
    {
        const totalWidth = this.list.length * (this.interDistance / 2)

        const zone = this.zones.add({
            position: { x: this.x + totalWidth - this.projectHalfWidth - 6, y: this.y },
            halfExtents: { x: totalWidth, y: 12 },
            data: { cameraAngle: 'projects' }
        })

        zone.on('in', (_data) =>
        {
            this.camera.angle.set(_data.cameraAngle)
            gsap.to(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, { x: 0, duration: 2 })
            gsap.to(this.passes.verticalBlurPass.material.uniforms.uStrength.value, { y: 0, duration: 2 })
        })

        zone.on('out', () =>
        {
            this.camera.angle.set('default')
            gsap.to(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, { x: this.passes.horizontalBlurPass.strength, duration: 2 })
            gsap.to(this.passes.verticalBlurPass.material.uniforms.uStrength.value, { y: this.passes.verticalBlurPass.strength, duration: 2 })
        })
    }

    add(_options)
    {
        const x = this.x + this.items.length * this.interDistance
        let y = this.y
        if(this.items.length > 0)
        {
            y += (Math.random() - 0.5) * this.positionRandomess
        }

        // Create project
        const project = new Project({
            time: this.time,
            resources: this.resources,
            objects: this.objects,
            areas: this.areas,
            geometries: this.geometries,
            meshes: this.meshes,
            debug: this.debugFolder,
            x: x,
            y: y,
            ..._options
        })

        this.container.add(project.container)

        // Cyberpunk Neon Spotlight per Project Board (alternating colors: Cyan, Pink, Purple)
        const colors = [0x00f3ff, 0xff0077, 0xbd00ff]
        const neonColor = colors[this.items.length % colors.length]
        const cyberLight = new THREE.PointLight(neonColor, 5, 14)
        cyberLight.position.set(x, y, 4)
        this.container.add(cyberLight)

        this.projectCyberLights.push({
            light: cyberLight,
            baseIntensity: 5,
            offset: this.items.length
        })

        // Add tiles
        if(this.items.length >= 1)
        {
            const previousProject = this.items[this.items.length - 1]
            const start = new THREE.Vector2(previousProject.x + this.projectHalfWidth, previousProject.y)
            const end = new THREE.Vector2(project.x - this.projectHalfWidth, project.y)
            const delta = end.clone().sub(start)
            this.tiles.add({
                start: start,
                delta: delta
            })
        }

        // Save
        this.items.push(project)
    }

    setCyberAnimations()
    {
        // Continuous pulsing animation for project neon lights
        this.time.on('tick', () =>
        {
            const elapsedTime = this.time.elapsed * 0.003
            for(const item of this.projectCyberLights)
            {
                item.light.intensity = item.baseIntensity + Math.sin(elapsedTime + item.offset) * 1.5
            }
        })
    }
}