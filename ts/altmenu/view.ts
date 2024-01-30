import { SEP_ITEM } from "$state/Desktop/ts/store";
import { ContextMenuItem } from "$types/app";
import { Runtime } from "../runtime";

export function ViewMenu(runtime: Runtime): ContextMenuItem {
  return {
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
}