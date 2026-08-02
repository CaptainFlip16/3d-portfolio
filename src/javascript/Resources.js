import * as THREE from 'three'

import Loader from './Utils/Loader.js'
import EventEmitter from './Utils/EventEmitter.js'
import pakistanFlagImg from '../images/Pakistan-Flag.png'

export default class Resources extends EventEmitter
{
    constructor()
    {
        super()

        this.loader = new Loader()
        this.items = {}

        // --- HUD DOM Elements ---
        this.hudOverlay = document.querySelector('.js-hud-overlay')
        this.hudLoader = document.querySelector('.js-hud-loader')
        this.hudProgressBar = document.querySelector('.js-hud-progress-bar')
        this.hudProgressText = document.querySelector('.js-hud-progress-text')
        this.hudStartBtn = document.querySelector('.js-hud-start-btn')

        // --- HUD Loading Events ---
        this.on('progress', (_ratio) =>
        {
            const percentage = Math.round(_ratio * 100)

            if (this.hudProgressBar)
            {
                this.hudProgressBar.style.width = `${percentage}%`
            }
            if (this.hudProgressText)
            {
                this.hudProgressText.textContent = `INITIALIZING WORLD SYSTEM ${percentage}%`
            }
        })

        this.on('ready', () =>
        {
            // Hide progress loader & show Start Engine button
            if (this.hudLoader)
            {
                this.hudLoader.style.display = 'none'
            }
            if (this.hudStartBtn)
            {
                this.hudStartBtn.classList.remove('is-hidden')
            }
        })

        // --- Start Engine Button Interaction ---

if (this.hudStartBtn)
{
    this.hudStartBtn.addEventListener('click', () =>
    {
        this.hudStartBtn.classList.add('is-pressed')

        // 1. Simulate a click on the 3D WebGL Canvas to trigger the 3D "Click Here to Start" tile
        const canvas = document.querySelector('canvas.canvas') || document.querySelector('canvas')
        if (canvas)
        {
            const clickEvent = new MouseEvent('click', {
                clientX: window.innerWidth / 2,
                clientY: window.innerHeight / 2,
                bubbles: true
            })
            canvas.dispatchEvent(clickEvent)
        }

        // 2. Resume Web Audio Context (for sound effects)
        if (THREE.AudioContext && THREE.AudioContext.getContext)
        {
            const audioCtx = THREE.AudioContext.getContext()
            if (audioCtx.state === 'suspended')
            {
                audioCtx.resume()
            }
        }

        // 3. Fade out the HUD overlay
        if (this.hudOverlay)
        {
            this.hudOverlay.classList.add('is-fading')
            setTimeout(() =>
            {
                this.hudOverlay.style.display = 'none'
            }, 800)
        }
    })
}

        // --- Asset Loading List ---
        this.loader.load([
            // Matcaps
            { name: 'matcapBeige', source: './models/matcaps/beige.png', type: 'texture' },
            { name: 'matcapBlack', source: './models/matcaps/black.png', type: 'texture' },
            { name: 'matcapOrange', source: './models/matcaps/orange.png', type: 'texture' },
            { name: 'matcapRed', source: './models/matcaps/red.png', type: 'texture' },
            { name: 'matcapWhite', source: './models/matcaps/white.png', type: 'texture' },
            { name: 'matcapGreen', source: './models/matcaps/green.png', type: 'texture' },
            { name: 'matcapBrown', source: './models/matcaps/brown.png', type: 'texture' },
            { name: 'matcapGray', source: './models/matcaps/gray.png', type: 'texture' },
            { name: 'matcapEmeraldGreen', source: './models/matcaps/emeraldGreen.png', type: 'texture' },
            { name: 'matcapPurple', source: './models/matcaps/purple.png', type: 'texture' },
            { name: 'matcapBlue', source: './models/matcaps/blue.png', type: 'texture' },
            { name: 'matcapYellow', source: './models/matcaps/yellow.png', type: 'texture' },
            { name: 'matcapMetal', source: './models/matcaps/metal.png', type: 'texture' },

            // Custom Flag
            { name: 'pakistanFlag', source: pakistanFlagImg, type: 'texture' },

            // Intro
            { name: 'introStaticBase', source: './models/intro/static/base.glb' },
            { name: 'introStaticCollision', source: './models/intro/static/collision.glb' },
            { name: 'introStaticFloorShadow', source: './models/intro/static/floorShadow.png', type: 'texture' },

            { name: 'introInstructionsLabels', source: './models/intro/instructions/labels.glb' },
            { name: 'introInstructionsArrows', source: './models/intro/instructions/arrows.png', type: 'texture' },
            { name: 'introInstructionsControls', source: './models/intro/instructions/controls.png', type: 'texture' },
            { name: 'introInstructionsOther', source: './models/intro/instructions/other.png', type: 'texture' },

            { name: 'introArrowKeyBase', source: './models/intro/arrowKey/base.glb' },
            { name: 'introArrowKeyCollision', source: './models/intro/arrowKey/collision.glb' },

            { name: 'introBBase', source: './models/intro/b/base.glb' },
            { name: 'introBCollision', source: './models/intro/b/collision.glb' },

            { name: 'introRBase', source: './models/intro/r/base.glb' },
            { name: 'introRCollision', source: './models/intro/r/collision.glb' },

            { name: 'introUBase', source: './models/intro/u/base.glb' },
            { name: 'introUCollision', source: './models/intro/u/collision.glb' },

            { name: 'introNBase', source: './models/intro/n/base.glb' },
            { name: 'introNCollision', source: './models/intro/n/collision.glb' },

            { name: 'introOBase', source: './models/intro/o/base.glb' },
            { name: 'introOCollision', source: './models/intro/o/collision.glb' },

            { name: 'introSBase', source: './models/intro/s/base.glb' },
            { name: 'introSCollision', source: './models/intro/s/collision.glb' },

            { name: 'introIBase', source: './models/intro/i/base.glb' },
            { name: 'introICollision', source: './models/intro/i/collision.glb' },

            { name: 'introMBase', source: './models/intro/m/base.glb' },
            { name: 'introMCollision', source: './models/intro/m/collision.glb' },

            { name: 'introCreativeBase', source: './models/intro/creative/base.glb' },
            { name: 'introCreativeCollision', source: './models/intro/creative/collision.glb' },

            { name: 'introDevBase', source: './models/intro/dev/base.glb' },
            { name: 'introDevCollision', source: './models/intro/dev/collision.glb' },

            // Crossroads
            { name: 'crossroadsStaticBase', source: './models/crossroads/static/base.glb' },
            { name: 'crossroadsStaticCollision', source: './models/crossroads/static/collision.glb' },
            { name: 'crossroadsStaticFloorShadow', source: './models/crossroads/static/floorShadow.png', type: 'texture' },

            // Car default
            { name: 'carDefaultChassis', source: './models/car/default/chassis.glb' },
            { name: 'carDefaultWheel', source: './models/car/default/wheel.glb' },
            { name: 'carDefaultBackLightsBrake', source: './models/car/default/backLightsBrake.glb' },
            { name: 'carDefaultBackLightsReverse', source: './models/car/default/backLightsReverse.glb' },
            { name: 'carDefaultAntena', source: './models/car/default/antena.glb' },

            // Car CyberTruck
            { name: 'carCyberTruckChassis', source: './models/car/cyberTruck/chassis.glb' },
            { name: 'carCyberTruckWheel', source: './models/car/cyberTruck/wheel.glb' },
            { name: 'carCyberTruckBackLightsBrake', source: './models/car/cyberTruck/backLightsBrake.glb' },
            { name: 'carCyberTruckBackLightsReverse', source: './models/car/cyberTruck/backLightsReverse.glb' },
            { name: 'carCyberTruckAntena', source: './models/car/cyberTruck/antena.glb' },

            // Project
            { name: 'projectsBoardStructure', source: './models/projects/board/structure.glb' },
            { name: 'projectsBoardCollision', source: './models/projects/board/collision.glb' },
            { name: 'projectsBoardStructureFloorShadow', source: './models/projects/board/floorShadow.png', type: 'texture' },
            { name: 'projectsBoardPlane', source: './models/projects/board/plane.glb' },

            { name: 'projectsDistinctionsAwwwardsBase', source: './models/projects/distinctions/awwwards/base.glb' },
            { name: 'projectsDistinctionsAwwwardsCollision', source: './models/projects/distinctions/awwwards/collision.glb' },
            { name: 'projectsDistinctionsFWABase', source: './models/projects/distinctions/fwa/base.glb' },
            { name: 'projectsDistinctionsFWACollision', source: './models/projects/distinctions/fwa/collision.glb' },
            { name: 'projectsDistinctionsCSSDABase', source: './models/projects/distinctions/cssda/base.glb' },
            { name: 'projectsDistinctionsCSSDACollision', source: './models/projects/distinctions/cssda/collision.glb' },

            { name: 'projectsLuniFloor', source: './models/projects/luni/floorTexture.webp', type: 'texture' },
            { name: 'projectsBonhomme10ansFloor', source: './models/projects/bonhomme10ans/floorTexture.webp', type: 'texture' },
            { name: 'projectsThreejsJourneyFloor', source: './models/projects/threejsJourney/floorTexture.webp', type: 'texture' },
            { name: 'projectsMadboxFloor', source: './models/projects/madbox/floorTexture.png', type: 'texture' },
            { name: 'projectsScoutFloor', source: './models/projects/scout/floorTexture.png', type: 'texture' },
            { name: 'projectsChartogneFloor', source: './models/projects/chartogne/floorTexture.png', type: 'texture' },
            { name: 'projectsCitrixRedbullFloor', source: './models/projects/citrixRedbull/floorTexture.png', type: 'texture' },
            { name: 'projectsPriorHoldingsFloor', source: './models/projects/priorHoldings/floorTexture.png', type: 'texture' },
            { name: 'projectsOranoFloor', source: './models/projects/orano/floorTexture.png', type: 'texture' },

            // Information
            { name: 'informationStaticBase', source: './models/information/static/base.glb' },
            { name: 'informationStaticCollision', source: './models/information/static/collision.glb' },
            { name: 'informationStaticFloorShadow', source: './models/information/static/floorShadow.png', type: 'texture' },

            { name: 'informationBaguetteBase', source: './models/information/baguette/base.glb' },
            { name: 'informationBaguetteCollision', source: './models/information/baguette/collision.glb' },

            { name: 'informationContactTwitterLabel', source: './models/information/static/contactTwitterLabel.png', type: 'texture' },
            { name: 'informationContactGithubLabel', source: './models/information/static/contactGithubLabel.png', type: 'texture' },
            { name: 'informationContactLinkedinLabel', source: './models/information/static/contactLinkedinLabel.png', type: 'texture' },
            { name: 'informationContactMailLabel', source: './models/information/static/contactMailLabel.png', type: 'texture' },

            { name: 'informationActivities', source: './models/information/static/activities.png', type: 'texture' },

            // Playground
            { name: 'playgroundStaticBase', source: './models/playground/static/base.glb' },
            { name: 'playgroundStaticCollision', source: './models/playground/static/collision.glb' },
            { name: 'playgroundStaticFloorShadow', source: './models/playground/static/floorShadow.png', type: 'texture' },

            // Brick
            { name: 'brickBase', source: './models/brick/base.glb' },
            { name: 'brickCollision', source: './models/brick/collision.glb' },

            // Horn
            { name: 'hornBase', source: './models/horn/base.glb' },
            { name: 'hornCollision', source: './models/horn/collision.glb' },

            // Webby trophy
            { name: 'webbyTrophyBase', source: './models/webbyTrophy/base.glb' },
            { name: 'webbyTrophyCollision', source: './models/webbyTrophy/collision.glb' },

            // Lemon
            { name: 'lemonBase', source: './models/lemon/base.glb' },
            { name: 'lemonCollision', source: './models/lemon/collision.glb' },

            // Bowling ball
            { name: 'bowlingBallBase', source: './models/bowlingBall/base.glb' },
            { name: 'bowlingBallCollision', source: './models/bowlingBall/collision.glb' },

            // Bowling pin
            { name: 'bowlingPinBase', source: './models/bowlingPin/base.glb' },
            { name: 'bowlingPinCollision', source: './models/bowlingPin/collision.glb' },

            // Areas
            { name: 'areaKeyEnter', source: './models/area/keyEnter.png', type: 'texture' },
            { name: 'areaEnter', source: './models/area/enter.png', type: 'texture' },
            { name: 'areaOpen', source: './models/area/open.png', type: 'texture' },
            { name: 'areaReset', source: './models/area/reset.png', type: 'texture' },
            { name: 'areaQuestionMark', source: './models/area/questionMark.png', type: 'texture' },

            // Tiles
            { name: 'tilesABase', source: './models/tiles/a/base.glb' },
            { name: 'tilesACollision', source: './models/tiles/a/collision.glb' },

            { name: 'tilesBBase', source: './models/tiles/b/base.glb' },
            { name: 'tilesBCollision', source: './models/tiles/b/collision.glb' },

            { name: 'tilesCBase', source: './models/tiles/c/base.glb' },
            { name: 'tilesCCollision', source: './models/tiles/c/collision.glb' },

            { name: 'tilesDBase', source: './models/tiles/d/base.glb' },
            { name: 'tilesDCollision', source: './models/tiles/d/collision.glb' },

            { name: 'tilesEBase', source: './models/tiles/e/base.glb' },
            { name: 'tilesECollision', source: './models/tiles/e/collision.glb' },

            // Konami
            { name: 'konamiLabel', source: './models/konami/label.png', type: 'texture' },
            { name: 'konamiLabelTouch', source: './models/konami/label-touch.png', type: 'texture' },

            // Wigs
            { name: 'wig1', source: './models/wigs/wig1.glb' },
            { name: 'wig2', source: './models/wigs/wig2.glb' },
            { name: 'wig3', source: './models/wigs/wig3.glb' },
            { name: 'wig4', source: './models/wigs/wig4.glb' },
        ])

        this.loader.on('fileEnd', (_resource, _data) =>
        {
            this.items[_resource.name] = _data

            // Texture
            if (_resource.type === 'texture')
            {
                const texture = new THREE.Texture(_data)
                texture.needsUpdate = true

                this.items[`${_resource.name}Texture`] = texture
            }

            // Trigger progress
            this.trigger('progress', [this.loader.loaded / this.loader.toLoad])
        })

        this.loader.on('end', () =>
        {
            // Trigger ready
            this.trigger('ready')
        })
    }
}