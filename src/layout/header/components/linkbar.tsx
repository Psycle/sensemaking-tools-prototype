import * as elements from "typed-html";

export default function () {
  const links = [
    {
      label: "Homepage",
      href: ",",
    },
    {
      label: "About Us",
      href: "/about-us",
    },
  ];
  return (
    <div class="glue-header__container glue-header__container--linkbar">
      <nav class="glue-header__link-bar">
        <ul class="glue-header__list">
          {links.map((i) => (
            // glue-header__item--active
            <li class="glue-header__item">
              <a
                class="glue-header__link"
                href={i.href}
                onclick="navigate(event)"
                aria-current="page"
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
