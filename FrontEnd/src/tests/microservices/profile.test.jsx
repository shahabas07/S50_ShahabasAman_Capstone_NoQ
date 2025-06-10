// tests/microservices/profile.test.jsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import Profile from "../../components/profileComponents/Profile";

jest.mock("axios");

describe("Profile Component - Microservices Test", () => {
  const mockProfileData = [
    {
      _id: "123",
      username: "shahabas",
      name: "Shahabas Aman",
      bio: "Test bio",
      location: "India",
      zip: "123456",
      email: "shahabas@example.com",
      category: "Dentist",
      avatar: "",
      picture: "",
      section: "A1",
      website: "https://example.com"
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockProfileData });
    document.cookie =
      "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoYWhhYmFzIn0.fake_signature";
  });

  test("renders profile data correctly for matching username", async () => {
    render(
      <MemoryRouter initialEntries={["/profile/shahabas"]}>
        <Routes>
          <Route path="/profile/:User" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => screen.getByText(/Shahabas Aman/));
    expect(screen.getByText("Test bio")).toBeInTheDocument();
    expect(screen.getByText(/India, India. Zip: 123456/)).toBeInTheDocument();
    expect(screen.getByText(/Dentist/)).toBeInTheDocument();
  });

  test("shows error message if user not found", async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/profile/unknown"]}>
        <Routes>
          <Route path="/profile/:User" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/User doesn't exist/i));
    expect(screen.getByText(/Navigate to Homepage/i)).toBeInTheDocument();
  });
});
