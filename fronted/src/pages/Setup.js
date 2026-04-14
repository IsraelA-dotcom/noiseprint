import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./Setup.css";

export default function Setup() {
  const navigate = useNavigate();
  const [contact1, setContact1] = useState(
    () => localStorage.getItem("np_contact1") || ""
  );
  const [contact2, setContact2] = useState(
    () => localStorage.getItem("np_contact2") || ""
  );
  const [errors, setErrors] = useState({});

  function validate() {
  const e = {};

  // Contact 1 is mandatory and must be valid
  if (!contact1 || !isValidPhoneNumber(contact1)) {
    e.contact1 = "Enter a valid number for the selected country";
  }

  // Contact 2 is optional — only validate if something is typed
  if (contact2 && contact2.trim().length > 0 && !isValidPhoneNumber(contact2)) {
    e.contact2 = "Enter a valid number for the selected country";
  }

  return e;
}

  function handleArm() {
  const e = validate();
  if (Object.keys(e).length) {
    setErrors(e);
    return;
  }

  // Only save valid data
  if (contact1 && isValidPhoneNumber(contact1)) {
    localStorage.setItem("np_contact1", contact1);
  }

  // Save contact2 only if valid, clear it if empty
  if (contact2 && isValidPhoneNumber(contact2)) {
    localStorage.setItem("np_contact2", contact2);
  } else {
    localStorage.removeItem("np_contact2");
  }

  navigate("/monitoring", {
    state: { contact1, contact2 }
  });
}

  return (
    <div className="setup-root">
      <div className="setup-glow" />

      <div className="setup-inner">
        <button className="setup-back" onClick={() => navigate("/onboarding")}>
          ← Back
        </button>

        <div className="setup-header">
          <p className="setup-eyebrow">Configuration</p>
          <h1 className="setup-title">Setup</h1>
          <p className="setup-subtitle">
            Who should we alert if a threat is detected?
          </p>
        </div>

        <div className="setup-form">
          <div className="setup-field">
            <label className="setup-label">Emergency Contact 1</label>
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              defaultCountry="NG"
              value={contact1}
              onChange={(val) => {
                setContact1(val);
                setErrors((e) => ({ ...e, contact1: null }));
              }}
              className="setup-phone-input"
            />
            {errors.contact1 && (
              <span className="setup-error">{errors.contact1}</span>
            )}
          </div>

          <div className="setup-field">
            <label className="setup-label">
              Emergency Contact 2{" "}
              <span className="setup-optional">(optional)</span>
            </label>
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              defaultCountry="NG"
              value={contact2}
              onChange={(val) => {
                setContact2(val);
                setErrors((e) => ({ ...e, contact2: null }));
              }}
              className="setup-phone-input"
            />
            {errors.contact2 && (
              <span className="setup-error">{errors.contact2}</span>
            )}
          </div>
        </div>

        <button className="setup-cta" onClick={handleArm}>
          Arm NoisePrint
        </button>

        <p className="setup-footnote">
          Contacts are stored locally · Never shared with third parties
        </p>
      </div>
    </div>
  );
}