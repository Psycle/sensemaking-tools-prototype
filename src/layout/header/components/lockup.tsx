import * as elements from "typed-html";

export default function (includeHamburger?: boolean) {
  return (
    <div class="glue-header__container">
      <div class="glue-header__lock-up">
        {/* <!-- Hamburger button component --> */}
        {includeHamburger ? (
          <div class="glue-header__hamburger">
            <button
              class="glue-header__drawer-toggle-btn"
              aria-label="Open the navigation drawer"
            >
              <svg
                class="glue-icon glue-icon--24px"
                role="presentation"
                aria-hidden="true"
              >
                <use href="./assets/img/glue-icons.svg#menu"></use>
              </svg>
            </button>
          </div> 
        ): ''}
        <div class="glue-header__logo">
          <a class="glue-header__logo-link" href="#" title="Google">
            {/* <!-- Logo component --> */}
            <div class="glue-header__logo-container">
              <svg
                class="glue-header__logo-svg"
                role="presentation"
                aria-hidden="true"
              >
                <use href="./assets/img/glue-icons.svg#google-color-logo"></use>
              </svg>
            </div>
            <span class="glue-header__logo--product">Product</span>
          </a>
        </div>
      </div>
    </div>
  );
}
