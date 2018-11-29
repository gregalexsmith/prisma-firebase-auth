const gqlAuthHeader = () => {
  return {
    headers: {
      Authorization: `Bearer ${process.env.AUTH_CLIENT_ACCESS_TOKEN}`
    }
  };
};

export default gqlAuthHeader;
