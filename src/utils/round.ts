export const roundNumber = (number: number, signsAfterComma: number) => Math.round(number * 10 ** signsAfterComma) / 10 ** signsAfterComma