export const logger = async (
  prefix: keyof Console,
  tag: string,
  // tslint:disable-next-line:no-any
  ...data: any
) => {
  if (process.env.NODE_ENV === "development") {
    // tslint:disable-next-line:no-console
    console[prefix](
      "\n\n     =======logging starts======\n",
      tag,
      "\n",
      ...data,
      "\n     =======logging ends======\n"
    );
  }
};

export default logger;
