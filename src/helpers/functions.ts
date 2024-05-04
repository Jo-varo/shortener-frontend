const TOKENS = 'tokens';

interface ITokens {
  refresh: string;
  access: string;
}

export const saveTokensInLocalStorage = ({ refresh, access }: ITokens) => {
  const tokens = JSON.stringify({ access, refresh });
  localStorage.setItem(TOKENS, tokens);
};

export const getTokensFromLocalStorage = (): ITokens => {
  const tokens = JSON.parse(localStorage.getItem(TOKENS) ?? '{}');
  return tokens;
};

export const removeTokensFromLocalStorage = () => {
  localStorage.removeItem(TOKENS);
};
