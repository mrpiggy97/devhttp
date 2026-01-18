import { Command, SubCommand } from "../Command";
import SpaceInvadersExecutor from "./SpaceInvadersExecutor";

const playCmd = new SubCommand(
  "play",
  SpaceInvadersExecutor,
  [],
  [],
  "launch the space invaders game in a modal window"
);

export const spaceInvadersCmd: Command = new Command("space-invaders", [
  playCmd,
]);
