<template>
    <header>
        <nuxt-link to="/dashboard" class="title">PMS</nuxt-link>
        <ul class="navbar">
            <li>
                <p class="navbar-icon">+</p>
                <nuxt-link to="/dashboard/projects">Projects</nuxt-link>
            </li>
            <li>
                <p class="navbar-icon">+</p>
                <nuxt-link to="/dashboard/project1">Project 1</nuxt-link>
            </li>
            <li>
                <p class="navbar-icon">+</p>
                <nuxt-link to="/dashboard/project2">Project 2</nuxt-link>
            </li>
            <li>
                <p class="navbar-icon">+</p>
                <nuxt-link to="/">Home</nuxt-link>
            </li>
        </ul>
    </header>
</template>

<style scoped lang="scss">
@use '~/assets/scss/base';

header {
  display: flex;
  flex-direction: column;
  width: 15%;
  height: 100vh;
  text-align: center;
  background-color: var(--color-accent-black);
}

.title {
  width: 100%;
  height: 10vh;
  line-height: 10vh;
  font-size: 30px;
  font-weight: 600;
  text-decoration: none;
  background-color: var(--color-accent-black-dark);
  color: var(--color-accent-white);
}

.navbar {
  display: flex;
  flex-direction: column;
  width: 100%;
  list-style: none;
  line-height: 4vh;
  font-size: 18px;
  height: 4vh;
  background-color: var(--color-accent-black);
  padding: 0;

  li {
    width: 100%;
    display: flex;
    flex-direction: row;
    background-color: var(--color-accent-black);
    &:hover {
      background-color: var(--color-accent-black-light);
    }

    a {
      color: var(--color-accent-white);
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }

    .navbar-icon {
        color: var(--color-accent-white);
        width: 25%;
    }
  }
}
</style>