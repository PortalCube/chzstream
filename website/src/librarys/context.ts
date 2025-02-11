import { createContext } from "react";
import { Block } from "./block.ts";
import { MixerItem } from "./mixer.ts";

export const BlockContext = createContext<Block>(null!);
export const MixerContext = createContext<MixerItem>(null!);
