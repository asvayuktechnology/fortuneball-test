import React, { JSX } from "react";
import Link from "next/link";
type GameCardProps = {
  title: string;
  icon: JSX.Element | string;
  href?: string
};

const GameCard: React.FC<GameCardProps> = ({ title, icon, href }) => (
  <Link href={href ?? '#'} target="_blank"  rel="noopener noreferrer"  className="w-1/2 mb-3 lg:w-1/4 sm:px-3 px-1">
    <div className="gamecard rounded-md p-1 font-semibold text-[#1b47ab] border-0 bg-[linear-gradient(180deg,rgba(228,230,234,1)_0%,rgba(158,170,189,1)_100%)] transition duration-300 hover:bg-[#3d44c1] hover:bg-none hover:text-white">
      <div className="glow-container relative">
        <div className="ball"></div>
        <div
          className="ball"
          style={
            {
              "--delay": "-12s",
              "--size": "0.35",
              "--speed": "25s",
            } as React.CSSProperties
          }
        ></div>
        <div
          className="ball"
          style={
            {
              "--delay": "-10s",
              "--size": "0.3",
              "--speed": "15s",
            } as React.CSSProperties
          }
        ></div>
      </div>
      <div className="flex justify-center pl-2 gap-2 items-center py-0.5 space-y-2">
        <span className="mb-0">{icon}</span>
        <span className="font-semibold  text-[16px]">{title}</span>
      </div>
    </div>
  </Link>
);

export default GameCard;
