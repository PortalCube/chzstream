import { createContext } from "react";
import { Block } from "@web/librarys/block.ts";
import { MixerItem } from "@web/librarys/mixer.ts";

export const BlockContext = createContext<Block>(null!);
export const MixerContext = createContext<MixerItem>(null!);
