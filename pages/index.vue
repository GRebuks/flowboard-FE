<template>
    <main>
      <div class="content">
        <div>
          <h1>
            <span class="main-title">Welcome to <span class="flowboard">Flowboard</span></span>
            <br>
            <span class="sub-text">Your Ultimate Project Management Companion</span>
          </h1>
          <div class="landing-btns">
            <RouterLink to="/login" class="button button-fill">Login</RouterLink>
            <RouterLink to="/about" class="button button-outline">About us</RouterLink>
          </div>
        </div>
        <img src="@/assets/images/landing_page.svg" class="main-image" alt="illustrative image">
      </div>
    </main>
</template>

<style scoped lang="scss">
  @use '~/assets/scss/base';

  main {
    height: calc(100vh - 60px);
    display: flex;
    justify-content: space-between;
  }

  h1 {
    line-height: 40px;
  }

  .main-title {
    font-size: 70px;
    font-weight: 700;
  }

  .sub-text {
    font-size: 35px;
    font-weight: 300;
    padding-left: 5px;
  }

  .flowboard {
    background: linear-gradient(90deg, var(--color-primary) 50%, var(--color-accent) 103.66%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .content {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }

  .content > div {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  img {
    user-select: none;
  }

  .main-image {
    width: 600px;
  }

  .landing-btns {
    display: flex;
    gap: 10px;
  }
</style>