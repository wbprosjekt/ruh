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
        console.warn('User is not logged in, redirecting...');
        return;
      }

      user = sessionData.session.user;

      const { data, error: adminError } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', user.email);

      if (adminError || !data || data.length === 0) {
        console.warn('User is not an admin, redirecting...');
        return;
      }

      fetchReports();
    } catch (err) {
      console.error('Authentication error:', err);
    } finally {
      loading = false;
    }
  }

  async function fetchReports() {
    try {
      const { data, error } = await supabase.from('ruh_rapporter').select('*').order('dato', { ascending: false });
      if (error) {
        console.error('Error fetching reports:', error);
      } else {
        reports = data;
      }
    } catch (err) {
      console.error('Fetching reports error:', err);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  }

  onMount(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        checkAdminAccess();
      } else if (event === 'SIGNED_OUT') {
        console.warn('User signed out, redirecting...');
        window.location.href = '/admin/login';
      }
    });
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
        {#each reports as report}
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
    <p class="text-center">Ingen rapporter funnet.</p>
  {/if}
</div>

