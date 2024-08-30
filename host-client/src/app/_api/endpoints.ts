
const apiBase = process.env.NEXT_PUBLIC_BASE_URL;

export const endpoints = {
    auth: {
      signUp: `${apiBase}/auth/register`,
      login: `${apiBase}/auth/login`,
    },
  };
  
