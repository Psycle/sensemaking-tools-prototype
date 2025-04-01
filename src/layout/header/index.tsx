import * as elements from "typed-html";

// Components
import skipToContent from "./components/skipToContent";
import lockup from "./components/lockup";
import callToActions from "./components/callToActions";
import linkbar from "./components/linkbar";

// UI Components
import { Header } from "@google/glue";

export default function () {
  setTimeout(() => {
    const headerEl = document.querySelector<HTMLElement>(".glue-header");
    if (headerEl) new Header(headerEl);
  }, 200);

  return (
    <header>
      <header class="glue-header glue-header--single">
        {/* <!-- skip to content component --> */}
        {skipToContent()}
        <div class="glue-header__bar glue-header__bar--mobile">
          <div class="glue-header__tier">
            {/* <!-- mobile lockup component --> */}
            {lockup(true)}
            {/* <!-- mobile CTA component --> */}
            {callToActions(false)}
          </div>
        </div>
        <div class="glue-header__bar glue-header__bar--desktop glue-header__drawer">
          <div class="glue-header__tier">
            {/* <!-- desktop lockup component --> */}
            {lockup(false)}
            {/* <!-- linkbar component --> */}
            {linkbar()}
            {/* <!-- desktop CTA component --> */}
            {callToActions(true)}
          </div>
        </div>
        <div
          class="glue-header__drawer-backdrop"
          role="button"
          aria-label="Close menu"
        ></div>
      </header>
    </header>
  );
}
