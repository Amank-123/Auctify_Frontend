import LegalPage from "../../policies/LegalPages.jsx";
import CookiesData from "../../policies/CookiesPage.js"

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Cookies"
      description="This Cookies explains how we handle your data."
      sections={CookiesData}
    />
  );
}