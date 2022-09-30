import * as React from 'react'
import styled from 'styled-components'
import SeparatorBar from './SeparatorBar'
import NutrientRow from './NutrientRow'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
const NUTRIENT_INDENT = '4pt';

interface LabelContainerProps {
  backgroundColor?: string,
  color?: string
}

const LabelContainer = styled.div<LabelContainerProps>`
  background-color: ${(props: LabelContainerProps) => (props.backgroundColor || 'white')};
  color: ${(props: LabelContainerProps) => (props.color || 'black')};
  font-family: 'helvetica';
  padding: 3pt;
  text-align: left;
  width: 165pt; 
`
// #TODO add a prop to adjust width

const Title = styled.h1`
  font-size: 18pt;
  font-weight: 900;
  margin: 0;
  font-family: 'Franklin Gothic Heavy','Helvetica';
`

const ServingInfo = styled.h2`
  font-size: 8pt;
  font-weight: 400;
  margin: 1pt;
  margin-left: 1pt;
  margin-bottom: 2pt;
`

const AmountPerServing = styled.h2`
  font-size: 8pt;
  font-weight: 700;
  margin: 1pt;
  margin-bottom: 1pt;
`

const CalorieRow = styled.div`
  padding: 0;
  margin: 0;
  margin-top: 1pt;
  margin-bottom: 1pt;
  line-height: 8pt;
  height: 8pt;
`

const CaloriesLabel = styled.h2`
  font-size: 8pt;
  font-weight: 700;
  margin: 0;
  margin-left: 1pt;
  float: left;
`

const CaloriesValue = styled.h2`
  font-size: 8pt;
  font-weight: 100;
  margin: 0;
  margin-left: 2pt;
  float: left;
`

const CaloriesFromFat = styled.h2`
  font-size: 8pt;
  font-weight: 100;
  display: inline-flex;
  margin: 0;
  margin-right: 1pt;
  margin-left: auto;
  float: right;
`

const PercentDailyValueLabel = styled.h2`
  line-height: 6pt;
  font-size: 6pt;
  font-weight: 100;
  text-align: right;
  margin: 0;
  margin-top: 2pt;
  margin-bottom: 5pt;
`
const DailyValues = styled.h2`
  line-height: 6pt;
  font-size: 6pt;
  font-weight: 100;
  text-align: left;
  margin: 0;
  margin-top: 2pt;
  margin-bottom: 5pt;
`

interface NutritionLabelProps {
  backgroundColor?: string,
  descricaoAlimentoPage: string,
  pesoEmbalagem: string,
  servingsPerContainer: string,
  calories: string,
  totalFat: string,
  sodium: string,
  totalCarbohydrate: string,
  precoPage: string,
  dietaryFiber: string,
  calcio: string,
  protein: string,
  qtdeConsumidaExecPage: number,
  vitamins: Array<string>,
  open2: any,
  setOpen2: any,
  opcaoPage:string
  //?=maybe for type
}
import { useStyles } from '../../../../styles/useStyles';


