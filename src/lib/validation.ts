export function validateName(name: string): string | null {
  if (!name || name.trim() === "") {
    return "Please enter your full name.";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters long.";
  }
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email || email.trim() === "") {
    return "Please enter your email address.";
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.trim().toLowerCase())) {
    return "Please enter a valid email address.";
  }
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone || phone.trim() === "") {
    return "Please enter your phone number.";
  }
  // Remove spaces, dashes, parentheses
  const sanitized = phone.replace(/[\s\-\(\)]/g, "");
  // Check if it's a valid Romanian (+40 / 07) or international number
  const regex = /^(\+?\d{1,3})?\d{9,14}$/;
  if (!regex.test(sanitized)) {
    return "Please enter a valid phone number.";
  }
  return null;
}

export function validateSelect(value: string, placeholderValues = ["Select...", "Choose...", ""]): string | null {
  if (!value || placeholderValues.includes(value.trim())) {
    return "Please select an option.";
  }
  return null;
}

export function validateCheckbox(checked: boolean, message = "This field is required."): string | null {
  if (!checked) {
    return message;
  }
  return null;
}

export function validateRequiredString(value: string, fieldName = "This field"): string | null {
  if (!value || value.trim() === "") {
    return `${fieldName} is required.`;
  }
  return null;
}
