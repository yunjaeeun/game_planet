import Space from "../assets/images/errorspace.png"

import { motion } from "framer-motion";
import styled from "styled-components";

const SpaceBackground = styled.div`
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const Star = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
`;

const Loading = () => {
    // UFO 원형 경로 애니메이션
    const pathRadius = 300; 
    const ufoAnimation = {
        rotate: [0, 360],
        transition: {
            duration: 9,
            repeat: Infinity,
            ease: "linear"
        }
    };

    // UFO 자체 기울기 애니메이션
    const ufoTiltAnimation = {
        rotateZ: [-10 , 10],
        transition: {
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
        }
    };

    const stars = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 2
    }));

    return (
        <SpaceBackground bgImage={Space}>
            <div className="min-h-screen flex flex-col items-center justify-center relative">
                {stars.map(star => (
                    <Star
                        key={star.id}
                        style={{ top: star.top, left: star.left }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: star.delay,
                            ease: "easeInOut"
                        }}
                    />
                ))}

                {/* 회전하는 UFO 컨테이너 */}
                <motion.div 
                    className="absolute"
                    style={{
                        width: pathRadius * 2,
                        height: pathRadius * 2,
                    }}
                    animate={ufoAnimation}
                >
                    {/* UFO 자체 */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transformOrigin: '0 50%',
                        }}
                        animate={ufoTiltAnimation}
                    >
                        <svg width="120" height="60" viewBox="0 0 120 60">
                            <motion.ellipse
                                cx="60"
                                cy="30"
                                rx="45"
                                ry="15"
                                fill="rgba(125, 211, 252, 0.3)"
                                animate={{
                                    opacity: [0.3, 0.5, 0.3],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity
                                }}
                            />
                            
                            <ellipse cx="60" cy="30" rx="35" ry="12" fill="#7dd3fc" />
                            <circle cx="60" cy="25" r="18" fill="#93c5fd" />
                            
                            <motion.g
                                animate={{
                                    opacity: [1, 0.5, 1]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity
                                }}
                            >
                                <circle cx="50" cy="25" r="3" fill="#e0f2fe" />
                                <circle cx="60" cy="25" r="3" fill="#e0f2fe" />
                                <circle cx="70" cy="25" r="3" fill="#e0f2fe" />
                            </motion.g>

                            <motion.path
                                d="M 40 30 L 25 50 L 95 50 L 80 30"
                                fill="#7dd3fc"
                                opacity="0.5"
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                    scaleY: [0.8, 1.2, 0.8],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                            />
                        </svg>
                    </motion.div>
                </motion.div>

                <motion.div 
                    className="text-5xl text-white mt-12 text-center space-y-6 z-10"
                    animate={{
                        y: [-3, 3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                >
                    <div className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-blue-200">
                        우주선이 탐사중이에요
                    </div>
                    <motion.div 
                        className="text-3xl text-blue-200"
                        animate={{
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                        }}
                    >
                        ⋆ · · · ⋆
                    </motion.div>
                </motion.div>
            </div>
        </SpaceBackground>
    );
}

export default Loading