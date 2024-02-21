import { SEP_ITEM } from "$state/Desktop/ts/store";
import { MarkdownMimeIcon } from "$ts/images/mime";
import { ContextMenuItem } from "$types/app";
import { Runtime } from "../runtime";

export function ViewMenu(runtime: Runtime): ContextMenuItem {
  return {
    caption: "View",
    subItems: [
      {
        icon: "abc",
        caption: "Fixed-width font",
        action: () => {
          runtime.monospace.set(!runtime.monospace.get());
        },
        isActive: () => runtime.monospace.get(),
      },
      {
        icon: "wrap_text",
        caption: "Word Wrap",
        action: () => {
          runtime.wordWrap.set(!runtime.wordWrap.get());
        },
        isActive: () => runtime.wordWrap.get(),
      },
      SEP_ITEM,
      {
        icon: "spellcheck",
        caption: "Error Checking",
        action: () => {
          runtime.spellcheck.set(!runtime.spellcheck.get());
        },
        isActive: () => runtime.spellcheck.get(),
      },
      SEP_ITEM,
      {
        caption: "Show Markdown preview",
        action: () => {
          runtime.markdownPreview.set(!runtime.markdownPreview.get());
        },
        isActive: () => runtime.markdownPreview.get(),
        image: MarkdownMimeIcon,
        disabled: () => {
          const path = runtime.path.get();

          return path ? !path.endsWith(".md") : true;
        },
      },
    ],
  };
}
