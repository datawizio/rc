import metadata from "libphonenumber-js/metadata.min.json";
import {
  parsePhoneNumberFromString,
  getCountryCallingCode,
  AsYouType,
  formatIncompletePhoneNumber
} from "libphonenumber-js/core";

import type { PhoneNumber, CountryCode } from "libphonenumber-js";

/**
 * Parses an E.164 phone number into a {@link PhoneNumber} instance.
 */
export const parsePhoneNumber = (value?: string) => {
  return parsePhoneNumberFromString(value || "", metadata);
};

/**
 * Generates the national number digits from a parsed phone number.
 * May prepend the national prefix depending on the country rules.
 * The input must be a complete and valid {@link PhoneNumber} instance.
 *
 * @example
 * generateNationalNumberDigits({ country: "US", phone: "2133734253" });
 * // returns '12133734253'
 */
export const generateNationalNumberDigits = (phoneNumber: PhoneNumber) => {
  return phoneNumber.formatNational().replace(/\D/g, "");
};

/**
 * Converts a string of phone number digits into a (possibly incomplete) E.164 phone number.
 *
 * If the number starts with a `+`, it is assumed to be in international format
 * and returned as-is (unless it's just `+`, in which case `undefined` is returned).
 * Otherwise, the `country` code is used to prepend the appropriate country calling code.
 */
export const e164 = (number?: string, country?: CountryCode) => {
  if (!number) {
    return;
  }

  // If the phone number is being input in international format.
  if (number[0] === "+") {
    // If it's just the `+` sign, then return nothing.
    if (number === "+") {
      return;
    }

    // If there are any digits, then the `value` is returned as is.
    return number;
  }

  // For non-international phone numbers,
  // an accompanying country code is required.
  if (!country) {
    return;
  }

  const partialNationalSignificantNumber = getNationalSignificantNumberDigits(
    number,
    country
  );

  if (partialNationalSignificantNumber) {
    return `+${getCountryCallingCode(
      country,
      metadata
    )}${partialNationalSignificantNumber}`;
  }
};

/**
 * Determines the most likely country for a partially entered E.164 phone number in international format.
 *
 * This function attempts to derive the country from the phone number alone (e.g., `+44` → `GB`),
 * regardless of the currently selected country. It is useful for dynamic updates while the user is typing.
 *
 * If the derived country is not in the allowed list (`countries`), and international selection is allowed,
 * it may return `undefined` to clear the current selection.
 */
export const getCountryForPartialE164Number = (
  partialE164Number: string,
  country?: CountryCode,
  countries?: string[],
  includeInternationalOption?: boolean
) => {
  if (partialE164Number === "+") {
    // Don't change the currently selected country yet.
    return country;
  }

  const derived_country =
    getCountryFromPossiblyIncompleteInternationalPhoneNumber(partialE164Number);

  // If a phone number is being input in international form
  // and the country can already be derived from it,
  // then select that country.
  if (
    derived_country &&
    (!countries || countries.indexOf(derived_country) >= 0)
  ) {
    return derived_country;
  }
  // If "International" country option has not been disabled,
  // and the international phone number entered doesn't correspond
  // to the currently selected country, then reset the currently selected country.
  else if (
    country &&
    includeInternationalOption &&
    !couldNumberBelongToCountry(partialE164Number, country)
  ) {
    return undefined;
  }

  // Don't change the currently selected country.
  return country;
};

/**
 * Parses a phone number input string and derives the corresponding country and E.164 formatted value.
 *
 * This function processes the raw user input from an `<input/>` field, handles
 * international formatting rules (like prepending `+`), resets or adjusts the selected country
 * based on input changes, and returns the parsed results.
 *
 * It supports incomplete input, gracefully handles user corrections, and attempts to
 * derive the most appropriate country based on the partially entered phone number.
 */
