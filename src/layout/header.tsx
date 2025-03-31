import * as elements from "typed-html";

export default function Header() {
  return (
    <nav>
      <a href="/" onclick="navigate(event)">
        Home
      </a>
      <a href="/about-us" onclick="navigate(event)">
        About us
      </a>
    </nav>
  );
}
