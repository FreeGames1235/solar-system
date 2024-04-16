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
