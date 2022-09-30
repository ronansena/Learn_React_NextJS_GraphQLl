import * as React from 'react'
import styled from 'styled-components'
interface RowContainerProps {
  indent?: string;
}

const RowContainer = styled.div<RowContainerProps>`
  margin-top: 0;
  margin-left: ${(props: RowContainerProps) => (props.indent || '0pt')};
  padding: 0;
`

const TextContainer = styled.div`
  display:flex;
  line-height: 0pt;
  padding-bottom: 0px;
`

interface NutrientTextProps {
  isBold?: boolean;
}

const NutrientText = styled.p<NutrientTextProps>`

  font-weight: ${(props: NutrientTextProps) => (props.isBold ? 700 : 100)};
  font-family: Helvetica;
  font-size: 8pt;
  margin-left: 2pt;
  padding: 0px;
  float: left;
 
`


const NutrientTextValue = styled.p<NutrientTextProps>`
  font-weight: ${(props: NutrientTextProps) => (props.isBold ? 700 : 100)};
  font-family: Helvetica;
  font-size: 8pt;   
  margin: 11px 0px 0px auto
`

interface NutrientRowProps {
  label: string;
  value?: string;
  hideBar?: boolean;
  color?: string;
  boldLabel?: boolean;
  indent?: string;
}

const NutrientRowSeparatorBarHeight = '0.25pt';

const NutrientRow = (props: NutrientRowProps) => {
  return (
    <RowContainer indent={props.indent}> 
      <TextContainer>
        <NutrientText isBold={props.boldLabel}>
          {props.label}
        </NutrientText>
        <NutrientTextValue>
          {props.value}
        </NutrientTextValue>
      </TextContainer>
    </RowContainer>

  )
}

export default NutrientRow