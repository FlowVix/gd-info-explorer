<script lang="ts">
    import "../app.css";
    import favicon from "$lib/assets/icon.png";

    let { children } = $props();

    const headerLinks = [
        ["Object Props", "/gd-info-explorer/props"],
        ["Particle Props", "/gd-info-explorer/particles"],
    ];
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="w-screen h-screen p-2 flex flex-col gap-2">
    <div
        class="bg-[#1E1E2D] rounded-lg w-full h-16 flex items-center pl-4 gap-4"
    >
        <a
            class="text-4xl font-bold mr-4 hover:text-[#7FFFFF]"
            href="/gd-info-explorer/">GD Info Explorer</a
        >
        {#each headerLinks as link}
            <a
                href={link[1]}
                class="bg-[#3C3C5A] hover:bg-[#505078] px-2 py-2 rounded-md"
                >{link[0]}</a
            >
        {/each}
    </div>
    <div class="bg-[#14141E] rounded-lg grow p-4">
        {@render children?.()}
    </div>
</div>
