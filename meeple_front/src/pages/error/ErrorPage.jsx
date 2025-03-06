import { motion } from "framer-motion";
import styled from "styled-components";
import EunSoo from "../../assets/images/pixel_character/pixel-eunsoo.png"
import HeeJun from "../../assets/images/pixel_character/pixel-heejun.png"
import JaeEun from "../../assets/images/pixel_character/pixel-jaeeun.png"
import SungHyun from "../../assets/images/pixel_character/pixel-sunghyun.png"
import HongBeom from "../../assets/images/pixel_character/pixel-hongbeom.png"
import JinHyuk from "../../assets/images/pixel_character/pixel-jinhyuk.png"
import Space from "../../assets/images/errorspace.png"

const SpaceBackground = styled.div`
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const StyledText = styled(motion.span)`
  display: inline-block;
  background: linear-gradient(to right, #fff, #7dd3fc, #fff);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 0 10px rgba(125, 211, 252, 0.3);
`;

const ErrorPage = () => {
    const characters = [
        { img: EunSoo, name: "은수" },
        { img: HeeJun, name: "희준" },
        { img: JaeEun, name: "재은" },
        { img: SungHyun, name: "성현" },
        { img: HongBeom, name: "홍범" },
        { img: JinHyuk, name: "진혁" }
    ];

    const getRandomMovement = (index) => ({
        x: [0, Math.random() * 400 - 200, Math.random() * 400 - 200, 0],
        y: [0, Math.random() * 300 - 150, Math.random() * 300 - 150, 0],
        transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5,
            times: [0, 0.33, 0.66, 1]
        }
    });

    const textAnimation = {
        animate: {
            y: [-2, 2],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }
        }
    };

    const starAnimation = {
        scale: [1, 1.2, 1],
        rotate: [0, 5, -5, 0],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <SpaceBackground bgImage={Space}>
            <div className="min-h-screen flex flex-col items-center justify-center relative">
                <motion.h1 
                    className="text-5xl text-center mb-8 z-10 px-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <StyledText 
                        className="font-bold"
                        animate={textAnimation.animate}
                    >
                        이런, 우주 미아가 된 것 같아요!
                    </StyledText>
                    <br />
                    <motion.div 
                        className="text-4xl mt-4 text-white"
                        animate={textAnimation.animate}
                    >
                        우리 친구들이 찾아드릴게요 
                        <motion.span 
                            className="inline-block ml-2"
                            animate={starAnimation}
                        >
                            ⭐
                        </motion.span>
                    </motion.div>
                </motion.h1>

                <div className="absolute inset-0 flex items-center justify-center">
                    {characters.map((char, index) => (
                        <motion.div
                            key={index}
                            className="absolute"
                            animate={getRandomMovement(index)}
                            style={{ 
                                left: `${Math.random() * 60 + 20}%`,
                                top: `${Math.random() * 60 + 20}%`
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <img 
                                    src={char.img} 
                                    alt={char.name}
                                    className="w-24 h-24 object-contain"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </SpaceBackground>
    );
}

export default ErrorPage;