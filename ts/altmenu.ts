import { SEP_ITEM } from "$state/Desktop/ts/store";
import { spawnApp } from "$ts/apps";
import { ContextMenuItem } from "$types/app";
import { Runtime } from "./runtime";

export const TextEditorAltMenu: (runtime: Runtime) => ContextMenuItem[] = (runtime: Runtime) => [
  {
    caption: "File",
    subItems: [
      {
        caption: "Open...",
        action: () => runtime.openFile(),
      },
      SEP_ITEM,
      {
        caption: "Save",
        action: async () => {
          await runtime.save(runtime.buffer.get());
        },
        disabled: () => !runtime.path.get(),
      },
      {
        caption: "Save As...",
        action: async () => await runtime.saveAs(runtime.buffer.get()),
      },
      SEP_ITEM,
      {
        caption: "Open file location",
        action: () => {
          runtime.openFileLocation();
        },
        disabled: () => !runtime.path.get()
      },
      SEP_ITEM,
      {
        caption: "Exit",
        action: () => runtime.process.handler.kill(runtime.pid, true)
      }
    ]
  },
  {
    caption: "View",
    subItems: [

      {
        caption: "Fixed-width font",
        action: () => { runtime.monospace.set(!runtime.monospace.get()) },
        isActive: () => runtime.monospace.get()
      },
      {
        caption: "Word Wrap",
        action: () => { runtime.wordWrap.set(!runtime.wordWrap.get()) },
        isActive: () => runtime.wordWrap.get()
      },
      SEP_ITEM,
      {
        caption: "Error Checking",
        action: () => { runtime.spellcheck.set(!runtime.spellcheck.get()) },
        isActive: () => runtime.spellcheck.get()
      }
    ]
  }
]