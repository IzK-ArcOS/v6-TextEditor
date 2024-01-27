import { getAppById, spawnApp, spawnOverlay } from "$ts/apps";
import { AppRuntime } from "$ts/apps/runtime";
import { TextEditorIcon } from "$ts/images/apps";
import { SaveIcon } from "$ts/images/general";
import { Process } from "$ts/process";
import { textToBlob } from "$ts/server/fs/convert";
import { getParentDirectory } from "$ts/server/fs/dir";
import { readFile, writeFile } from "$ts/server/fs/file";
import { getMimeIcon } from "$ts/server/fs/mime";
import { FileProgress } from "$ts/server/fs/progress";
import { pathToFriendlyName, pathToFriendlyPath } from "$ts/server/fs/util";
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

    const { setDone, setErrors } = await this.LoadProgress(v);

    const file = await readFile(v);

    if (!file) {
      setErrors(1);
      setDone(1);
      return
    }

    this.buffer.set(await file.data.text())
    this.File.set(file);
    this.setWindowTitle(file.name);
    this.setWindowIcon(getMimeIcon(file.name))

    setDone(1);
  }

  public async save(content: string) {
    if (!content) return;

    const path = this.path.get();
    const file = this.File.get();

    const { setDone } = await this.SaveProgress(path)

    const written = await writeFile(path, textToBlob(content, file ? file.mime : null));

    setDone(1);

    return !!written;
  }

  public async saveAs(content: string) {
    if (!content) return;

    const path = await GetSaveFilePath(this.pid, {
      title: "Select location to save file",
      icon: SaveIcon,
      startDir: getParentDirectory(this.path.get() || "./")
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
        icon: TextEditorIcon,
        startDir: getParentDirectory(this.path.get() || "./")
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

  public async LoadProgress(v: string = this.path.get()) {
    return await FileProgress({
      caption: "Reading File",
      subtitle: `Home/${pathToFriendlyPath(v)}`,
      icon: TextEditorIcon,
      max: 1,
      done: 0,
      type: "quantity",
      waiting: false,
      working: true,
      errors: 0
    }, this.pid)
  }

  public async SaveProgress(v: string = this.path.get()) {
    const filename = pathToFriendlyName(v);

    return await FileProgress({
      caption: `Saving ${filename}`,
      subtitle: `Home/${pathToFriendlyPath(v)}`,
      icon: SaveIcon,
      max: 1,
      done: 0,
      type: "quantity",
      waiting: false,
      working: true,
      errors: 0
    }, this.pid)
  }
}