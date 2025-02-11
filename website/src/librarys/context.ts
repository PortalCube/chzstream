import { createContext } from "react";
import { Block } from "./block.ts";

export const BlockContext = createContext<Block>(null!);
