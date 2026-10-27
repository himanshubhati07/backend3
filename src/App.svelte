<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import { Toaster } from 'svelte-sonner';
  import Layout from './components/Layout.svelte';
  import ThemeProvider from './components/ThemeProvider.svelte';
  import ThemeScreen from './pages/ThemeScreen.svelte';

  // Pages
  import Home from './pages/Home.svelte';
  import Projects from './pages/Projects.svelte';
  import Connections from './pages/Connections.svelte';
  import Team from './pages/Team.svelte';
  import Learning from './pages/Learning.svelte';
  import Agent from './pages/Agent.svelte';
  import Settings from './pages/Settings.svelte';
  import NotFound from './pages/NotFound.svelte';
</script>

<ThemeProvider>
<Router>
  <!-- Main dashboard routes with Layout -->
  <Route path="/">
    <ThemeScreen />
  </Route>

  <Route path="/home">
    <Layout>
      <Home />
    </Layout>
  </Route>

  <Route path="/projects">
    <Layout>
      <Projects />
    </Layout>
  </Route>

  <Route path="/connections">
    <Layout>
      <Connections />
    </Layout>
  </Route>

  <Route path="/team">
    <Layout>
      <Team />
    </Layout>
  </Route>

  <Route path="/learning">
    <Layout>
      <Learning />
    </Layout>
  </Route>

  <Route path="/agent/:id" let:params>
    <Layout>
      <Agent id={params.id} />
    </Layout>
  </Route>

  <Route path="/settings">
    <Layout>
      <Settings />
    </Layout>
  </Route>

  <!-- Catch-all 404 -->
  <Route path="*">
    <NotFound />
  </Route>
</Router>

<Toaster />
</ThemeProvider>
