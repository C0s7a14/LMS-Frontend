import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ptBR from "./locales/pt-BR.json";
import enUS from "./locales/en-US.json";
import esES from "./locales/es-ES.json";

const savedUser = localStorage.getItem("user");

let savedLanguage = "pt-BR";

if (savedUser) {
  try {
    const parsedUser = JSON.parse(savedUser);

    if (parsedUser?.idioma_preferido) {
      savedLanguage = parsedUser.idioma_preferido;
    }
  } catch {
    savedLanguage = "pt-BR";
  }
}

i18n.use(initReactI18next).init({
  resources: {
    "pt-BR": {
      translation: ptBR,
    },
    "en-US": {
      translation: enUS,
    },
    "es-ES": {
      translation: esES,
    },
  },
  lng: savedLanguage,
  fallbackLng: "pt-BR",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;