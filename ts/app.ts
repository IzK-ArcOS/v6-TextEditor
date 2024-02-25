import { SafeMode } from "$state/Desktop/ts/store";
import { TextEditorIcon } from "$ts/images/apps";
import { App } from "$types/app";
import AppSvelte from "../App.svelte";
import { Runtime } from "./runtime";

export const TextEditor: App = {
  metadata: {
    name: "Writer",
    description: "Read and edit plain-text files",
    author: "ArcOS Team",
    version: "2.0.0",
    icon: TextEditorIcon,
    appGroup: "utilities",
  },
  runtime: Runtime,
  content: AppSvelte,
  id: "TextEditor",
  size: { w: 700, h: 500 },
  minSize: { w: 480, h: 500 },
  maxSize: { w: 1800, h: 1000 },
  pos: { x: 60, y: 60 },
  state: {
    minimized: false,
    maximized: false,
    headless: false,
    fullscreen: false,
    resizable: true,
  },
  controls: {
    minimize: true,
    maximize: true,
    close: true,
  },
  glass: true,
  acceleratorDescriptions: {
    "alt+shift+o": "Open the file in File Manager",
    "alt+o": "Open a file",
    "alt+s": "Save the contents to the opened file",
    "alt+shift+s": "Save the contents to a different file",
  },
  loadCondition: () => !SafeMode.get(),
};
