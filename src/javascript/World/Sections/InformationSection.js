import * as THREE from "three";

export default class InformationSection {
  constructor(_options) {
    // Options
    this.time = _options.time;
    this.resources = _options.resources;
    this.objects = _options.objects;
    this.areas = _options.areas;
    this.tiles = _options.tiles;
    this.debug = _options.debug;
    this.x = _options.x;
    this.y = _options.y;

    // Set up
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.setStatic();
    this.setBaguettes();
    this.setLinks();
    this.setActivities();
    this.setTiles();
    this.setCyberLights();
  }

  setStatic() {
    const staticBase = this.resources.items.informationStaticBase.scene;

    // 1. Force Three.js to compute real-world 3D coordinates & bounds
    staticBase.updateMatrixWorld(true);

    // 2. Locate the original blue flag piece as our anchor point
    const blueMesh = staticBase.getObjectByName("shadeBlue");
    const blueCenter = new THREE.Vector3();

    if (blueMesh) {
      const blueBox = new THREE.Box3().setFromObject(blueMesh);
      blueBox.getCenter(blueCenter);
    }

    // 3. Hide ONLY the small flag pieces near the top, leaving the tall pole visible
    staticBase.traverse((child) => {
      if (child.isMesh) {
        if (child.name === "shadeBlue" || child.name === "shadeRed005") {
          child.visible = false;
        } else if (blueMesh) {
          const box = new THREE.Box3().setFromObject(child);
          const center = new THREE.Vector3();
          const size = new THREE.Vector3();

          box.getCenter(center);
          box.getSize(size);

          const isNearFlag = center.distanceTo(blueCenter) < 1.2;
          const isSmallPiece =
            size.x < 1.8 && size.y < 1.8 && size.z < 1.8;

          if (isNearFlag && isSmallPiece) {
            child.visible = false;
          }
        }
      }
    });

    this.objects.add({
      base: staticBase,
      collision: this.resources.items.informationStaticCollision.scene,
      floorShadowTexture:
        this.resources.items.informationStaticFloorShadowTexture,
      offset: new THREE.Vector3(this.x, this.y, 0),
      mass: 0,
    });

    // 4. Attach your Pakistan flag
    this.createFlagMesh();
  }

  createFlagMesh() {
    // 1. Flag dimensions (Width: 1.2, Height: 0.8)
    const flagGeometry = new THREE.PlaneGeometry(1.2, 0.8);

    // 2. Pivot point anchored at top-left corner
    flagGeometry.translate(0.6, -0.4, 0);

    const flagMaterial = new THREE.MeshBasicMaterial({
      map: this.resources.items.pakistanFlagTexture,
      side: THREE.DoubleSide,
    });

    const flagMesh = new THREE.Mesh(flagGeometry, flagMaterial);

    // 3. Position top-left corner on the upper pole
    flagMesh.position.set(this.x - 4.1, this.y + 4.95, 3.55);

    // 4. Align left edge straight along the vertical pole
    flagMesh.rotation.x = Math.PI * 0.37;
    flagMesh.rotation.y = -Math.PI * 0.02;
    flagMesh.rotation.z = -Math.PI * -0.09;

    this.container.add(flagMesh);
  }

  setBaguettes() {
    this.baguettes = {};

    this.baguettes.x = -4;
    this.baguettes.y = 6;

    this.baguettes.a = this.objects.add({
      base: this.resources.items.informationBaguetteBase.scene,
      collision: this.resources.items.informationBaguetteCollision.scene,
      offset: new THREE.Vector3(
        this.x + this.baguettes.x - 0.56,
        this.y + this.baguettes.y - 0.666,
        0.2,
      ),
      rotation: new THREE.Euler(0, 0, (-Math.PI * 37) / 180),
      duplicated: true,
      shadow: { sizeX: 0.6, sizeY: 3.5, offsetZ: -0.15, alpha: 0.35 },
      mass: 1.5,
    });

    this.baguettes.b = this.objects.add({
      base: this.resources.items.informationBaguetteBase.scene,
      collision: this.resources.items.informationBaguetteCollision.scene,
      offset: new THREE.Vector3(
        this.x + this.baguettes.x - 0.8,
        this.y + this.baguettes.y - 2,
        0.5,
      ),
      rotation: new THREE.Euler(0, -0.5, (Math.PI * 60) / 180),
      duplicated: true,
      shadow: { sizeX: 0.6, sizeY: 3.5, offsetZ: -0.15, alpha: 0.35 },
      mass: 1.5,
      sleep: false,
    });
  }

  // Helper method to dynamically render custom Mail floor label
  createMailTexture(email) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    // Black background = transparent alpha map mask
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // White text = cyan glow rendering
    ctx.fillStyle = "#ffffff";
    ctx.font = '800 110px "Montserrat", "Arial Black", sans-serif';
    ctx.textAlign = "left";
    ctx.fillText("MAIL", 30, 110);

