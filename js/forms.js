/**
 * St. Catherine's College Form Ergonomics & Native Workflows
 * Implements the 7 Mandatory Proactive Ergonomic Pillars
 */

// Destructive Action Safeguard State Tracker (Pillar 1)
let resetSafeguardTimeout = null;

/**
 * Initializes proactive input masking and keystroke sanitization (Pillar 2)
 */
function initInputSanitization() {
  const mobileInput = document.getElementById("enroll-mobile");
  const lrnInput = document.getElementById("enroll-lrn");

  if (mobileInput) {
    mobileInput.addEventListener("input", function () {
      // Keystroke filtering: only numbers, strictly capped at 11 digits
      this.value = this.value.replace(/\D/g, "").slice(0, 11);
      if (this.value.length === 11 && this.classList.contains("input-error")) {
        clearFieldValidationError(this);
      }
    });
  }

  if (lrnInput) {
    lrnInput.addEventListener("input", function () {
      // 12-digit Learner Reference Number filtering
      this.value = this.value.replace(/\D/g, "").slice(0, 12);
      if (this.value.length === 12 && this.classList.contains("input-error")) {
        clearFieldValidationError(this);
      }
    });
  }
}

/**
 * Clears error highlight and error microcopy on input change (Pillar 3)
 * @param {HTMLElement} inputElement 
 */
function clearFieldValidationError(inputElement) {
  inputElement.classList.remove("input-error");
  const parentGroup = inputElement.closest(".form-group");
  if (parentGroup) {
    parentGroup.classList.remove("has-error");
    const errMsg = parentGroup.querySelector(".error-message");
    if (errMsg) errMsg.style.display = "none";
  }
}

/**
 * Robust Zero-Friction Auto-Calculation: Computes applicant age from birthdate (Pillar 4)
 * @param {HTMLInputElement} dateInput 
 */
function handleBirthdateCalculation(dateInput) {
  if (!dateInput || !dateInput.value) return;

  clearFieldValidationError(dateInput);

  const bdate = new Date(dateInput.value);
  const today = new Date();

  // Validate date is in the past
  if (bdate >= today) {
    displayAgeResult("Invalid birthdate selected (must be in past)", false);
    return;
  }

  let age = today.getFullYear() - bdate.getFullYear();
  const m = today.getMonth() - bdate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < bdate.getDate())) {
    age--;
  }

  if (age >= 3 && age <= 80) {
    let recommendation = "";
    if (age <= 5) recommendation = "Kindergarten / Pre-School";
    else if (age <= 11) recommendation = "Elementary (Grades 1 to 6)";
    else if (age <= 15) recommendation = "Junior High School (Grades 7 to 10)";
    else if (age <= 18) recommendation = "Senior High School (ABM / HUMSS / STEM)";
    else recommendation = "College / Higher Education (Teacher Education / BSBA)";

    displayAgeResult(`${age} years old • Recommended: ${recommendation}`, true);
  } else {
    displayAgeResult(`${age} years old (Outside typical student age range)`, false);
  }
}

/**
 * Displays the calculated age result in the UI
 * @param {string} message 
 * @param {boolean} isValid 
 */
function displayAgeResult(message, isValid) {
  const display = document.getElementById("enroll-age-display");
  if (!display) return;
  
  display.className = `calc-placeholder-pill ${isValid ? 'calculated' : 'error'}`;
  display.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="placeholder-icon" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
    <span>${message}</span>
  `;
}

/**
 * Destructive Action Safeguard: 2-step button state for Clear/Reset (Pillar 1)
 */
function handleSafeFormReset() {
  const form = document.getElementById("admissions-inquiry-form");
  const resetBtn = document.getElementById("safe-reset-btn");
  if (!form || !resetBtn) return;

  // Check if form has unsaved content
  const inputs = form.querySelectorAll("input, select, textarea");
  let hasContent = false;
  inputs.forEach(input => {
    if (input.type !== "submit" && input.type !== "button" && input.value.trim() !== "") {
      hasContent = true;
    }
  });

  // If already empty, standard reset without confirmation
  if (!hasContent) {
    form.reset();
    resetAgeDisplay();
    return;
  }

  // Check if already in confirmation state
  if (resetBtn.dataset.confirming === "true") {
    // Confirmed by second click: reset form
    clearTimeout(resetSafeguardTimeout);
    form.reset();
    resetAgeDisplay();
    inputs.forEach(input => clearFieldValidationError(input));

    resetBtn.dataset.confirming = "false";
    resetBtn.textContent = "Clear Form";
    resetBtn.classList.remove("btn-confirm-danger");
  } else {
    // First click: transition to confirmation state with 4s timeout
    resetBtn.dataset.confirming = "true";
    resetBtn.textContent = "Click again to confirm reset (4s)";
    resetBtn.classList.add("btn-confirm-danger");

    resetSafeguardTimeout = setTimeout(() => {
      resetBtn.dataset.confirming = "false";
      resetBtn.textContent = "Clear Form";
      resetBtn.classList.remove("btn-confirm-danger");
    }, 4000);
  }
}

function resetAgeDisplay() {
  const display = document.getElementById("enroll-age-display");
  if (display) {
    display.className = "calc-placeholder-pill";
    display.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="placeholder-icon" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
      <span>Select birthdate above to auto-calculate</span>
    `;
  }
}

