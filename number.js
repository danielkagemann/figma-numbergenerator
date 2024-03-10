export const $Number = {
    getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    },
    getChunks: (amount, from, to) => {
        return Array(amount).fill(0).map(_ => $Number.getRandomInt(from, to));
    }
};
