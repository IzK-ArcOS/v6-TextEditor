import SearchReplaceSvelte from "$apps/TextEditor/Components/Overlay/SearchReplace.svelte";
import { AppRuntime } from "$ts/apps";
import { ComponentIcon } from "$ts/images/general";
import { App } from "$types/app";

export const SearchReplace: App = {
  metadata: {
    name: "Search & Replace",
    description: "Replace text in the file",
    author: "The ArcOS Team",
    version: "1.0.0",
    icon: ComponentIcon,
  },
  runtime: AppRuntime,
  content: SearchReplaceSvelte,
  id: "SearchReplace",
  size: { w: 360, h: 186 },
  minSize: { w: 360, h: 186 },
  maxSize: { w: 360, h: 186 },
  pos: { x: 0, y: 0 },
  state: {
    maximized: false,
    minimized: false,
    headless: false,
    fullscreen: false,
    resizable: false,
  },
  controls: {
    minimize: false,
    maximize: false,
    close: false,
  },
};