export const parseInput = (
  input?: string,
  prevInput?: string,
  country?: CountryCode,
  defaultCountry?: CountryCode,
  countries?: string[],
  includeInternationalOption?: boolean,
  international?: boolean
) => {
  // If input doesn’t start with '+', but either no country is selected
  // or an international format is forced, prepend '+' to ensure an international format.
  if (input && input[0] !== "+" && (!country || international)) {
    input = "+" + input;
  }

  // If the previous input was international and the user erased everything,
  // reset the selected country accordingly: clear the country if an international
  // format is enabled, otherwise reset to the default country.
  // This prevents invalid country selections after clearing input.
  // See: https://github.com/catamphetamine/react-phone-number-input/issues/273
  if (!input && prevInput && prevInput[0] === "+") {
    if (international) {
      country = undefined;
    } else {
      country = defaultCountry;
    }
  }

  // Also resets such "randomly" selected country
  // as soon as the user erases the number
  // digit-by-digit up to the leading `+` sign.
  if (
    input === "+" &&
    prevInput &&
    prevInput[0] === "+" &&
    prevInput.length > "+".length
  ) {
    country = undefined;
  }

  // Generate the new `value` property.
  let value;
  if (input) {
    if (input[0] === "+") {
      if (input !== "+") {
        value = input;
      }
    } else {
      value = e164(input, country);
    }
  }

  // Derive the country from the phone number.
  // (regardless of whether there's any country currently selected)
  if (value) {
    country = getCountryForPartialE164Number(
      value,
      country,
      countries,
      includeInternationalOption
    );
  }

  return { input, country, value };
};

/**
 * Determines the country for a given (possibly incomplete) E.164 phone number.
 */
export const getCountryFromPossiblyIncompleteInternationalPhoneNumber = (
  number: string
) => {
  const formatter = new AsYouType(undefined, metadata);
  formatter.input(number);
  return formatter.getCountry();
};

/**
 * Parses a partially entered national phone number digits
 * (or a partially entered E.164 international phone number)
 * and returns the national significant number part.
 * National significant number returned doesn't come with a national prefix.
 */
export const getNationalSignificantNumberDigits = (
  number: string,
  country: CountryCode
) => {
  // Create "as you type" formatter.
  const formatter = new AsYouType(country, metadata);
  // Input partial national phone number.
  formatter.input(number);
  // Return the parsed partial national phone number.
  const phoneNumber = formatter.getNumber();
  return phoneNumber && phoneNumber.nationalNumber;
};

/**
 * Checks if a partially entered E.164 phone number could belong to a country.
 */
export const couldNumberBelongToCountry = (
  number: string,
  country: CountryCode
) => {
  const countryCallingCode = getCountryCallingCode(country, metadata);

  let i = 0;
  while (i + 1 < number.length && i < countryCallingCode.length) {
    if (number[i + 1] !== countryCallingCode[i]) {
      return false;
    }
    i++;
  }

  return true;
};

/**
 * Returns the initial parsed input value for the phone number input field.
 */
export const getInitialParsedInput = (
  value: string,
  country: CountryCode,
  international: boolean
) => {
  // If `international` property is `true`,
  // then always show country calling code in the input field.
  if (!value && international && country) {
    return `+${getCountryCallingCode(country, metadata)}`;
  }

  return value;
};

/**
 * Generates the initial parsed input value to display in the phone input field.
 */
export const generateInitialParsedInput = (
  value: string,
  phoneNumber: PhoneNumber | undefined,
  additionalParams: {
    international: boolean;
    defaultCountry: CountryCode;
    displayInitialValueAsLocalNumber: boolean;
  }
) => {
  // If the `value` (E.164 phone number) belongs to the currently selected country
  // and `displayInitialValueAsLocalNumber` property is `true`
  // then convert `value` (E.164 phone number) to a local phone number digits.
  // E.g. '+78005553535' -> '88005553535'.
  if (
    additionalParams.displayInitialValueAsLocalNumber &&
    phoneNumber &&
    phoneNumber.country
  ) {
    return generateNationalNumberDigits(phoneNumber);
  }

  return getInitialParsedInput(
    value,
    additionalParams.defaultCountry,
    additionalParams.international
  );
};

/**
 * Formats a phone number string based on the provided country and formatting options.
 *
 * Parses the input, generates an initially parsed value (optionally international),
 * removes spaces from the initial value, and formats the incomplete phone number for display.
 */
export const formatNumber = (
  val: string,
  country: CountryCode | undefined,
  defaultCountry: CountryCode,
  international: boolean
) => {
  const phoneNumber = parsePhoneNumber(val);

  let value = generateInitialParsedInput(val, phoneNumber, {
    international,
    defaultCountry,
    displayInitialValueAsLocalNumber: false
  });

  value = value.replace(/ /g, "");

  const formated = formatIncompletePhoneNumber(val, country, metadata);
  return {
    country: phoneNumber ? phoneNumber.country : country,
    value,
    formated
  };
};

/**
 * Checks if a given phone number string is a valid phone number.
 */
export const isValidPhoneNumber = (value: string) => {
  if (!value) return false;

  const phoneNumber = parsePhoneNumberFromString(value, metadata);

  if (!phoneNumber) return false;
  return phoneNumber.isValid();
};
