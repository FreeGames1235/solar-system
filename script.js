// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create the planets
const planets = [];
const orbits = [];
const planetData = [
     // Planets
    { name: "Mercury", radius: 0.38, distance: 10, color: 0xdedede },
    { name: "Venus", radius: 0.95, distance: 15, color: 0xffa500 },
    { name: "Earth", radius: 1, distance: 20, color: 0x0000ff, moons: [{ name: "Moon", radius: 0.2, distance: 2, color: 0xffffff }] }, // Earth with Moon
    { name: "Mars", radius: 0.53, distance: 25, color: 0xff0000, moons: [{ name: "Phobos", radius: 0.1, distance: 1, color: 0xdedede }, { name: "Deimos", radius: 0.08, distance: 1.5, color: 0x999999 }] }, // Mars with moons Phobos and Deimos
    { name: "Jupiter", radius: 2.5, distance: 35, color: 0xffcc00, moons: [{ name: "Io", radius: 0.3, distance: 3, color: 0xffcc00 }, { name: "Europa", radius: 0.25, distance: 3.5, color: 0xcccccc }, { name: "Ganymede", radius: 0.4, distance: 4, color: 0x999999 }, { name: "Callisto", radius: 0.35, distance: 4.5, color: 0x666666 }] }, // Jupiter with moons
    { name: "Saturn", radius: 2, distance: 45, color: 0xff9900, ringRadius: 3.5, moons: [{ name: "Titan", radius: 0.2, distance: 5, color: 0xffff00 }, { name: "Mimas", radius: 0.05, distance: 5.5, color: 0xffffff }, { name: "Enceladus", radius: 0.07, distance: 6, color: 0x0000ff}] }, // Add ringRadius for Saturn
    { name: "Uranus", radius: 1.5, distance: 55, color: 0x66ffff },
    { name: "Neptune", radius: 1.4, distance: 65, color: 0x3366ff },
    { name: "Pluto", radius: 0.34, distance: 75, color: 0xfea993 },
];

function createOrbitPath(radius) {
    const orbitGeometry = new THREE.CircleGeometry(radius, 64);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2; // Align the orbit with the xy-plane
    scene.add(orbit);
    return orbit;
}

planetData.forEach(data => {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: data.color });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = data.distance;
    planets.push(planet);

    // Create orbit path for each planet
    const orbit = createOrbitPath(data.distance);
    orbits.push(orbit);
    
    // Add rings for Saturn
    if (data.name === "Saturn" && data.ringRadius) {
        const ringGeometry = new THREE.RingGeometry(data.radius + 0.1, data.ringRadius, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2; // Align the ring with the planet's equator
        planet.add(ring);
    }

    // Add moons
    if (data.moons) {
        data.moons.forEach(moonData => {
            const moonGeometry = new THREE.SphereGeometry(moonData.radius, 32, 32);
            const moonMaterial = new THREE.MeshBasicMaterial({ color: moonData.color });
            const moon = new THREE.Mesh(moonGeometry, moonMaterial);
            moon.position.x = moonData.distance;
            planet.add(moon);
        });
    }
    
    scene.add(planet);
});


// Position the camera
camera.position.set(0, 100, 10);
camera.lookAt(0, 0, 4); // Look at the center of the scene

// Render loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate each planet around its own axis
    planets.forEach(planet => {
        planet.rotation.y += 0.01;
    });

    // Orbit each planet around the sun
    const orbitSpeed = 0.01;
    planets.forEach((planet, index) => {
        const orbitRadius = planetData[index].distance;
        const angle = Date.now() * orbitSpeed * (1 / orbitRadius);
        planet.position.x = Math.cos(angle) * orbitRadius;
        planet.position.z = Math.sin(angle) * orbitRadius;
    });

    renderer.render(scene, camera);
}
animate();
