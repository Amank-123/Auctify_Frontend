import LegalPage from "../../policies/LegalPages";
import PolicyData from "../../policies/PrivacyPolicyData.js"

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This Privacy Policy explains how we handle your data."
      sections={PolicyData}
    />
  );
}