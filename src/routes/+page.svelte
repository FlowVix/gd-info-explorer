<script lang="ts">
    import gh from "$lib/assets/github-mark-white.svg";
</script>

<svelte:head>
    <title>GD Info Explorer</title>
</svelte:head>

<div class="w-full h-full flex flex-col justify-center items-center gap-4">
    <span class="text-3xl"
        >Miscellaneous info about Geometry Dash internals</span
    >
    <br /><br />
    <span class="text-2xl"
        >This data is incomplete, help extend it by contributing!</span
    >
    <div class="flex items-center gap-4">
        <img src={gh} alt="GitHub Logo" width="40" />
        <a
            class="text-xl underline"
            href="https://github.com/FlowVix/gd-info-explorer"
            >https://github.com/FlowVix/gd-info-explorer</a
        >
    </div>
</div>
