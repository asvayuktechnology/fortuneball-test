// 'use client';
// import React, { useCallback } from 'react';
// import Particles from 'react-tsparticles';
// import { loadFull } from 'tsparticles';

// export default function ParticlesBackground() {
//   const particlesInit = useCallback(async (engine) => {
//     await loadFull(engine);
//   }, []);

//   return (
//     <Particles
//       id="tsparticles"
//       init={particlesInit}
//       className="absolute inset-0 z-[1] pointer-events-none"
//       options={{
//         fullScreen: false,
//         background: {
//           color: {
//             value: 'transparent',
//           },
//         },
//         fpsLimit: 60,
//         interactivity: {
//           events: {
//             onHover: {
//               enable: true,
//               mode: 'repulse',
//             },
//             resize: true,
//           },
//           modes: {
//             repulse: {
//               distance: 25,
//               duration: 0.4,
//             },
//           },
//         },
//         particles: {
//           color: {
//             value: '#ffffff',
//           },
//           links: {
//             color: '#ffffff',
//             distance: 150,
//             enable: true,
//             opacity: 0.08,
//             width: 1,
//           },
//           collisions: {
//             enable: false,
//           },
//           move: {
//             direction: 'none',
//             enable: true,
//             outModes: {
//               default: 'bounce',
//             },
//             random: false,
//             speed: 1,
//             straight: false,
//           },
//           number: {
//             density: {
//               enable: true,
//               area: 800,
//             },
//             value: 85,
//           },
//           opacity: {
//             value: 0.2,
//           },
//           shape: {
//             type: 'circle',
//           },
//           size: {
//             value: { min: 1, max: 5 },
//           },
//         },
//         detectRetina: true,
//       }}
//     />
//   );
// }
