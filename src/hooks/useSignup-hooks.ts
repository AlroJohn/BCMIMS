import { signupUser } from "@/actions/signup-action";
import { useState } from "react";
import { toast } from "sonner";


export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const useSignup = () => {
  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await signupUser(formData);

      if (response.success) {
        setSuccess(true);
        console.log("User registered:", response.user);
        toast.success(`User registered successfully!`);
        window.location.reload();
      } else {
        setError(response.message);
        console.error("Signup failed:", response.message);
      }
    } catch (err) {
      console.log("Signup failed:", err);
      setError("Signup failed. Please try again.");
      toast.error(`Signup failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return { formData, handleChange, handleSubmit, loading, error, success };
};
