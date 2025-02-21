<script>
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';

  let reports = [];
  let user = null;
  let loading = true;

  async function checkAdminAccess() {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session) {
        console.warn("🔴 User is not logged in, redirecting...");
        return;
      }

      user = sessionData.session.user;
      console.log("👤 Logged in user:", user.email);

      // Fetch admin user info
      const { data, error: adminError } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", user.email);

      console.log("🔍 Admin check result:", data);

      if (adminError || !data || data.length === 0) {
        console.warn("🚨 User is not an admin, redirecting...");
        return;
      }

      console.log("✅ Admin verified!");
      fetchReports();
    } catch (err) {
      console.error("⚠️ Authentication error:", err);
    } finally {
      loading = false;
    }
  }

  async function fetchReports() {
    try {
      console.log("🔄 Fetching reports...");
      const { data, error } = await supabase.from("ruh_rapporter").select("*");

      if (error) {
        console.error("❌ Error fetching reports:", error);
        alert("Kunne ikke hente data: " + error.message);
      } else if (!data || data.length === 0) {
        console.warn("⚠️ Ingen rapporter funnet i databasen.");
      } else {
        console.log("✅ Data hentet fra Supabase:", data);
        reports = data;
      }
    } catch (err) {
      console.error("🚨 Kritisk feil ved henting av data:", err);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  }

  onMount(async () => {
    const { data: session } = await supabase.auth.getSession();
    if (session?.session) {
      await checkAdminAccess();
    } else {
      console.warn("No session found, redirecting to login...");
      window.location.href = '/admin/login';
    }
  });
</script>

<div class="min-h-screen flex flex-col items-center p-6">
  <button on:click={logout} class="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-md">
    Logg ut
  </button>

  <h1 class="text-3xl font-bold mb-6">Admin - Avviksrapporter</h1>

  {#if loading}
    <p>Laster...</p>
  {:else if reports.length > 0}
    <table class="w-full max-w-3xl border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">Sted</th>
          <th class="border p-2">Dato</th>
          <th class="border p-2">Beskrivelse</th>
          <th class="border p-2">Handling</th>
        </tr>
      </thead>
      <tbody>
        {#each reports as report (report.id)}
          <tr>
            <td class="border p-2">{report.sted}</td>
            <td class="border p-2">{report.dato}</td>
            <td class="border p-2">{report.beskrivelse}</td>
            <td class="border p-2">
              <a href={`/admin/reports/${report.id}`} class="text-blue-600 underline">Se detaljer</a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p class="text-center text-red-500">⚠️ Ingen rapporter funnet.</p>
  {/if}
</div>

