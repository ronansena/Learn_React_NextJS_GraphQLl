
//import useState hook to create menu collapse state

import React, { useState } from "react";

//import react pro sidebar components
import { ProSidebar, SidebarHeader, SidebarContent, SidebarFooter, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

//import icons from react icons
import { FaRegHeart } from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import { BiCog } from "react-icons/bi";
import Link from "next/link";
import { GiFruitBowl } from "react-icons/gi";

//import sidebar css from react-pro-sidebar module and our custom css 

import style from "./MenuPage.module.css";


const MenuPage = () => {

  //create initial menuCollapse state using useState hook
  const [menuCollapse, setMenuCollapse] = useState(false)

  //create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };

  return (
    <>
      <div className={style.header}>
        {/* collapsed props to change menu size using menucollapse state */}

        <ProSidebar collapsed={menuCollapse}>

          <SidebarHeader>
            <div className={style.logotext}>
              {/* small and big change using menucollapse state */}
              <p>{menuCollapse ? "Weathy" : "ControlWeathy"}</p>
            </div>
            <div className={style.closemenu} onClick={menuIconClick}>
              {/* changing menu collapse icon on click */}
              {menuCollapse ? (
                <FiArrowRightCircle />
              ) : (
                <FiArrowLeftCircle />
              )}
            </div>
          </SidebarHeader>
          <SidebarContent>

            <Menu iconShape="square">

              <MenuItem active={true} icon={<FiHome />}>
                Home
              </MenuItem>  
                  
              <SubMenu title="Gráfico" icon={<FaRegHeart />}> 
                  <MenuItem icon={<GiFruitBowl />}>
                    <Link prefetch={false} href="/Chart/Profile/ConsumoDiario" ><a>Consumo Diário</a></Link>
                  </MenuItem>    
                  <MenuItem icon={<GiFruitBowl />}>
                    <Link prefetch={false} href="/Chart/Profile/MassaCorporal" ><a>Massa Corporal</a></Link>
                  </MenuItem>         
                                                               
                </SubMenu>                      
                <SubMenu title="Profile" icon={<FaRegHeart />}>    
                  <MenuItem icon={<GiFruitBowl />}>
                    <Link prefetch={false} href="/Search/Profile/ConsumoDiario" ><a>Consumo Diário</a></Link>
                  </MenuItem> 
                  <MenuItem icon={<GiFruitBowl />}>
                    <Link prefetch={false} href="/Search/Profile/MassaCorporal" ><a>Massa Corporal</a></Link>
                  </MenuItem>      
                  <MenuItem icon={<GiFruitBowl />}>
                    <Link prefetch={false} href="/Search/Profile/MetaDiaria" ><a>Meta Diária</a></Link>
                  </MenuItem>                                       
                  <MenuItem icon={<GiFruitBowl />}>
                    <Link prefetch={false} href="/Search/Profile/Profile" ><a>Profile</a></Link>
                  </MenuItem>   
                  <MenuItem icon={<GiFruitBowl />}>
                    <Link prefetch={false} href="/Search/Profile/Sleep" ><a>Sleep</a></Link>
                  </MenuItem>                                               
                </SubMenu>  
                <SubMenu title="Relatório" icon={<FaRegHeart />}> 
                  <MenuItem icon={<GiFruitBowl />}>
                    <Link prefetch={false} href="/Report/Profile/ConsumoMensal" ><a>Consumo Mensal</a></Link>
                  </MenuItem>     
                  <MenuItem icon={<GiFruitBowl />}>
                    <Link prefetch={false} href="/Report/Profile/MetaXConsumo" ><a>Meta X Consumo</a></Link>
                  </MenuItem>                                            
                </SubMenu>             
              <SubMenu title="Tabela Nutricional" icon={<RiPencilLine />}>    
                    <MenuItem icon={<GiFruitBowl />}>
                     <Link prefetch={false} href="/Search/TabelaNutricional/GrupoAlimento" ><a>Grupo de Alimento</a></Link>
                    </MenuItem>                
                  
                    <MenuItem icon={<GiFruitBowl />}>
                      <Link prefetch={false} href="/Search/TabelaNutricional/OrigemDadoNutricional" ><a>Origem Dados Nutricionais</a></Link>
                    </MenuItem>                 
                    <MenuItem icon={<GiFruitBowl />}>
                      <Link prefetch={false} href="/Search/TabelaNutricional/TabelaNutricional" ><a>Tabela Nutricional</a></Link>
                    </MenuItem>    
                    <MenuItem icon={<GiFruitBowl />}>
                      <Link prefetch={false} href="/Search/TabelaNutricional/GrupoRefeicao" ><a>Grupo Refeição</a></Link>
                    </MenuItem>                                  
                  </SubMenu>   
              <MenuItem icon={<BiCog />}>Settings</MenuItem>

            </Menu>

          </SidebarContent>
          <SidebarFooter>
            <Menu iconShape="square">
              <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
            </Menu>
          </SidebarFooter>

        </ProSidebar>

      </div>
    </>
  );
};

export default MenuPage;
