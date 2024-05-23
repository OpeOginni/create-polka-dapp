<script lang='ts'>
import Wallet from "./Wallet.svelte";
  import { getWallets } from "../contexts/wallets.context";

const wallets = getWallets()
</script>

<div class="wallets">
    {#if !wallets}
        <div>No wallets available</div>
    {:else}
        {#each wallets as wallet}
            <Wallet wallet={wallet} />
        {/each}
    {/if}
</div>

<style>
  /* Add your styles here */
</style>