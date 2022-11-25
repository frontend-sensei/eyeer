const path = require("path");

module.exports = {
  packagerConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "Braker",
        authors: "Yaroslav Gulnazaryan",
        description:
          "Braker helps you take breaks. Also suggests how best to take a break",
        iconUrl:
          "https://github.com/frontend-sensei/eyeer/blob/master/main/assets/braker-icon.ico",
        setupIcon: path.join(__dirname, "/main/assets/braker-icon.ico"),
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin", "linux"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          name: "Braker",
          productName: "Braker",
          productDescription: "Braker helps you take breaks",
          description:
            "Braker helps you take breaks. Also suggests how best to take a break",
          maintainer: "https://github.com/frontend-sensei",
          homepage: "https://github.com/frontend-sensei/eyeer",
          icon: path.join(__dirname, "/main/assets/braker-icon.png"),
        },
      },
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {
        options: {
          name: "Braker",
          productName: "Braker",
          productDescription: "Braker helps you take breaks",
          description:
            "Braker helps you take breaks. Also suggests how best to take a break",
          maintainer: "https://github.com/frontend-sensei",
          homepage: "https://github.com/frontend-sensei/eyeer",
          icon: path.join(__dirname, "/main/assets/braker-icon.png"),
        },
      },
    },
  ],
};
