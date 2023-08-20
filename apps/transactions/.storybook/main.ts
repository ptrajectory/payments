import type { StorybookConfig } from "@storybook/nextjs";
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin"

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],  
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: (config) => {
    (config.resolve as any).plugins = [
      ...(config.resolve?.plugins || []),
      new TsConfigPathsPlugin({ 
        extensions: config.resolve?.extensions || [],
        configFile: "./tsconfig.json"
      }),
    ]
    return config;
  }
};
export default config;
