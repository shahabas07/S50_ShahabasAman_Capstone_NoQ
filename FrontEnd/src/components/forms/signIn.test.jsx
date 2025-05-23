import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "./signIn";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";

// Mock environment variable
beforeAll(() => {
  process.env.VITE_API_URI = "http://localhost:3000";
});

// Mock dependencies
jest.mock("axios");
jest.mock("js-cookie");
jest.mock("react-hook-form", () => ({
  useForm: jest.fn(() => ({
    register: jest.fn(),
    handleSubmit: jest.fn((fn) => async (e) => {
      e.preventDefault();
      await fn();
    }),
    formState: { errors: {} },
  })),
}));

describe("SignIn Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders SignIn component correctly", () => {
    render(<SignIn />);
    expect(screen.getByText(/Welcome!!/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument();
  });

  test("Google login button redirects to the correct URL", () => {
    delete window.location;
    window.location = { assign: jest.fn() };

    render(<SignIn />);
    const googleButton = screen.getByText(/Sign in with Google/i);
    fireEvent.click(googleButton);

    expect(window.location.assign).toHaveBeenCalledWith(
      expect.stringContaining("/auth/google")
    );
  });

  test("submitting the form calls the API and sets token", async () => {
    axios.post.mockResolvedValue({
      data: { token: "mock-token", username: "mockUser" },
    });

    delete window.location;
    window.location = { assign: jest.fn() };

    render(<SignIn />);
    fireEvent.change(screen.getByLabelText(/Username:/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText(/Sign In/i));

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/service/sign-in"),
      { username: "testuser", password: "password123" }
    ));
    expect(Cookies.set).toHaveBeenCalledWith("token", "mock-token", { expires: 7 });
    expect(window.location.assign).toHaveBeenCalledWith("/profile/mockUser");
  });

  test("displays error message on API failure", async () => {
    axios.post.mockRejectedValue({ response: { data: "Invalid username or password" } });

    render(<SignIn />);
    fireEvent.change(screen.getByLabelText(/Username:/i), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByText(/Sign In/i));

    await waitFor(() =>
      expect(screen.getByText(/Invalid username or password/i)).toBeInTheDocument()
    );
  });
});