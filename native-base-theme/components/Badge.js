import variable from "./../variables/platform";

export default (variables = variable) => {
  const badgeTheme = {
    ".primary": {
      backgroundColor: variables.btnPrimaryBg
    },
    ".warning": {
      backgroundColor: variables.btnWarningBg
    },
    ".info": {
      backgroundColor: variables.btnInfoBg
    },
    ".success": {
      backgroundColor: variables.btnSuccessBg
    },
    ".danger": {
      backgroundColor: variables.btnDangerBg
    },
    "NativeBase.Text": {
      color: variables.badgeColor,
      fontSize: variables.fontSizeBase - 2,
      lineHeight: variables.lineHeight - 1,
      textAlign: "center",
      paddingHorizontal: 2
    },
    backgroundColor: variables.badgeBg,
    padding: variables.badgePadding,
    paddingHorizontal: 4,
    alignSelf: "flex-start",
    borderRadius: 12,
    height: 24
  };
  return badgeTheme;
};
