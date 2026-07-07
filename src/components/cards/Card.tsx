import React from 'react'
// import { FaRegArrowAltCircleUp, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';
import HoverTooltip from '../ui/common/HoverTooltip';
import infoicon from "../../../public/images/xclamation.webp"
import Image from 'next/image';
interface CardProps {
  title: string;
  reward?: number | string;
  rewardAmount?: number | string;
  href?: string;
  tooltext?: string;
  cardbg: string;
  cardimg: string;
  badgebg: string;
  subtitle?: string;
  producttitle?: string;

}

const Card: React.FC<CardProps> = ({ title, reward, rewardAmount, producttitle, href, tooltext, cardbg, cardimg, badgebg }) => {

  return (
    <Link href={href ?? '#'} className='dashboardcard'>
      <div className=" text-white p-5.5 lg:px-7 px-3  min-h-[100px] relative bg-[#29292f] " >
        <div className='flex items-center gap-3'>
          <div className='w-[40px] h-[40px] bg-[#656565] rounded-full flex items-center justify-center'>

            <Image src={cardimg} alt='cardimg' width={25} height={25} />
          </div>
          <div className="cardtitle mb-1 sm:text-sm text-[10px] font-light tracking-wider w-100">
            {title}
            <br />
            <div className="flex justify-between">
              Reward

              {(tooltext || producttitle) && (
                <span
                  className="text-[9px] mb-1 sm:text-[10px] px-2 py-[2px] rounded-full"
                  style={{ backgroundColor: badgebg, color: '#000' }}
                >
                  {tooltext && `${tooltext}`}
                  {tooltext && producttitle && ' | '}
                  {producttitle && `${producttitle}`}
                </span>
              )}
            </div>

          </div>
          {/* <div className="cardtitle w-full tracking-wide font-light">
            <p className="text-[11px] sm:text-sm leading-tight">
              {title}
            </p>

            <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span className="text-[10px] sm:text-xs">
                Reward
              </span>

              {(tooltext || producttitle) &&
                (tooltext?.toString().trim() ||
                  producttitle?.toString().trim()) && (
                  <div
                    className="
        flex flex-col gap-0.5
        text-[9px] sm:text-[10px]
        px-2 py-1
        rounded-lg
        w-fit
        leading-tight
      "
                    style={{ backgroundColor: badgebg, color: '#000' }}
                  >
                    {tooltext?.toString().trim() && (
                      <span>
                        Rank = {tooltext}
                      </span>
                    )}

                    {producttitle?.toString().trim() && (
                      <span>
                        Win = {producttitle}
                      </span>
                    )}
                  </div>
                )}


            </div>
          </div> */}


        </div>
        <div className="amtnprofit flex items-center justify-between mt-2">
          <div className="amount lg:text-3xl text-md font-normal">
            {reward} <span className='sm:text-[12px] text-[10px]  font-normal'></span>
            <p className={`text-[11px] text-black  rounded-full py-1 px-4 font-normal mb-0 btmetabadge `} style={{ backgroundColor: badgebg }}>
              USDT
            </p>
          </div>
          {/* <Link href={"/user/mystaking"} className='flex items-start absolute right-2 top-2'>
            <HoverTooltip text={tooltext}>
              <Image src={infoicon} width={22} height={22} alt='' />
            </HoverTooltip>
          </Link> */}


          {/* ✅ Centered tooltext */}


          {/* <div className="cardtitle mb-1 sm:text-sm text-[10px] font-light tracking-wider">
          {title}
          <br />
          tooltext
        </div> */}

        </div>
        <img src={cardbg} alt="" className='absolute right-2 bottom-1 w-[55px] invert opacity-80' />
      </div>
    </Link>
  )
}

export default Card
