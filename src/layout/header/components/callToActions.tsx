import * as elements from "typed-html";

export default function (isDesktop?: boolean) {
  const classCalculated =
    "glue-header__container" + isDesktop ? "glue-header__container--cta" : "";

  return (
    <div class={classCalculated}>
      <div class="glue-header__cta">
        <button class="glue-button glue-button--medium-emphasis">
          Secondary
        </button>
        <button class="glue-button glue-button--high-emphasis">Primary</button>
      </div>
    </div>
  );
}
