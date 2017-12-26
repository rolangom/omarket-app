import variable from "./../variables/platform";

export default (variables = variable) => {
  const contentTheme = {
    ".padder": {
      padding: variables.contentPadding
    },
    flex: 1,
    backgroundColor: "#f1f1f1",
    "NativeBase.Segment": {
      borderWidth: 0,
      backgroundColor: "transparent"
    },
    '.whiteBackground': {
      backgroundColor: 'white',
    },
  };

  return contentTheme;
};
