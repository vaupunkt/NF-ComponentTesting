import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameForm from "./index";

jest.mock("next/router", () => ({
  useRouter() {
    return { push: jest.fn() };
  },
}));

test("renders two input fields and a button", () => {
  render(<GameForm />);
  const inputFields = screen.getAllByRole("textbox");
  expect(inputFields).toHaveLength(2);

  const button = screen.getByRole("button", { name: /create game/i });
  expect(button).toBeInTheDocument();
});

test("renders a form with the accessible name 'Create a new game'", () => {
  render(<GameForm />);
  const form = screen.getByRole("form", { name: /Create a new game/i });
  expect(form).toBeInTheDocument();
});

test("submits the correct form data when every field is filled out", async () => {
  const handleCreateGame = jest.fn();
  const user = userEvent.setup();

  render(<GameForm onCreateGame={handleCreateGame} />);
  const inputNameOfGame = screen.getByRole("textbox", {
    name: /Name of game/i,
  });
  const inputPlayerName = screen.getByRole("textbox", {
    name: /Player names, separated by comma/i,
  });
  const button = screen.getByRole("button", { name: /create game/i });
  await user.type(inputNameOfGame, "Monopoly");
  await user.type(inputPlayerName, "Max");
  await user.click(button);

  expect(handleCreateGame).toHaveBeenCalledWith({
    nameOfGame: "Monopoly",
    playerNames: ["Max"],
  });
});

test("does not submit form if one input field is left empty", async () => {
  const handleCreateGame = jest.fn();
  const user = userEvent.setup();

  render(<GameForm onCreateGame={handleCreateGame} />);
  const inputNameOfGame = screen.getByRole("textbox", {
    name: /Name of game/i,
  });
  const inputPlayerName = screen.getByRole("textbox", {
    name: /Player names, separated by comma/i,
  });

  const button = screen.getByRole("button", { name: /create game/i });
  await user.type(inputNameOfGame, "Monopoly");
  inputPlayerName.value = "";
  await user.click(button);
  expect(handleCreateGame).not.toBeCalled();
  inputNameOfGame.value = "";
  await user.type(inputPlayerName, "Max");
  await user.click(button);
  expect(handleCreateGame).not.toBeCalled();
});
