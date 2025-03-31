import * as elements from "typed-html";
import skipToContent from "./components/skipToContent";
import lockup from "./components/lockup";
import callToActions from "./components/callToActions";
import linkbar from "./components/linkbar";
export default function Header() {
  // Only include HeaderOptions if you are customizing the header
  // by passing configuration options through the constructor

  const headerEl = document.querySelector<HTMLElement>(".glue-header");


  return (
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
  );
}
