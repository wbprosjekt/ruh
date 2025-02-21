<script>
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabase";

  let reports = [];
  let loading = true;
  let errorMessage = "";

  // Fetch reports from Supabase
  async function fetchReports() {
    try {
      console.log("🔄 Fetching reports...");

      const { data, error } = await supabase
        .from("ruh_rapporter")
        .select("*")
        .order("dato", { ascending: false });

      if (error) {
        console.error("❌ Error fetching reports:", error.message);
        errorMessage = `Feil ved henting av rapporter: ${error.message}`;
        return;
      }

      if (!data || data.length === 0) {
        console.warn("⚠️ No reports found in Supabase.");
        errorMessage = "Ingen rapporter funnet.";
      } else {
        reports = data;
      }
    } catch (error) {
      console.error("🚨 Unexpected error:", error);
      errorMessage = "Kunne ikke hente rapporter. Prøv igjen senere.";
    } finally {
      loading = false;
    }
  }

  onMount(fetchReports);
</script>

<!-- UI Layout -->
<main class="container mx-auto px-4 py-8">
  <!-- Company Logo -->
  <div class="flex justify-center mb-6">
    <img src="/logo.png" alt="WB Prosjekt AS Logo" class="w-32 h-auto" />
  </div>

  <!-- Title -->
  <h1 class="text-center text-3xl font-bold text-blue-600 mb-6">
    Registrerte RUH-rapporter
  </h1>

  <!-- Loading Indicator -->
  {#if loading}
    <p class="text-center text-gray-500">Laster inn rapporter...</p>
  
  <!-- Error Message -->
  {:else if errorMessage}
    <p class="text-center text-red-500">{errorMessage}</p>
  
  <!-- No Reports Found -->
  {:else if reports.length === 0}
    <p class="text-center text-gray-500">Ingen rapporter funnet.</p>
  
  <!-- Display Reports -->
  {:else}
    <div class="space-y-6">
      {#each reports as report}
        <div class="border p-4 rounded-lg shadow-md bg-white">
          <h2 class="text-lg font-semibold text-gray-800">
            📍 {report.sted}
          </h2>
          <p class="text-gray-600">📅 {report.dato} ⏰ {report.klokkeslett}</p>
          <p class="mt-2 text-gray-700">📝 {report.beskrivelse}</p>
          
          {#if report.resultat}
            <p class="mt-1 text-gray-700">🎯 Resultat: {report.resultat}</p>
          {/if}

          {#if report.aarsak}
            <p class="mt-1 text-gray-700">⚠️ Årsak: {report.aarsak}</p>
          {/if}

          {#if report.tiltak}
            <p class="mt-1 text-gray-700">✅ Tiltak: {report.tiltak}</p>
          {/if}

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

  .container {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  h1 {
    color: #004aad;
  }
</style>
