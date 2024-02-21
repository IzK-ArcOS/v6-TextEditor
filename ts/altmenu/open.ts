import { AppsIcon } from "$ts/images/general";
import { MarkdownMimeIcon } from "$ts/images/mime";
import { getPartialFile } from "$ts/server/fs/file";
import { OpenWith } from "$ts/server/fs/file/handler";
import { openFileWithApp } from "$ts/server/fs/open";
import { ContextMenuItem } from "$types/app";
import { Runtime } from "../runtime";

export function OpenMenu(runtime: Runtime): ContextMenuItem {
  return {
    caption: "Open",
    subItems: [
      {
        caption: `Open file in...`,
        disabled: () => !runtime.path.get() || runtime.isClient.get(),
        image: AppsIcon,
        async action() {
          const path = runtime.path.get();
          const partial = await getPartialFile(path);

          OpenWith(partial, runtime.pid, true);
        },
      },
      {
        caption: "Open as Markdown",
        disabled: () =>
          !runtime.path.get() || !runtime.path.get().endsWith(".md") || runtime.isClient.get(),
        image: MarkdownMimeIcon,
        async action() {
          const path = runtime.path.get();
          const partial = await getPartialFile(path);

          await openFileWithApp("MarkDownViewer", partial);
        },
      },
    ],
  };
}
