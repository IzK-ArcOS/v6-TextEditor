<script lang="ts">
  import { onMount } from "svelte";
  import "./css/main.css";
  import { Runtime } from "./ts/runtime";

  export let runtime: Runtime;

  const { wordWrap, monospace, spellcheck, buffer, isClient } = runtime;

  let input: HTMLTextAreaElement;

  onMount(() => {
    runtime.setTextarea(input);
  });
</script>

<textarea
  bind:value={$buffer}
  bind:this={input}
  class:nowrap={!$wordWrap}
  class:monospace={$monospace}
  spellcheck={$spellcheck}
  readonly={$isClient}
  wrap="soft"
/>
