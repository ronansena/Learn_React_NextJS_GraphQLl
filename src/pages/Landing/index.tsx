import React, { useState } from 'react';
import landingImg from '../../assets/images/landing.svg';
import Image from 'next/image';
import style from  './styles.module.scss';
import MenuPage from '../../components/ScreenGenericComponent/MenuPage/MenuPage';
import Typography from '@mui/material/Typography';

function Landing(){

    const [totalSenhasRegistradas,settotalSenhasRegistradas] = useState(0);
  /*
    localStorage.clear();
  
    useEffect(() => {
        api.get('connectionsKeyPass').then(response => {
          const { total } = response.data;    
          settotalSenhasRegistradas(total);
        });
      }, []);
*/
    return (        
<>  <MenuPage></MenuPage>
    
        <div className={style.pagelanding}>
            <div id={style.pagelandingcontent} >
                <div className={style.logocontainer}>
                   <Typography variant="h1" gutterBottom component="div">ControlHealth - Controle sua saúde!</Typography>
                
                </div>
                  <Image src={landingImg} 
                  alt="" 
                  className={style.heroimage}
                />

                <div className={style.buttonscontainer}>

      
                   
                </div>
               
            </div>
         
            
        </div>    
        </>    
    )  
}

export default Landing;
