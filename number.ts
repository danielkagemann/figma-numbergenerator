export const $Number = {
   getRandomInt(min: number, max: number) {
     const minCeiled = Math.ceil(min);
     const maxFloored = Math.floor(max);
     return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
   },
   getChunks: (amount: number, from: number, to: number) => {
     return Array(amount).fill(0).map(_ => $Number.getRandomInt(from, to));
   }
 };