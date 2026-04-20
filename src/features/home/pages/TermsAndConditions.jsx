import LegalPage from "../../policies/LegalPages.jsx";
import TermsData from "../../policies/TermAndConditionData.js"

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      description="These Terms govern your use of Auctify."
      sections={TermsData}
    />
  );
}