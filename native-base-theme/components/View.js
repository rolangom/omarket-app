import variable from "./../variables/platform";

export default (variables = variable) => {
  const viewTheme = {
    ".padder": {
      padding: variables.contentPadding,
    },
    ".paddingH": {
      padding: variables.contentPadding,
      paddingVertical: variables.contentPadding * 2,
    },
  };

  return viewTheme;
};
