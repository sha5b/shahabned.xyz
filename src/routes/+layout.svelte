<script>
    // Layout level scripting can go here
  </script>
  
  <nav>
    <a href="/">Home</a>
    <a href="/category">Categories</a>
  </nav>
  
  <slot />
  
  <style>
    nav {
      padding: 1rem;
      background-color: #f8f8f8;
    }
    nav a {
      margin-right: 1rem;
      text-decoration: none;
      color: #333;
    }
    nav a:hover {
      text-decoration: underline;
    }
  </style>
  