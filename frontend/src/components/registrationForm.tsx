import React, { ChangeEvent, useState } from "react";

export interface RegistrationInput {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

interface RegistrationFormProps {
  onSubmit: (formDetails: RegistrationInput) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
}) => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const handleSubmit = (): void => {
    const formDetails: RegistrationInput = {
      email,
      username,
      firstName,
      lastName,
    };
    onSubmit(formDetails);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    setter(e.target.value);
  };

  return (
    <div className="registration-form">
      <div>Create Account</div>
      <input
        className="registration-input email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => handleInputChange(e, setEmail)}
      />
      <input
        className="registration-input username"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => handleInputChange(e, setUsername)}
      />
      <input
        className="registration-input first-name"
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => handleInputChange(e, setFirstName)}
      />
      <input
        className="registration-input last-name"
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => handleInputChange(e, setLastName)}
      />
      <div>
        <button onClick={handleSubmit} className="submit-button" type="button">
          Submit
        </button>
      </div>
    </div>
  );
};
