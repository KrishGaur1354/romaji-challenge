// import React from "react";

// const SakuraPetals = () => {
//   // Adjust the number of petals as desired
//   const petals = Array.from({ length: 20 });

//   return (
//     <>
//       {petals.map((_, index) => {
//         // Randomize starting side and animation delay/duration for a natural feel
//         const leftPosition = Math.random() < 0.5 ? "-5%" : "105%";
//         const horizontalOffset = Math.random() * 100;
//         const delay = Math.random() * 5;
//         const duration = 8 + Math.random() * 4;
//         return (
//           <div
//             key={index}
//             className="sakura-petal"
//             style={{
//               left: leftPosition,
//               transform: `translateX(${horizontalOffset}vw)`,
//               animationDelay: `${delay}s`,
//               animationDuration: `${duration}s`,
//             }}
//           >
//             🌸
//           </div>
//         );
//       })}
//       {/* @ts-ignore */}
//       <style jsx global>{`
//         @keyframes fall {
//           0% {
//             opacity: 0;
//             transform: translateY(-10vh) rotate(0deg);
//           }
//           10% {
//             opacity: 1;
//           }
//           100% {
//             opacity: 0;
//             transform: translateY(110vh) rotate(360deg);
//           }
//         }
//         .sakura-petal {
//           position: absolute;
//           top: 0;
//           font-size: 1.5rem;
//           pointer-events: none;
//           z-index: 0;
//           animation-name: fall;
//           animation-timing-function: linear;
//           animation-iteration-count: infinite;
//         }
//       `}</style>
//     </>
//   );
// };

// export default SakuraPetals;