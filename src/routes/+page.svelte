<script>
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabase";

  let reports = [];
  let loading = true;
  let errorMessage = "";

  // Fetch reports from Supabase
  async function fetchReports() {
    try {
      const { data, error } = await supabase
        .from("ruh_rapporter")
        .select("*")
        .order("dato", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      reports = data || [];
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
      errorMessage = "Kunne ikke hente rapporter.";
    } finally {
      loading = false;
    }
  }

  onMount(fetchReports);
</script>

<!-- UI Layout -->
<main class="container mx-auto px-4 py-8">
  <h1 class="text-center text-3xl font-bold text-blue-600 mb-6">
    Registrerte RUH-rapporter
  </h1>

  {#if loading}
    <p class="text-center text-gray-500">Laster inn rapporter...</p>
  {:else if errorMessage}
    <p class="text-center text-red-500">{errorMessage}</p>
  {:else if reports.length === 0}
    <p class="text-center text-gray-500">Ingen rapporter funnet.</p>
  {:else}
    <div class="space-y-6">
      {#each reports as report}
        <div class="border p-4 rounded-lg shadow-md bg-white">
          <h2 class="text-lg font-semibold text-gray-800">
            📍 {report.sted}
          </h2>
          <p class="text-gray-600">📅 {report.dato} ⏰ {report.klokkeslett}</p>
          <p class="mt-2 text-gray-700">📝 {report.beskrivelse}</p>

          {#if report.bilde_url}
            <img
              src={report.bilde_url}
              alt="Bilde av rapportert hendelse"
              class="mt-4 max-w-full rounded-lg"
            />
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
  main {
    max-width: 800px;
  }
</style>
