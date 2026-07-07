"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

type Props = {
    duration?: number;
};

export default function CelebrationConfetti({
    duration = 90000,
}: Props) {
    const [active, setActive] = useState(true);

    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const updateSize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        updateSize();

        window.addEventListener("resize", updateSize);

        const timer = setTimeout(() => {
            setActive(false);
        }, duration);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", updateSize);
        };
    }, [duration]);

    if (!active) return null;

    return (
        <div className="fixed z-9999 top-0">
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={true}
                numberOfPieces={100}
                gravity={0.18}
                colors={[
                    "#FEDB1E",
                    "#E48A06",
                    "#7C56FF",
                    "#5A2EB8",
                    "#FFFFFF",
                ]}
            />
        </div>
    );
}