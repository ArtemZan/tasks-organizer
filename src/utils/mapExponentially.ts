import { roundNumber } from "./round"

export function mapExponentially(linearMin: number, linearMax: number, expMin: number, expMax: number){
  if(expMin <= 0) {
    throw "Exponential minimmum cannot be <= 0"
  }

  // | (1) e ** (linearMin / scale - offset) = expMin
  // | (2) e ** (linearMax / scale - offset) = expMax
  // Solve for 'scale' and 'offset'
  // (1) => linearMin / scale - offset = log(expMin)
  // offset = linearMin / scale - log(expMin)
  // (2) => linearMax / scale - offset = log(expMax)
  // linearMax / scale - linearMin / scale + log(expMin) = log(expMax)
  // (linearMax - linearMin) / scale = log(expMax) - log(expMin)
  // scale = (linearMax - linearMin) / (log(expMax) - log(expMin))
  const scale = (linearMax - linearMin) / (Math.log(expMax) - Math.log(expMin))
  const offset = linearMin / scale - Math.log(expMin)

  const toExpValue = (value: number) => roundNumber(Math.E ** (value / scale - offset), 2)
  const toLinearValue = (value: number) => (Math.log(value) + offset) * scale

  return {
    toExpValue,
    toLinearValue
  }
}