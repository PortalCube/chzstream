import { css } from "styled-components";
import { RuleSet } from "styled-components/dist/types";

export const theme = {
  breakpoint: {
    screen: {
      extraSmall: 0,
      small: 576,
      medium: 768,
      large: 992,
      extraLarge: 1200,
    },
    block: {
      extraSmall: {
        width: 0,
        height: 0,
      },
      small: {
        width: 300,
        height: 200,
      },
      medium: {
        width: 420,
        height: 280,
      },
      large: {
        width: 600,
        height: 400,
      },
      extraLarge: {
        width: 840,
        height: 560,
      },
    },
  },
};

type BlockBreakpoint = {
  width: number;
  height: number;
};

export const blockLessThanMixin =
  (value: BlockBreakpoint) => (content: RuleSet<object>) => css`
    @container block (width < ${value.width}px) or (height < ${value.height}px) {
      ${content}
    }
  `;

export const blockGreaterThanMixin =
  (value: BlockBreakpoint) => (content: RuleSet<object>) => css`
    @container block (width >= ${value.width}px) or (height >= ${value.height}px) {
      ${content}
    }
  `;

export const extraSmallBlockMixin = blockLessThanMixin(
  theme.breakpoint.block.small
);

export const smallBlockMixin = blockGreaterThanMixin(
  theme.breakpoint.block.small
);

export const mediumBlockMixin = blockGreaterThanMixin(
  theme.breakpoint.block.medium
);

export const largeBlockMixin = blockGreaterThanMixin(
  theme.breakpoint.block.large
);

export const extraLargeBlockMixin = blockGreaterThanMixin(
  theme.breakpoint.block.extraLarge
);

export const screenLessThanMixin =
  (width: number) => (content: RuleSet<object>) => css`
    @media screen and (max-width: ${width}px) {
      ${content}
    }
  `;

export const screenGreaterThanMixin =
  (width: number) => (content: RuleSet<object>) => css`
    @media screen and (min-width: ${width}px) {
      ${content}
    }
  `;

export const extraSmallScreenMixin = screenLessThanMixin(
  theme.breakpoint.screen.small
);

export const smallScreenMixin = screenGreaterThanMixin(
  theme.breakpoint.screen.small
);

export const mediumScreenMixin = screenGreaterThanMixin(
  theme.breakpoint.screen.medium
);

export const largeScreenMixin = screenGreaterThanMixin(
  theme.breakpoint.screen.large
);

export const extraLargeScreenMixin = screenGreaterThanMixin(
  theme.breakpoint.screen.extraLarge
);

export const Mixin = {
  screen: {
    less: {
      extraSmall: screenLessThanMixin(theme.breakpoint.screen.extraSmall),
      small: screenLessThanMixin(theme.breakpoint.screen.small),
      medium: screenLessThanMixin(theme.breakpoint.screen.medium),
      large: screenLessThanMixin(theme.breakpoint.screen.large),
      extraLarge: screenLessThanMixin(theme.breakpoint.screen.extraLarge),
    },
    greater: {
      extraSmall: screenGreaterThanMixin(theme.breakpoint.screen.extraSmall),
      small: screenGreaterThanMixin(theme.breakpoint.screen.small),
      medium: screenGreaterThanMixin(theme.breakpoint.screen.medium),
      large: screenGreaterThanMixin(theme.breakpoint.screen.large),
      extraLarge: screenGreaterThanMixin(theme.breakpoint.screen.extraLarge),
    },
  },
};
