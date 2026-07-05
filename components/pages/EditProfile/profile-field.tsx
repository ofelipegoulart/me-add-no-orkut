"use client";

import { PRIVACY_OPTIONS } from "@/data/edit-profile/constants";
import type { PrivacyLevel } from "@/data/edit-profile/types";

type BaseProps = {
  label: React.ReactNode;
  name: string;
  required?: boolean;
  error?: string;
  privacy?: boolean;
  privacyValue?: PrivacyLevel;
  onPrivacyChange?: (value: PrivacyLevel) => void;
};

type TextFieldProps = BaseProps & {
  type: "text";
  value: string;
  onChange: (value: string) => void;
};

type SelectFieldProps = BaseProps & {
  type: "select";
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

type TextareaFieldProps = BaseProps & {
  type: "textarea";
  value: string;
  onChange: (value: string) => void;
};

type RadioFieldProps = BaseProps & {
  type: "radio";
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

type CheckboxFieldProps = BaseProps & {
  type: "checkbox";
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
};

type ProfileFieldProps =
  | TextFieldProps
  | SelectFieldProps
  | TextareaFieldProps
  | RadioFieldProps
  | CheckboxFieldProps;

export function ProfileField(props: ProfileFieldProps) {
  const { label, name, required, error, privacy, privacyValue, onPrivacyChange, type } = props;

  function renderField() {
    switch (type) {
      case "text":
        return (
          <input
            type="text"
            name={name}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            className="orkut-input"
          />
        );

      case "select":
        return (
          <select
            name={name}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            className="orkut-select"
          >
            {props.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            name={name}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            className="orkut-textarea"
          />
        );

      case "radio":
        return (
          <span className="orkut-radio-group">
            {props.options.map((opt) => (
              <label key={opt} className="orkut-radio-label">
                <input
                  type="radio"
                  name={name}
                  value={opt}
                  checked={props.value === opt}
                  onChange={() => props.onChange(opt)}
                />
                {" "}{opt}
              </label>
            ))}
          </span>
        );

      case "checkbox":
        return (
          <span className="orkut-checkbox-group">
            {props.options.map((opt) => (
              <label key={opt} className="orkut-checkbox-label">
                <input
                  type="checkbox"
                  name={name}
                  value={opt}
                  checked={props.value.includes(opt)}
                  onChange={() => {
                    const next = props.value.includes(opt)
                      ? props.value.filter((v) => v !== opt)
                      : [...props.value, opt];
                    props.onChange(next);
                  }}
                />
                {" "}{opt}
              </label>
            ))}
          </span>
        );
    }
  }

  return (
    <tr>
      <td className="orkut-edit-label">
        {required && <span className="font-bold text-orkut-accent-pink">* </span>}{label}:
      </td>
      <td className="orkut-edit-field">
        {privacy && onPrivacyChange && (
          <span className="orkut-privacy-wrapper">
            <img src="/icons/i_key.gif" alt="" />
            <select
              className="orkut-privacy-select"
              value={privacyValue ?? "EVERYONE"}
              onChange={(e) => onPrivacyChange(e.target.value as PrivacyLevel)}
            >
              {PRIVACY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </span>
        )}
        {renderField()}
        {error && <div className="orkut-field-error">{error}</div>}
      </td>
    </tr>
  );
}
