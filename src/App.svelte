<script lang="ts">
    enum Page {
        OBJ_PROPS = "Object properties",
        SOMETHING = "something in the future maybe",
    }

    import ObjProps from "./props/ObjProps.svelte";
    import "./props/props";

    let currentPage = Page.OBJ_PROPS;
</script>

<div
    class="w-screen h-screen bg-gray-900 p-2 flex flex-col text-gray-100 font-saira gap-2"
>
    <div
        class="h-16 w-full bg-gray-800 border-2 border-gray-500 rounded-lg flex items-center pl-2 shadow-lg"
    >
        <span class="font-bold text-3xl mr-4">GD Info Explorer</span>
        <div>
            {#each Object.values(Page) as page}
                <button
                    class={`${
                        currentPage == page ? "bg-gray-600" : "bg-gray-700"
                    } p-2 mx-2 rounded-md font-medium`}
                    on:click={() => {
                        currentPage = page;
                    }}>{page}</button
                >
            {/each}
        </div>
    </div>
    <div
        class="flex flex-col bg-gray-800 h-full p-4 rounded-lg text-lg font-medium overflow-hidden"
    >
        {#if currentPage == Page.OBJ_PROPS}
            <ObjProps></ObjProps>
        {:else if currentPage == Page.SOMETHING}
            idk
        {/if}
    </div>
</div>
