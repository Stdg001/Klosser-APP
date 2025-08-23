import { FaHome, FaShieldAlt } from "react-icons/fa";
import { PiTreasureChestDuotone } from "react-icons/pi";

import logo from '/logo.svg'
import HomeIcon from '../../assets/icons/home.svg?react';
import MedalIcon from '../../assets/icons/medal.svg?react';
import TreasureIcon from '../../assets/icons/treasure.svg?react';

import SidebarItem from "./SidebarItem";
import SidebarUser from "./SidebarUser";

export default function Sidebar() {
  return (
    <div className="fixed flex flex-col justify-between h-screen w-70 theme-box-bg p-5 border-0 border-r-1 theme-border">
      {/* Logo + Navegación */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
            <img src={logo} className="h-8"/>
            <span
                className="text-3xl theme-text mb-4 animate-fade-in font-bold"
                style={{ fontFamily: "Ubuntu, sans-serif" }}
            >
                KLOSSIO
            </span>
        </div>

        <SidebarItem 
          label="INICIO" 
          Icon={HomeIcon} 
          path="/home" 
        />
        <SidebarItem 
          label="CLASIFICACIÓN" 
          Icon={MedalIcon} 
          path="/leaderboard"
        />
        <SidebarItem 
          label="RECOMPENSAS" 
          Icon={TreasureIcon} 
          path="/rewards"
        />
      </div>

      {/* Usuario en el bottom */}
      <div className="animate-fade-in-up">
        <SidebarUser />
      </div>
    </div>
  );
}
