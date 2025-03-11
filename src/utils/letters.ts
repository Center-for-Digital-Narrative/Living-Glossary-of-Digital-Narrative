export const allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
export const lettersWithoutTerms = ['o', 'q', 'u', 'x', 'y', 'z'];
export const lettersWithTerms = allLetters.filter(letter => !lettersWithoutTerms.includes(letter));