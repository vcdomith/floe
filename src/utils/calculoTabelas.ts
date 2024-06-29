import { IProduto } from "@/interfaces/IProduto"
import { IValores } from "@/interfaces/IValores";

import Converter from "./typeConversion";
import { produtoCadastro } from "@/app/(app)/calcular/context/CalcularContext";

const { stringToFloat } = Converter

function customRound(value: number): number {
    const floorValue = Math.floor(value);
    const halfFloorValue = floorValue + 0.5;
    const nextFloorValue = floorValue + 1;
  
    const diffToFloor = Math.abs(value - floorValue);
    const diffToHalfFloor = Math.abs(value - halfFloorValue);
    const diffToNextFloor = Math.abs(value - nextFloorValue);

    let a = {
      value: value,
      floor: floorValue, 
      halfFloor: halfFloorValue,
      doubleFloor: nextFloorValue,
      diffToFloor: diffToFloor,
      diffToHalfFloor: diffToHalfFloor,
      diffToNextFloor: diffToNextFloor
    }
    
    // console.table(a);
  
    if (diffToFloor <= diffToHalfFloor && diffToFloor <= diffToNextFloor) {
      return floorValue - 0.02;
    } else if (diffToHalfFloor <= diffToNextFloor) {
      return halfFloorValue;
    } else {
      return nextFloorValue - 0.02;
    }
}

function calcularTabela(valor: number, args: number[]): number {

    return customRound(args.reduce((acc, atual) => acc * atual, valor))

}

export const getTabelas = (produto: IProduto): number[] => {

    // const {fatores, unitario} = controleProdutos[index]
    const { fatores, unitario } = produto
    const listaFatores = Object.values((fatores)).map(fator => stringToFloat(fator))

    const valorNumerico = parseFloat(unitario.replace(/,/g, '.'))
    const tabelas: IValores = {
        unitario: valorNumerico,
        tabela1: calcularTabela(valorNumerico, listaFatores),
        tabela2: valorNumerico*1.5,
        tabela3: customRound((calcularTabela(valorNumerico, listaFatores))*1.3)
    }
    return Object.values(tabelas)
}

export const getTabelasObject = (produto: produtoCadastro): IValores => {

  // const {fatores, unitario} = controleProdutos[index]
  const { fatores, unitario } = produto
  const listaFatores = Object.values((fatores)).map(fator => stringToFloat(fator))

  const valorNumerico = parseFloat(unitario.replace(/,/g, '.'))
  const tabelas: IValores = {
      unitario: valorNumerico,
      tabela1: calcularTabela(valorNumerico, listaFatores),
      tabela2: valorNumerico*1.5,
      tabela3: customRound((calcularTabela(valorNumerico, listaFatores))*1.3)
  }
  return tabelas
}