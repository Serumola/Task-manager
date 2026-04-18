import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import "./TiltedCard.css";

const spring = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedCard({ title, text }) {
  const ref = useRef(null);

  const rotateX = useSpring(useMotionValue(0), spring);
  const rotateY = useSpring(useMotionValue(0), spring);
  const scale = useSpring(1, spring);

  function handleMouse(e) {
    const rect = ref.current.getBoundingClientRect();

    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    // 🔥 stronger tilt (like your original)
    const rotationX = (offsetY / (rect.height / 2)) * -14;
    const rotationY = (offsetX / (rect.width / 2)) * 14;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
  }

  return (
    <motion.div
      ref={ref}
      className="mini-card"
      onMouseMove={handleMouse}
      onMouseEnter={() => scale.set(1.08)}
      onMouseLeave={() => {
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        scale
      }}
    >
      <div className="card-pill">{title}</div>
      <p>{text}</p>
    </motion.div>
  );
}