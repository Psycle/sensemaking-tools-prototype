import * as elements from "typed-html";

export default function () {
  return (
    <footer class="glue-footer glue-spacer-3-top">
      <h2 class="glue-visually-hidden">Footer links</h2>
      <section class="glue-footer__global">
        <div class="glue-footer__logo">
          <a href="https://www.google.com" title="Google">
            <svg
              role="presentation"
              aria-hidden="true"
              class="glue-footer__logo-img"
            >
              <use href="./assets/img/glue-icons.svg#google-solid-logo"></use>
            </svg>
          </a>
        </div>

        <ul class="glue-footer__global-links glue-no-bullet" role="list">
          <li class="glue-footer__global-links-list-item">
            <a class="glue-footer__link" href="https://about.google/">
              About Google
            </a>
          </li>

          <li class="glue-footer__global-links-list-item">
            <a class="glue-footer__link" href="https://about.google/products/">
              Google products
            </a>
          </li>

          <li class="glue-footer__global-links-list-item">
            <a
              class="glue-footer__link"
              href="https://policies.google.com/privacy"
            >
              Privacy
            </a>
          </li>

          <li class="glue-footer__global-links-list-item">
            <a
              class="glue-footer__link"
              href="https://policies.google.com/terms"
            >
              Terms
            </a>
          </li>
        </ul>

        <ul
          class="glue-footer__global-links glue-footer__global-links--extra glue-no-bullet"
          role="list"
        >
          <li
            class="glue-footer__global-links-list-item
          glue-footer__global-links-list-item--extra"
          >
            <a
              class="glue-footer__link"
              href="https://support.google.com/?hl=en"
            >
              <svg
                role="presentation"
                aria-hidden="true"
                class="glue-icon
              glue-icon--24px glue-icon--footer-help"
              >
                <use href="./assets/img/glue-icons.svg#help"></use>
              </svg>
              Help
            </a>
          </li>
          <li
            class="glue-footer__global-links-list-item
          glue-footer__global-links-list-item--extra"
          >
            {/* <!-- This language selector is a placeholder --> */}
            <select
              aria-label="Change language"
              name="lang-selector"
              id="lang-selector"
              class="glue-form__dropdown glue-footer__lang-dropdown"
            >
              <option value="https://www.google.com/intl/en/mysite">
                English
              </option>
              <option value="https://www.google.com/intl/pt-BR/mysite">
                Português – Brasil
              </option>
              <option value="https://www.google.com/intl/ja/mysite">
                日本語
              </option>
            </select>
          </li>
        </ul>
      </section>
    </footer>
  );
}
