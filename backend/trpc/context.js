/**
 * Creates context for tRPC requests
 */
const createContext = ({ req, res }) => {
  return {
    req,
    res,
  };
};

module.exports = { createContext };
