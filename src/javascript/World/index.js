import * as THREE from 'three'
import Materials from './Materials.js'
import Floor from './Floor.js'
import Shadows from './Shadows.js'
import Physics from './Physics.js'
import Zones from './Zones.js'
import Objects from './Objects.js'
import Car from './Car.js'
import Areas from './Areas.js'
import Tiles from './Tiles.js'
import Walls from './Walls.js'
import IntroSection from './Sections/IntroSection.js'
import ProjectsSection from './Sections/ProjectsSection.js'
import CrossroadsSection from './Sections/CrossroadsSection.js'
import InformationSection from './Sections/InformationSection.js'
import PlaygroundSection from './Sections/PlaygroundSection.js'
import ActivitiesBillboard from './Sections/ActivitiesBillboard.js'
// import DistinctionASection from './Sections/DistinctionASection.js'
// import DistinctionBSection from './Sections/DistinctionBSection.js'
// import DistinctionCSection from './Sections/DistinctionCSection.js'
// import DistinctionDSection from './Sections/DistinctionDSection.js'
import Controls from './Controls.js'
import Sounds from './Sounds.js'
import gsap from 'gsap'
import EasterEggs from './EasterEggs.js'

export default class World
{
    constructor(_options)
    {
        // Options
        this.config = _options.config
        this.debug = _options.debug
        this.resources = _options.resources
        this.time = _options.time
        this.sizes = _options.sizes
        this.camera = _options.camera
        this.scene = _options.scene
        
        // Cyberpunk Sci-Fi Scene Setup
        this.scene.background = new THREE.Color(0x070a13)
        this.scene.fog = new THREE.FogExp2(0x070a13, 0.012)

        this.renderer = _options.renderer
        this.passes = _options.passes

        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder('world')
            this.debugFolder.open()
        }

        // Set up
        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false

