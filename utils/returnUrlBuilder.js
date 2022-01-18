import { useAppContext } from "../context/context";

export const returnURlBuilder = (shopUrl) => {
  const { appContext } = useAppContext();

  return `${HOST}/?shop=${shopUrl}&host=${appContext.host}`;
};