const NutritionLabel: React.SFC<NutritionLabelProps> = (props: NutritionLabelProps) => {
  const classes = useStyles();

  const handleClose = () => {

    props.setOpen2(false);

  };

  let proteinaConsumida = (Number(Number(props.qtdeConsumidaExecPage) / 100) * Number(props.protein)).toFixed(2);
  let caloriesConsumida = (Number(Number(props.qtdeConsumidaExecPage) / 100) * Number(props.calories)).toFixed(2);
  let totalCarbohydrateConsumida = (Number(Number(props.qtdeConsumidaExecPage) / 100) * Number(props.totalCarbohydrate)).toFixed(2);
  let totalFatConsumida = (Number(Number(props.qtdeConsumidaExecPage) / 100) * Number(props.totalFat)).toFixed(2);
  let dietaryFiberConsumida = (Number(Number(props.qtdeConsumidaExecPage) / 100) * Number(props.dietaryFiber)).toFixed(2);
  let sodiumConsumida = (Number(Number(props.qtdeConsumidaExecPage) / 100) * Number(props.sodium)).toFixed(2);
  let calcioConsumida = (Number(Number(props.qtdeConsumidaExecPage) / 100) * Number(props.calcio)).toFixed(2);

  return (
    <>
      <div className={classes.root} >
        <Dialog
          //disableEscapeKeyDown={false}
          //fullScreen={false}
          onBackdropClick={handleClose}
          open={props.open2}
          onClick={handleClose}        
        >
          <DialogContent  >
            <Box 
              sx={{
                width: "auto",
                height: "auto",
                border: 2,
                padding: "15px",

              }}
            >
              <LabelContainer backgroundColor={props.backgroundColor} >
                <Title>INFORMAÇÃO NUTRICIONAL</Title>
                <ServingInfo>
                  {`Produto: ${props.descricaoAlimentoPage}`}
                </ServingInfo>
                <ServingInfo>
                  {`Peso Embalagem: ${props.pesoEmbalagem}g`}
                </ServingInfo>
                <ServingInfo>
                  {`Preço R$: ${props.precoPage}`}
                </ServingInfo>
                <SeparatorBar height={'7pt'} color={props.backgroundColor} />
                <ServingInfo>
                  {`Porção por medida: ${props.servingsPerContainer}`}
                </ServingInfo>
                <SeparatorBar height={'5pt'} color={props.backgroundColor} />
                <CalorieRow>
                  <CaloriesLabel>
                    {`Valor energético (Kcal): `}
                  </CaloriesLabel>
                  <CaloriesValue>
                    {props.calories}
                  </CaloriesValue>

                </CalorieRow>

                <SeparatorBar height={'3pt'} color={props.backgroundColor} />

                <PercentDailyValueLabel>
                  {`%VD*`}
                </PercentDailyValueLabel>

                
                <NutrientRow label={'Proteína:'} value={`${props.protein}g`} boldLabel={true} />
                <NutrientRow label={'Carboidratos Totais:'} value={`${props.totalCarbohydrate}g`} boldLabel={true} />
                <NutrientRow label={'Lipídeos:'} value={`${props.totalFat}g`} boldLabel={true} />
                <NutrientRow label={'Fibra Alimentar:'} value={`${props.dietaryFiber}g`} boldLabel={true} />
                <NutrientRow label={'Sódio:'} value={`${props.sodium}mg`} boldLabel={true} />
                <NutrientRow label={'Cálcio:'} value={`${props.calcio}mg`} boldLabel={true} />
                <SeparatorBar height={'7pt'} color={props.backgroundColor} />
                { props.opcaoPage !== "Tabela_Nutricional" ?
                <>
                <ServingInfo>
                  {`Porção consumida: ${props.qtdeConsumidaExecPage}g`}
                </ServingInfo>

                <SeparatorBar height={'5pt'} color={props.backgroundColor} />

                <CalorieRow>
                  <CaloriesLabel>
                    {`Valor energético (Kcal): `}
                  </CaloriesLabel>
                  <CaloriesValue>
                    {caloriesConsumida}
                  </CaloriesValue>

                </CalorieRow>
                <SeparatorBar height={'3pt'} color={props.backgroundColor} />

                <PercentDailyValueLabel>
                  {`%VD*`}
                </PercentDailyValueLabel>
                
                <NutrientRow label={'Proteína:'} value={`${proteinaConsumida}g`} boldLabel={true} />
                <NutrientRow label={'Carboidratos Totais:'} value={`${totalCarbohydrateConsumida}g`} boldLabel={true} />
                <NutrientRow label={'Lipídeos:'} value={`${totalFatConsumida}g`} boldLabel={true} />
                <NutrientRow label={'Fibra Alimentar:'} value={`${dietaryFiberConsumida}g`} boldLabel={true} />
                <NutrientRow label={'Sódio:'} value={`${sodiumConsumida}mg`} boldLabel={true} />
                <NutrientRow label={'Cálcio:'} value={`${calcioConsumida}mg`} boldLabel={true} />
                <SeparatorBar height={'5pt'} color={props.backgroundColor} />
                <DailyValues>
                  {'* Percentual de valores diários fornecidos pela porção'}
                </DailyValues>
            </>  : ""}
              </LabelContainer>
            </Box>
          </DialogContent>
        </Dialog>

      </div>

    </>
  )
}

export default NutritionLabel;