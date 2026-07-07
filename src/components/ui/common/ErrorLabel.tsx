import { FieldError } from 'react-hook-form';

type Props = {
  fieldError?: FieldError;
};
const ErrorLabel = ({ fieldError }: Props) => (
  <label className="label">
    {fieldError && (
      <span className="label-text-alt text-error">{fieldError.message}</span>
    )}
  </label>
);

export default ErrorLabel;
