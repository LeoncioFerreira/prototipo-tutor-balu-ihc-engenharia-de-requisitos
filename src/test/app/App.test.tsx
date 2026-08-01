import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../../app/App";

test("renders the Balu entry screen", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /entrar no balu/i })).toBeInTheDocument();
});
