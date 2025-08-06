import * as Flags from "country-flag-icons/react/3x2";
import Select from "@/components/Select";
import countries from "./helpers/countries";

import { useState, useEffect, useRef } from "react";
import {
  parseInput,
  formatNumber,
  isValidPhoneNumber
} from "./helpers/phoneInputHelper";
import { Input, Space } from "antd";
import { useConfig } from "@/hooks";

import type { FC, ChangeEvent } from "react";
import type { InputRef } from "antd";
import type { CountryCode } from "libphonenumber-js";
import type { FlagComponent } from "country-flag-icons/react/3x2";

import "./index.less";

export interface PhoneInputProps {
  placeholder?: string;
  defaultCountry?: CountryCode;
  value?: string;
  onChange?: (value: string) => void;
}

export interface PhoneInputComponent extends FC<PhoneInputProps> {
  isValidPhoneNumber: (value: string) => boolean;
}

const PhoneInput: PhoneInputComponent = ({
  defaultCountry = "UA",
  placeholder,
  value,
  onChange
}) => {
  const { translate } = useConfig();
  const [internalValue, setInternalValue] = useState<string>();
  const [formatedValue, setFormatedValue] = useState<string>();

  const [selectedCountry, setSelectedCountry] = useState<
    CountryCode | undefined
  >("UA");

  const inputRef = useRef<InputRef>(null);

  const addInternationalOption = null;
  const international = true;

  const handleCountryChange = (country: CountryCode) => {
    const { value: val, ...rest } = formatNumber(
      "",
      country,
      country,
      international
    );

    if (!rest.formated && val) rest.formated = val;

    setSelectedCountry(country);
    setInternalValue(val);
    setFormatedValue(rest.formated);

    onChange?.(val);

    if (inputRef.current) inputRef.current.focus();
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { input, country } = parseInput(
      e.target.value,
      internalValue,
      selectedCountry,
      defaultCountry,
      undefined,
      addInternationalOption ?? undefined,
      true
    );

    const { value, formated } = formatNumber(
      input ?? "",
      country,
      defaultCountry,
      international
    );

    setInternalValue(value);
    setFormatedValue(formated);
    setSelectedCountry(country);
    onChange?.(value);
  };

  useEffect(() => {
    if (internalValue === value || !value || !selectedCountry) return;

    const {
      value: val,
      country,
      ...rest
    } = formatNumber(value, selectedCountry, defaultCountry, international);

    if (!rest.formated && val) rest.formated = val;

    setInternalValue(val);
    setFormatedValue(rest.formated);
    setSelectedCountry(country);
    // eslint-disable-next-line
  }, [defaultCountry, value]);

  return (
    <Space.Compact className="phone-input">
      <Select
        className="phone-input-select"
        classNames={{ popup: { root: "phone-input-select-dropdown" } }}
        value={selectedCountry}
        popupMatchSelectWidth={false}
        optionLabelProp="label"
        optionFilterProp="title"
        onChange={value => handleCountryChange(value as CountryCode)}
        showSearch={true}
        notFoundContent={translate("NO_DATA")}
      >
        {countries.map(country => {
          const Flag = (Flags as Record<string, FlagComponent>)[country.value];
          return (
            <Select.Option
              key={country.value}
              value={country.value}
              label={<Flag />}
              title={country.value}
            >
              <Flag /> {country.value}
            </Select.Option>
          );
        })}
      </Select>

      <Input
        ref={inputRef}
        className="phone-input-input"
        type="tel"
        onChange={handlePhoneChange}
        value={formatedValue}
        placeholder={placeholder}
      />
    </Space.Compact>
  );
};

PhoneInput.isValidPhoneNumber = (value: string) => isValidPhoneNumber(value);

export default PhoneInput;
