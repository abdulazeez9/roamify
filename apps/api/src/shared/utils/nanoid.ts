import { customAlphabet } from 'nanoid';

const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export const generateReferralCode = customAlphabet(alphabet, 5);
