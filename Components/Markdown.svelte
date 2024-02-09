<script lang="ts">
  import MarkdownRenderer from "$lib/Components/MarkdownRenderer.svelte";
  import { Pane } from "svelte-splitpanes";
  import { Runtime } from "../ts/runtime";
  import { sleep } from "$ts/util";

  export let runtime: Runtime;

  const { buffer } = runtime;

  let timeout;
  let content = "";

  buffer.subscribe(async (v) => {
    clearTimeout(timeout);

    timeout = setTimeout(async () => {
      content = "";
      await sleep(0);
      content = v;
    }, 500);
  });
</script>

<Pane minSize={25}>
  <MarkdownRenderer {content} />
</Pane>
