import "@testing-library/jest-dom";
import { screen, render } from "@testing-library/react";
import { TestComponent } from "@/components/for-test";

describe("Testcomponet", () => {
  it("it render the header", () => {
    render(<TestComponent />);
    const header = screen.getByRole("heading", { level: 1 });
    const link = screen.getByRole("link", { name: "About" });
    const headerText = header.textContent;
    expect(headerText).toBe("Home");
    expect(link).toBeInTheDocument();
    expect(header).toBeInTheDocument();
  });
});
