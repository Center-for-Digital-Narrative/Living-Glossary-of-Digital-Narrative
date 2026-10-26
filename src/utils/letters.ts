export const allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
export const lettersWithoutTerms = ['o', 'q', 'x', 'y', 'z'];
export const lettersWithTerms = allLetters.filter(letter => !lettersWithoutTerms.includes(letter));