/**
 * Form Submission Validation with Visual Error State Highlighting & First-Invalid Auto-Focus (Pillar 3)
 * @param {Event} event 
 */
function handleAdmissionsSubmit(event) {
  event.preventDefault();
  const form = document.getElementById("admissions-inquiry-form");
  if (!form) return;

  const requiredFields = [
    { el: document.getElementById("enroll-fname"), name: "First Name" },
    { el: document.getElementById("enroll-lname"), name: "Last Name" },
    { el: document.getElementById("enroll-email"), name: "Email Address" },
    { el: document.getElementById("enroll-mobile"), name: "Mobile Contact" },
    { el: document.getElementById("enroll-bdate"), name: "Date of Birth" },
    { el: document.getElementById("enroll-program"), name: "Academic Program" }
  ];

  let firstInvalidField = null;

  requiredFields.forEach(field => {
    const input = field.el;
    if (!input) return;

    let isFieldInvalid = false;
    let customErrorText = "";

    if (!input.value.trim()) {
      isFieldInvalid = true;
      customErrorText = `${field.name} is required.`;
    } else if (input.id === "enroll-mobile" && input.value.length < 11) {
      isFieldInvalid = true;
      customErrorText = "Must be a valid 11-digit mobile number (e.g. 09171234567).";
    } else if (input.id === "enroll-email" && !input.value.includes("@")) {
      isFieldInvalid = true;
      customErrorText = "Please enter a valid email address.";
    }

    const parentGroup = input.closest(".form-group");
    const errMsg = parentGroup ? parentGroup.querySelector(".error-message") : null;

    if (isFieldInvalid) {
      input.classList.add("input-error");
      if (parentGroup) parentGroup.classList.add("has-error");
      if (errMsg) {
        errMsg.textContent = customErrorText;
        errMsg.style.display = "block";
      }

      if (!firstInvalidField) {
        firstInvalidField = input;
      }
    } else {
      clearFieldValidationError(input);
    }
  });

  // First-invalid auto-focus & smooth scroll into view
  if (firstInvalidField) {
    firstInvalidField.focus();
    firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Successful submission simulation
  const successBanner = document.getElementById("inquiry-success-banner");
  if (successBanner) {
    successBanner.style.display = "block";
    successBanner.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Capture values for printable summary slip
  const studentName = `${document.getElementById("enroll-fname").value} ${document.getElementById("enroll-lname").value}`;
  const program = document.getElementById("enroll-program").selectedOptions[0].text;
  const contact = document.getElementById("enroll-mobile").value;

  const printSlip = document.getElementById("printable-inquiry-slip");
  if (printSlip) {
    printSlip.innerHTML = `
      <div style="padding: 16px; border: 2px dashed #0F2942; border-radius: 8px; margin-top: 16px;">
        <h4 style="font-size: 14pt; margin-bottom: 8px;">Saint Catherine's College Admissions Voucher</h4>
        <p><strong>Applicant Name:</strong> ${studentName}</p>
        <p><strong>Program/Strand:</strong> ${program}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        <p><strong>Registration Code:</strong> SCC-ADM-${Math.floor(100000 + Math.random() * 900000)}</p>
        <p><strong>Status:</strong> Preliminary Inquiry Registered</p>
        <p style="font-size: 9pt; color: #555; margin-top: 8px;">Present this voucher alongside your Form 138 (Report Card) and Good Moral Certificate at the Registrar's Office, Carcar City, Cebu.</p>
      </div>
    `;
  }

  form.reset();
  resetAgeDisplay();
}

/**
 * Decoupled Client-Native Workflow: Instant browser-native document printing (Pillar 6)
 */
function triggerPrintProspectus() {
  window.print();
}

// Attach event listeners on load
document.addEventListener("DOMContentLoaded", () => {
  initInputSanitization();

  const resetBtn = document.getElementById("safe-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", handleSafeFormReset);
  }

  const admissionsForm = document.getElementById("admissions-inquiry-form");
  if (admissionsForm) {
    admissionsForm.addEventListener("submit", handleAdmissionsSubmit);
  }

  const bdateInput = document.getElementById("enroll-bdate");
  if (bdateInput) {
    bdateInput.addEventListener("change", function () {
      handleBirthdateCalculation(this);
    });
  }

  // Hook live error clearing on all inputs
  const allInputs = document.querySelectorAll("#admissions-inquiry-form input, #admissions-inquiry-form select, #admissions-inquiry-form textarea");
  allInputs.forEach(input => {
    input.addEventListener("input", function () {
      clearFieldValidationError(this);
    });
  });
});
