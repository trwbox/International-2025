import Keycloak from "keycloak-js";

const initOptions = {
  // TODO: Change this if we get this in a docker container to use the container name
  url: "http://localhost:8080/",
  // TODO: Get a different realm name
  realm: "3d Print Pro",
  // TODO: Get a different client ID
  clientId: "business-webapp",
};

const kc = new Keycloak(initOptions);

export const initializeKeycloak = () =>
  kc.init({ onLoad: "check-sso" }).then((authenticated) => {
    console.log("Keycloak initialized:", authenticated);
  });

export default kc;
