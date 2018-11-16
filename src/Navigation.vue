<template>
  <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #eeeeee; position: fixed; width: 100%; zIndex: 5">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav">
        <li class="nav-item active">
          <router-link class="nav-link" to="/">Главная</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/training">Тренировка</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/about">О проекте</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
    
}
</script>