        // this.setAxes()
        this.setSounds()
        this.setControls()
        this.setFloor()
        this.setAreas()
        this.setStartingScreen()
        
    }

    start()
    {
        window.setTimeout(() =>
        {
            this.camera.pan.enable()
        }, 2000)

        this.setReveal()
        this.setMaterials()
        this.setShadows()
        this.setPhysics()
        this.setZones()
        this.setObjects()
        this.setCar()
        this.areas.car = this.car
        this.setTiles()
        this.setWalls()
        this.setSections()
        this.setEasterEggs()
    }

    setReveal()
    {
        this.reveal = {}
        this.reveal.matcapsProgress = 0
        this.reveal.floorShadowsProgress = 0
        this.reveal.previousMatcapsProgress = null
        this.reveal.previousFloorShadowsProgress = null

        // Go method
        this.reveal.go = () =>
        {
            gsap.fromTo(this.reveal, { matcapsProgress: 0 }, { matcapsProgress: 1, duration: 3 })
            gsap.fromTo(this.reveal, { floorShadowsProgress: 0 }, { floorShadowsProgress: 1, duration: 3, delay: 0.5 })
            gsap.fromTo(this.shadows, { alpha: 0 }, { alpha: 0.5, duration: 3, delay: 0.5 })

            if(this.sections.intro)
            {
                gsap.fromTo(this.sections.intro.instructions.arrows.label.material, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.5 })
                if(this.sections.intro.otherInstructions)
                {
                    gsap.fromTo(this.sections.intro.otherInstructions.label.material, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.75 })
                }
            }

            // Car
            this.physics.car.chassis.body.sleep()
            this.physics.car.chassis.body.position.set(0, 0, 12)

            window.setTimeout(() =>
            {
                this.physics.car.chassis.body.wakeUp()
            }, 300)

            // Sound
            gsap.fromTo(this.sounds.engine.volume, { master: 0 }, { master: 0.7, duration: 0.5, delay: 0.3, ease: 'power2.in' })
            window.setTimeout(() =>
            {
                this.sounds.play('reveal')
            }, 400)

            // Controls
            if(this.controls.touch)
            {
                window.setTimeout(() =>
                {
                    this.controls.touch.reveal()
                }, 400)
            }
        }

        // Time tick
        this.time.on('tick',() =>
        {
            // Matcap progress changed
            if(this.reveal.matcapsProgress !== this.reveal.previousMatcapsProgress)
            {
                // Update each material
                for(const _materialKey in this.materials.shades.items)
                {
                    const material = this.materials.shades.items[_materialKey]
                    material.uniforms.uRevealProgress.value = this.reveal.matcapsProgress
                }

                // Save
                this.reveal.previousMatcapsProgress = this.reveal.matcapsProgress
            }

            // Matcap progress changed
            if(this.reveal.floorShadowsProgress !== this.reveal.previousFloorShadowsProgress)
            {
                // Update each floor shadow
                for(const _mesh of this.objects.floorShadows)
                {
                    _mesh.material.uniforms.uAlpha.value = this.reveal.floorShadowsProgress
                }

                // Save
                this.reveal.previousFloorShadowsProgress = this.reveal.floorShadowsProgress
            }
        })

        // Debug
        if(this.debug)
        {
            this.debugFolder.add(this.reveal, 'matcapsProgress').step(0.0001).min(0).max(1).name('matcapsProgress')
            this.debugFolder.add(this.reveal, 'floorShadowsProgress').step(0.0001).min(0).max(1).name('floorShadowsProgress')
            this.debugFolder.add(this.reveal, 'go').name('reveal')
        }
    }

    setStartingScreen()
{
    this.startingScreen = {}

    // 1. Floor Area Setup
    this.startingScreen.area = this.areas.add({
        position: new THREE.Vector2(0, 0),
        halfExtents: new THREE.Vector2(2.35, 1.5),
        hasKey: false,
        testCar: false,
        active: false
    })

    // 🎨 Helper Function: Creates crisp procedural text textures with glowing effects
    const createTextTexture = (text, glowColor = '#00f3ff', fontSize = 84) =>
    {
        const canvas = document.createElement('canvas')
        canvas.width = 1024  // Doubled canvas resolution for super sharp 3D text
        canvas.height = 256
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Text formatting & styling
        ctx.fillStyle = '#ffffff'
        ctx.font = `900 ${fontSize}px "Arial Black", sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Sci-Fi Glow Effect
        ctx.shadowColor = glowColor
        ctx.shadowBlur = 20

        ctx.fillText(text, canvas.width / 2, canvas.height / 2)

        const texture = new THREE.CanvasTexture(canvas)
        texture.magFilter = THREE.LinearFilter
        texture.minFilter = THREE.LinearFilter
        texture.needsUpdate = true
        return texture
    }

    // 2. Loading Label Setup ("LOADING...")
    this.startingScreen.loadingLabel = {}
    this.startingScreen.loadingLabel.geometry = new THREE.PlaneGeometry(4.4, 1.1)
    this.startingScreen.loadingLabel.texture = createTextTexture('LOADING...', '#ff0077', 72)
    this.startingScreen.loadingLabel.material = new THREE.MeshBasicMaterial({ 
        map: this.startingScreen.loadingLabel.texture,
        transparent: true, 
        depthWrite: false,
        opacity: 1 
    })
    this.startingScreen.loadingLabel.mesh = new THREE.Mesh(
        this.startingScreen.loadingLabel.geometry, 
        this.startingScreen.loadingLabel.material
    )
    this.startingScreen.loadingLabel.mesh.position.set(0, 0, 0.15) // Raised Z to prevent clipping with floor
    this.startingScreen.loadingLabel.mesh.matrixAutoUpdate = false
    this.startingScreen.loadingLabel.mesh.updateMatrix()
    this.container.add(this.startingScreen.loadingLabel.mesh)

    // 3. Start Label Setup ("PRESS ENTER")
    this.startingScreen.startLabel = {}
    this.startingScreen.startLabel.geometry = new THREE.PlaneGeometry(4.4, 1.1)
    this.startingScreen.startLabel.texture = createTextTexture('Click Here to Start', '#00f3ff', 84)
    this.startingScreen.startLabel.material = new THREE.MeshBasicMaterial({ 
        map: this.startingScreen.startLabel.texture,
        transparent: true, 
        depthWrite: false,
        opacity: 0 
    })
    this.startingScreen.startLabel.mesh = new THREE.Mesh(
        this.startingScreen.startLabel.geometry, 
        this.startingScreen.startLabel.material
    )
    this.startingScreen.startLabel.mesh.position.set(0, 0, 0.15) // Raised Z to prevent clipping with floor
    this.startingScreen.startLabel.mesh.matrixAutoUpdate = false
    this.startingScreen.startLabel.mesh.updateMatrix()
    this.container.add(this.startingScreen.startLabel.mesh)

    // 4. Progress Listener
    this.resources.on('progress', (_progress) =>
    {
        if (this.startingScreen.area && this.startingScreen.area.floorBorder)
        {
            this.startingScreen.area.floorBorder.material.uniforms.uAlpha.value = 1
            this.startingScreen.area.floorBorder.material.uniforms.uLoadProgress.value = _progress
        }
    })

    // 5. Reveal Start Label Callback
    const revealStartLabel = () =>
    {
        window.requestAnimationFrame(() =>
        {
            this.startingScreen.area.activate()

            if (this.startingScreen.area && this.startingScreen.area.floorBorder)
            {
                gsap.to(this.startingScreen.area.floorBorder.material.uniforms.uAlpha, { value: 0.3, duration: 0.3 })
            }
            gsap.to(this.startingScreen.loadingLabel.material, { opacity: 0, duration: 0.3 })
            gsap.to(this.startingScreen.startLabel.material, { opacity: 1, duration: 0.3, delay: 0.3 })
        })
    }

    // Handles both fast preloading and standard event listeners
    if (this.resources.ready)
    {
        revealStartLabel()
    }
    else
    {
        this.resources.on('ready', revealStartLabel)
    }

    // 6. On Interact (Press Enter / Driving out)
    this.startingScreen.area.on('interact', () =>
    {
        this.startingScreen.area.deactivate()

        if (this.startingScreen.area && this.startingScreen.area.floorBorder)
        {
            gsap.to(this.startingScreen.area.floorBorder.material.uniforms.uProgress, { value: 0, duration: 0.3, delay: 0.4 })
        }

        gsap.to(this.startingScreen.startLabel.material, { opacity: 0, duration: 0.3, delay: 0.4 })

        this.start()

        window.setTimeout(() =>
        {
            if (this.reveal) this.reveal.go()
        }, 600)
    })
}

    setSounds()
    {
        this.sounds = new Sounds({
            debug: this.debugFolder,
            time: this.time
        })
    }

    setAxes()
    {
        this.axis = new THREE.AxesHelper()
        this.container.add(this.axis)
    }

    setControls()
    {
        this.controls = new Controls({
            config: this.config,
            sizes: this.sizes,
            time: this.time,
            camera: this.camera,
            sounds: this.sounds
        })
    }

    setMaterials()
    {
        this.materials = new Materials({
            resources: this.resources,
            debug: this.debugFolder
        })
    }

    setFloor()
    {
        this.floor = new Floor({
            debug: this.debugFolder
        })

        this.container.add(this.floor.container)
    }

    setShadows()
    {
        this.shadows = new Shadows({
            time: this.time,
            debug: this.debugFolder,
            renderer: this.renderer,
            camera: this.camera
        })
        this.container.add(this.shadows.container)
    }

    setPhysics()
    {
        this.physics = new Physics({
            config: this.config,
            debug: this.debug,
            scene: this.scene,
            time: this.time,
            sizes: this.sizes,
            controls: this.controls,
            sounds: this.sounds
        })

        this.container.add(this.physics.models.container)
    }

    setZones()
    {
        this.zones = new Zones({
            time: this.time,
            physics: this.physics,
            debug: this.debugFolder
        })
        this.container.add(this.zones.container)
    }

    setAreas()
    {
        this.areas = new Areas({
            config: this.config,
            resources: this.resources,
            debug: this.debug,
            renderer: this.renderer,
            camera: this.camera,
            car: this.car,
            sounds: this.sounds,
            time: this.time
        })

        this.container.add(this.areas.container)
    }

    setTiles()
    {
        this.tiles = new Tiles({
            resources: this.resources,
            objects: this.objects,
            debug: this.debug
        })
    }

    setWalls()
    {
        this.walls = new Walls({
            resources: this.resources,
            objects: this.objects
        })
    }

    setObjects()
    {
        this.objects = new Objects({
            time: this.time,
            resources: this.resources,
            materials: this.materials,
            physics: this.physics,
            shadows: this.shadows,
            sounds: this.sounds,
            debug: this.debugFolder
        })
        this.container.add(this.objects.container)
    }

    setCar()
    {
        this.car = new Car({
            time: this.time,
            resources: this.resources,
            objects: this.objects,
            physics: this.physics,
            shadows: this.shadows,
            materials: this.materials,
            controls: this.controls,
            sounds: this.sounds,
            renderer: this.renderer,
            camera: this.camera,
            debug: this.debugFolder,
            config: this.config
        })
        this.container.add(this.car.container)
    }

    setSections()
    {
        this.sections = {}

        // Generic options
        const options = {
            config: this.config,
            time: this.time,
            resources: this.resources,
            camera: this.camera,
            passes: this.passes,
            objects: this.objects,
            areas: this.areas,
            zones: this.zones,
            walls: this.walls,
            tiles: this.tiles,
            debug: this.debugFolder
        }

        // Intro
        this.sections.intro = new IntroSection({
            ...options,
            x: 0,
            y: 0
        })
        this.container.add(this.sections.intro.container)

        // Crossroads
        this.sections.crossroads = new CrossroadsSection({
            ...options,
            x: 0,
            y: - 30
        })
        this.container.add(this.sections.crossroads.container)

        // Projects
        this.sections.projects = new ProjectsSection({
            ...options,
            x: 30,
            y: - 30
        })
        this.container.add(this.sections.projects.container)

        // Information
        this.sections.information = new InformationSection({
            ...options,
            x: 1.2,
            y: - 55
        })
        this.container.add(this.sections.information.container)

        // Playground
        this.sections.playground = new PlaygroundSection({
            ...options,
            x: - 38,
            y: - 34
        })
        this.container.add(this.sections.playground.container)

        this.activitiesBoard = new ActivitiesBillboard({
    time: this.time,
    resources: this.resources,
    scene: this.scene,
    scale: 0.9,     // Scale size to fit scene nicely
    x: 25,          // Set X coordinate
    y: - 12         // Set Y coordinate
})
this.container.add(this.activitiesBoard.container)
        
    }

    setEasterEggs()
    {
        this.easterEggs = new EasterEggs({
            resources: this.resources,
            car: this.car,
            walls: this.walls,
            objects: this.objects,
            materials: this.materials,
            areas: this.areas,
            config: this.config,
            physics: this.physics
        })
        this.container.add(this.easterEggs.container)
    }
}