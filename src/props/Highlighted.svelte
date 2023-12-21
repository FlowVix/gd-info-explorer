<script lang="ts">
    export let text: string;
    export let search: string;

    $: lowerText = text.toLowerCase();

    $: split = search == "" ? [lowerText] : lowerText.split(search);

    let parts: [boolean, string][] = [];

    $: {
        let out: [boolean, string][] = [];
        let idx = 0;
        for (let i of split) {
            out.push([false, text.slice(idx, idx + i.length)]);
            idx += i.length;
            out.push([true, text.slice(idx, idx + search.length)]);
            idx += search.length;
        }
        out.pop();
        parts = out;
    }
</script>

<!-- {JSON.stringify(split)} -->
{#each parts as [underline, s]}
    <span class={`${underline ? "underline font-extrabold" : ""}`}>{s}</span>
{/each}