    ctx.font = '700 48px "Montserrat", "Arial", sans-serif';
    ctx.fillText(email.toUpperCase(), 30, 185);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  setLinks() {
    // Set up
    this.links = {};
    this.links.x = 1.95;
    this.links.y = -1.5;
    this.links.halfExtents = {};
    this.links.halfExtents.x = 1;
    this.links.halfExtents.y = 1;
    this.links.distanceBetween = 2.4;
    this.links.labelWidth = this.links.halfExtents.x * 2 + 1;
    this.links.labelGeometry = new THREE.PlaneGeometry(
      this.links.labelWidth,
      this.links.labelWidth * 0.25,
      1,
      1,
    );
    this.links.labelOffset = -1.6;
    this.links.items = [];

    this.links.container = new THREE.Object3D();
    this.links.container.matrixAutoUpdate = false;
    this.container.add(this.links.container);

    // Updated options with dynamic Mail texture canvas
    this.links.options = [
      {
        href: "https://twitter.com/",
        labelTexture:
          this.resources.items.informationContactTwitterLabelTexture,
      },
      {
        href: "https://github.com/CaptainFlip16",
        labelTexture:
          this.resources.items.informationContactGithubLabelTexture,
      },
      {
        href: "https://www.linkedin.com/in/ahmad-shafique-759163374",
        labelTexture:
          this.resources.items.informationContactLinkedinLabelTexture,
      },
      {
        href: "mailto:ahmadgujjar169@gmail.com",
        labelTexture: this.createMailTexture("ahmadgujjar169@gmail.com"), // <-- DYNAMIC CANVAS FIX HERE!
      },
    ];

    // Create each link
    let i = 0;
    for (const _option of this.links.options) {
      const item = {};
      item.x = this.x + this.links.x + this.links.distanceBetween * i;
      item.y = this.y + this.links.y;
      item.href = _option.href;

      // Create area
      item.area = this.areas.add({
        position: new THREE.Vector2(item.x, item.y),
        halfExtents: new THREE.Vector2(
          this.links.halfExtents.x,
          this.links.halfExtents.y,
        ),
      });
      item.area.on("interact", () => {
        window.open(_option.href, "_blank");
      });

      // Texture
      item.texture = _option.labelTexture;
      item.texture.magFilter = THREE.NearestFilter;
      item.texture.minFilter = THREE.LinearFilter;

      // Cyberpunk Mesh Material with Cyan Accent
      item.labelMesh = new THREE.Mesh(
        this.links.labelGeometry,
        new THREE.MeshBasicMaterial({
          wireframe: false,
          color: 0x00f3ff,
          alphaMap: _option.labelTexture,
          depthTest: true,
          depthWrite: false,
          transparent: true,
        }),
      );
      item.labelMesh.position.x =
        item.x + this.links.labelWidth * 0.5 - this.links.halfExtents.x;
      item.labelMesh.position.y = item.y + this.links.labelOffset;
      item.labelMesh.matrixAutoUpdate = false;
      item.labelMesh.updateMatrix();
      this.links.container.add(item.labelMesh);

      // Save
      this.links.items.push(item);

      i++;
    }
  }

  setActivities() {
    this.activities = {};
    this.activities.x = this.x + 0;
    this.activities.y = this.y - 10;
    this.activities.multiplier = 5.5;

    this.activities.geometry = new THREE.PlaneGeometry(
      2 * this.activities.multiplier,
      1 * this.activities.multiplier,
      1,
      1,
    );

    this.activities.texture = this.createActivitiesTexture([
      { title: "Student : BS Computer Science", date: "2024 >>> PRESENT" },
      { title: "CREATIVE WEB DEVELOPER", date: "2024 >>> PRESENT" },
      { title: "AI Automation Engineer", date: "2026 >>> PRESENT" },
      { title: "FREELANCER", date: "2022 >>> PRESENT" },
    ]);

    this.activities.texture.magFilter = THREE.NearestFilter;
    this.activities.texture.minFilter = THREE.LinearFilter;

    this.activities.material = new THREE.MeshBasicMaterial({
      wireframe: false,
      color: 0xff0077,
      alphaMap: this.activities.texture,
      transparent: true,
      depthWrite: false,
    });

    this.activities.mesh = new THREE.Mesh(
      this.activities.geometry,
      this.activities.material,
    );
    this.activities.mesh.position.x = this.activities.x;
    this.activities.mesh.position.y = this.activities.y;
    this.activities.mesh.matrixAutoUpdate = false;
    this.activities.mesh.updateMatrix();
    this.container.add(this.activities.mesh);
  }

  createActivitiesTexture(activitiesList) {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = '900 85px "Montserrat", "Arial Black", sans-serif';
    ctx.textAlign = "left";
    ctx.fillText("ACTIVITIES", 80, 110);

    let startY = 250;
    const lineSpacing = 185;

    activitiesList.forEach((item) => {
      ctx.fillStyle = "#ffffff";
      ctx.font = '800 52px "Montserrat", "Arial Black", sans-serif';
      ctx.fillText(item.title.toUpperCase(), 80, startY);

      ctx.fillStyle = "#cccccc";
      ctx.font = '700 38px "Montserrat", "Arial", sans-serif';
      ctx.fillText(item.date, 80, startY + 52);

      startY += lineSpacing;
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  setTiles() {
    this.tiles.add({
      start: new THREE.Vector2(this.x - 1.2, this.y + 13),
      delta: new THREE.Vector2(0, -20),
    });
  }

  setCyberLights() {
    const cyberLight = new THREE.PointLight(0x00f3ff, 4, 15);
    cyberLight.position.set(this.x + 5, this.y - 1, 4);
    this.container.add(cyberLight);

    this.time.on("tick", () => {
      const elapsedTime = this.time.elapsed * 0.003;
      cyberLight.intensity = 4 + Math.sin(elapsedTime) * 1.2;
    });
  }
}