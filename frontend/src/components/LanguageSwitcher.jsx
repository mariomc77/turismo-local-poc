import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("app_language", language);
  };

  const currentLanguage = i18n.language || "es";

  return (
    <div className="d-flex align-items-center gap-2">
      <span className="small text-muted">{t("navbar.language")}</span>

      <div className="btn-group btn-group-sm" role="group" aria-label={t("navbar.language")}>
        <button
          type="button"
          className={`btn ${currentLanguage === "es" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => changeLanguage("es")}
          aria-pressed={currentLanguage === "es"}
        >
          ES
        </button>

        <button
          type="button"
          className={`btn ${currentLanguage === "en" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => changeLanguage("en")}
          aria-pressed={currentLanguage === "en"}
        >
          EN
        </button>
      </div>
    </div>
  );
}