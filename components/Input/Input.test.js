import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from ".";

test("renders a label and an input with the correct attributes", () => {
  render(<Input name="nameOfGame" labelText="Name of game" />);
  const input = screen.getByLabelText(/Name of game/i);
  expect(input).toHaveAttribute("name", "nameOfGame");
});

test("calls callback on every user input", async () => {
  const handleChange = jest.fn();
  const user = userEvent.setup();

  render(
    <Input onChange={handleChange} name="nameOfGame" labelText="Name of game" />
  );
  const input = screen.getByLabelText(/Name of game/i);
  await user.type(input, "text");
  expect(handleChange).toHaveBeenCalledTimes(4);
});
