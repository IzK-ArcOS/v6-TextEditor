<script lang="ts">
  import "./css/main.css";
  import { Runtime } from "./ts/runtime";

  export let runtime: Runtime;

  const { wordWrap, monospace, spellcheck, buffer } = runtime;
</script>

<textarea
  bind:value={$buffer}
  class:nowrap={!$wordWrap}
  class:monospace={$monospace}
  spellcheck={$spellcheck}
  wrap="soft"
/>
