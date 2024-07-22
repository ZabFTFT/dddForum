import {
  RegistrationForm,
  RegistrationInput,
} from "../components/registrationForm";
import { Layout } from "../components/layout";
import axios from "axios";
import { useSpinner } from "../contexts/spinnerContext";
import { toast, ToastContainer } from "react-toastify";
import { useUser } from "../contexts/usersContext";
import { useNavigate } from "react-router-dom";
import { OverlaySpinner } from "../components/overlaySpinner";

const api = {
  posts: {
    getPosts: () => {
      return axios.get("<http://localhost:8080/posts?sort=recent>");
    },
  },
  register: (input: RegistrationInput) => {
    return axios.post("<http://localhost:8080/users/new>", {
      ...input,
    });
  },
};

export const RegistrationPage = () => {
  const handleSubmitRegistrationForm = async (input: RegistrationInput) => {
    const { setUser } = useUser();
    const spinner = useSpinner();
    const navigate = useNavigate();
    try {
      const validationResult = validateForm(input);

      if (validationResult.success !== true) {
        showErrorToast(validationResult.errorMessage || "Invalid data");
      }

      spinner.activate();

      const registerResult = await registerUser(input);

      if (registerResult.success) {
        setUser(registerResult.user);

        showSuccessToast("Registration successful!");

        spinner.deactivate();

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        spinner.deactivate();

        throw new Error("Registration failed. Please try again.");
      }
    } catch (error) {
      showErrorToast("An error occurred. Please try again.");
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <RegistrationForm
        onSubmit={(input: RegistrationInput) =>
          handleSubmitRegistrationForm(input)
        }
      />
    </Layout>
  );
};

type ValidationResult = {
  success: boolean;
  errorMessage?: string;
};

const validateForm = (input: RegistrationInput): ValidationResult => {
  if (input.email.indexOf("@") === -1)
    return { success: false, errorMessage: "Email invalid" };
  if (input.username.length < 2)
    return { success: false, errorMessage: "Username invalid" };

  return { success: true };
};

interface RegisterResult {
  success: boolean;
  user: RegistrationInput;
}

const registerUser = async (
  input: RegistrationInput
): Promise<RegisterResult> => {
  // Implement API call to register user
  const res = await api.register(input);

  if (res.status === 200) {
    return { success: true, user: input };
  }

  return { success: false, user: input };
};

const showSuccessToast = (message: string) => {
  return toast(message);
};

const showErrorToast = (errorMessage: string) => {
  return toast.error(errorMessage);
};
