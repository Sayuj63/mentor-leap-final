import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";

// Local replacement for the missing @motionone/utils wrap function
function wrap(min, max, v) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

function ParallaxText({
  children,
  baseVelocity = 20,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 2] },
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping, stiffness });
  const velocityFactor = useTransform(
    smoothVelocity,
    velocityMapping.input,
    velocityMapping.output,
    { clamp: false }
  );

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex whitespace-nowrap overflow-hidden">
      <motion.div className={`flex whitespace-nowrap ${className}`} style={{ x }}>
        {Array.from({ length: numCopies }).map((_, i) => (
          <span key={i} className="flex-shrink-0">
            {children}{" "}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function ScrollVelocity({
  texts = [],
  velocity = 20,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 2] },
}) {
  return (
    <section className="relative w-full overflow-hidden py-10">
      {texts.map((text, index) => (
        <ParallaxText
          key={index}
          baseVelocity={index % 2 === 0 ? velocity : -velocity}
          className={className}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
        >
          {text}
        </ParallaxText>
      ))}
    </section>
  );
}
