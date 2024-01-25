import { getAppById, spawnApp, spawnOverlay } from "$ts/apps";
import { AppRuntime } from "$ts/apps/runtime";
import { PersonalizationIcon, SaveIcon } from "$ts/images/general";
import { Process } from "$ts/process";
import { textToBlob } from "$ts/server/fs/convert";
import { readFile, writeFile } from "$ts/server/fs/file";
import { GetSaveFilePath } from "$ts/stores/apps/file";
import { Store } from "$ts/writable";
import type { App, AppMutator } from "$types/app";
import { ArcFile } from "$types/fs";
import { TextEditorAccelerators } from "./accelerators";
import { TextEditorAltMenu } from "./altmenu";

export class Runtime extends AppRuntime {
  public File = Store<ArcFile>();
  public buffer = Store<string>();
  public path = Store<string>();
  public wordWrap = Store<boolean>(true);
  public monospace = Store<boolean>(true);
  public spellcheck = Store<boolean>(false);

  constructor(app: App, mutator: AppMutator, process: Process) {
    super(app, mutator, process);

    this.openedFile.subscribe(async (v) => {
      if (!v) return;

      await this.readFile(v);
    })

    if (process.args.length && typeof process.args[0] === "string") {
      this.handleOpenFile(process.args[0])
    }

    this.loadAltMenu(...TextEditorAltMenu(this));
    this.process.accelerator.store.push(...TextEditorAccelerators(this))
  }

  async readFile(v: string) {
    this.path.set(v);

    const file = await readFile(v);

    if (!file) return;

    this.buffer.set(await file.data.text())

    this.File.set(file);

    this.setWindowTitle(file.name, true)
  }

  public async save(content: string) {
    if (!content) return;

    const path = this.path.get();
    const file = this.File.get();
    const written = await writeFile(path, textToBlob(content, file ? file.mime : null));

    return !!written;
  }

  public async saveAs(content: string) {
    if (!content) return;

    const path = await GetSaveFilePath(this.pid, {
      title: "Select location to save file",
      icon: SaveIcon,
    });

    if (!path) return;

    this.path.set(path);
    this.buffer.set(content);

    await this.save(content);

    this.openedFile.set(path)
  }

  public openFile() {
    spawnOverlay(getAppById("LoadSaveDialog"), this.pid, [
      {
        title: "Select any file to open",
        icon: PersonalizationIcon,
      },
    ]);
  }

  public openFileLocation() {
    const path = this.path.get();

    if (!path) return

    const split = path.split("/");
    const filename = split[split.length - 1];

    spawnApp("FileManager", 0, [path.replace(`/${filename}`, ""), path])
  }
}