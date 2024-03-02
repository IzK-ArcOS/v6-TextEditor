<script lang="ts">
  import { formatBytes } from "$ts/bytes";
  import { getParentDirectory } from "$ts/server/fs/dir";
  import { getMimeIcon } from "$ts/server/fs/mime";
  import { pathToFriendlyPath } from "$ts/server/fs/util";
  import { Runtime } from "../ts/runtime";

  export let runtime: Runtime;

  const { statusBar, path, File, buffer } = runtime;
</script>

{#if $statusBar && $path && $File && $buffer}
  <div class="statusbar">
    <div class="segment file">
      <img src={getMimeIcon($File.name)} alt="" />
      <span>{$File.name}</span>
    </div>
    <div class="segment right">
      {formatBytes($buffer.length)}
    </div>
    <div class="segment">
      {$File.mime}
    </div>
    <div class="segment">
      In {pathToFriendlyPath(getParentDirectory($File.path))}
    </div>
  </div>
{/if}
