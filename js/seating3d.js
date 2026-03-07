import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.161.0/examples/jsm/controls/OrbitControls.js';

let scene;
let camera;
let renderer;
let controls;
let animationId;
let classroomGroup;
let initialized = false;

const CONFIG = {
    xStep: 1.4,
    zStep: 1.6,
    laneGap: 2.7
};

function ensureRendererContainer() {
    const container = document.getElementById('seating-3d-canvas');
    if (!container) return null;

    if (!initialized) {
        scene = createClassroomScene();
        camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 200);
        camera.position.set(0, 10, 14);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0.8, 0);
        controls.enableDamping = true;

        classroomGroup = new THREE.Group();
        scene.add(classroomGroup);

        window.addEventListener('resize', onResize);
        initialized = true;
    }

    return container;
}

function onResize() {
    const container = document.getElementById('seating-3d-canvas');
    if (!initialized || !container || !renderer || !camera) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

export function createClassroomScene() {
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0x0b1020);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    newScene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(8, 12, 6);
    newScene.add(keyLight);

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 24),
        new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.9, metalness: 0.05 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
    newScene.add(floor);

    const grid = new THREE.GridHelper(24, 24, 0x475569, 0x334155);
    newScene.add(grid);

    return newScene;
}

function mapSeatToWorld(side, rowIndex, seatWidth, cursorX, rowCount) {
    const sideOffset = side === 'left' ? -CONFIG.laneGap : CONFIG.laneGap;
    const widthScale = Math.max(1, Number(seatWidth) || 1);
    const centerX = cursorX + ((widthScale * CONFIG.xStep) / 2);
    const z = (rowIndex - (rowCount - 1) / 2) * CONFIG.zStep;

    return {
        x: centerX + sideOffset,
        y: 0.4,
        z,
        widthScale
    };
}

export function createAvatarForMember(name, position) {
    const avatar = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.15, 0.35, 4, 8),
        new THREE.MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.4 })
    );
    body.position.y = 0.35;
    avatar.add(body);

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xf8d5b8, roughness: 0.5 })
    );
    head.position.y = 0.68;
    avatar.add(head);

    const displayName = (name || '').trim();
    if (displayName) {
        const sprite = makeNameTag(displayName);
        sprite.position.y = 0.95;
        avatar.add(sprite);
    }

    avatar.position.copy(position);
    return avatar;
}

function makeNameTag(name) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name.slice(0, 14), canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.6, 0.4, 1);
    return sprite;
}

export function createDesksFromSeatData(leftSideData, rightSideData) {
    const group = new THREE.Group();
    const rowCount = Math.max(leftSideData?.length || 0, rightSideData?.length || 0, 1);

    const buildSide = (sideData, side) => {
        sideData.forEach((row, rowIndex) => {
            let cursorX = -CONFIG.xStep * 1.5;
            row.forEach((seat) => {
                const world = mapSeatToWorld(side, rowIndex, seat.width, cursorX, rowCount);
                cursorX += world.widthScale * CONFIG.xStep;

                const desk = new THREE.Mesh(
                    new THREE.BoxGeometry(world.widthScale * 1.15, 0.22, 0.9),
                    new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.55 })
                );
                desk.position.set(world.x, world.y, world.z);
                group.add(desk);

                const memberName = (seat.name || '').trim();
                if (memberName) {
                    const avatar = createAvatarForMember(memberName, new THREE.Vector3(world.x, world.y + 0.12, world.z));
                    group.add(avatar);
                }
            });
        });
    };

    buildSide(leftSideData || [], 'left');
    buildSide(rightSideData || [], 'right');

    const teacherDesk = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.26, 1.1),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 })
    );
    teacherDesk.position.set(0, 0.4, -(rowCount * CONFIG.zStep * 0.7));
    group.add(teacherDesk);

    return group;
}

function refreshSeatingModel() {
    const bridge = window.__CAP_SEATING_3D__;
    if (!bridge || typeof bridge.getState !== 'function' || !classroomGroup) return;

    const state = bridge.getState();
    while (classroomGroup.children.length > 0) {
        const child = classroomGroup.children.pop();
        child.traverse((node) => {
            if (node.geometry) node.geometry.dispose();
            if (node.material) {
                if (Array.isArray(node.material)) node.material.forEach((m) => m.dispose());
                else node.material.dispose();
            }
            if (node.material?.map) node.material.map.dispose();
        });
    }

    classroomGroup.add(createDesksFromSeatData(state.leftSideData, state.rightSideData));
}

function renderLoop() {
    if (!renderer || !scene || !camera) return;
    controls?.update();
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(renderLoop);
}

function start3D() {
    const container = ensureRendererContainer();
    if (!container) return;
    onResize();
    refreshSeatingModel();
    if (!animationId) renderLoop();
}

function stop3D() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

document.addEventListener('cap:seating-updated', refreshSeatingModel);
document.addEventListener('cap:seating-3d-toggle', (event) => {
    if (event?.detail?.enabled) start3D();
    else stop3D();
});
