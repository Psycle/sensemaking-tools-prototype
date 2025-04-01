import * as elements from "typed-html";
import "./styles.scss";

export default function Home() {
  setTimeout(() => {
    const button = document.querySelector("#button-homepage");
    if (button) {
      button.addEventListener("click", () => {
        window.open("https://www.google.com", "_blank");
      });
    }
  }, 200);

  return (
    <section class="glue-spacer-6-top" id="content">
      <div class="demo-homepage__content">
        <h1 class="glue-headline glue-headline--headline-1">
         Lorem, ipsum dolor.
        </h1>
        <h1 class="glue-headline glue-headline--headline-4 glue-spacer-4-top glue-spacer-2-bottom">
          This is a subheadline. Isn't it glorious?
        </h1>
        <p class="glue-body--large">
          And now let’s get in to some placeholder copy so you can scroll down
          the page and see how the header interacts with page content. Where is
          it from? What does it MEAN? So mysterious. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Nunc finibus placerat viverra. Quisque
          nec congue mi. Curabitur porttitor lorem metus, vel condimentum tortor
          ultricies ac. Pellentesque in ex augue. Proin in sapien eget mauris
          ultricies molestie. Pellentesque ac tortor at nibh euismod tristique
          ac non augue. In euismod pellentesque augue, a varius leo. Morbi nisi
          diam, sollicitudin at quam suscipit, maximus ultricies enim. Mauris et
          lectus consectetur, maximus dui a, sagittis elit. Duis volutpat felis
          a dui hendrerit lobortis. Integer et semper ligula.
        </p>
        <p class="glue-body--large">
          In malesuada blandit lectus quis pretium. Suspendisse semper neque vel
          risus aliquam, eget molestie nisi porttitor. Sed tincidunt tellus at
          erat blandit, in vulputate ante tempor. Nulla dapibus tempus sodales.
          Vestibulum pharetra rutrum magna, quis efficitur quam luctus cursus.
          Nam nec porttitor metus. Fusce eleifend, diam non egestas luctus, erat
          lectus consectetur nunc, et convallis arcu nisl a nibh. Sed malesuada
          justo vel velit mattis, non tempus arcu tincidunt. Vivamus aliquet a
          dui eu efficitur.
        </p>
        <p class="glue-body--large demo-hide-in-percy">
          Donec porta, nulla nec luctus condimentum, odio dui tempor arcu, non
          tincidunt eros ligula vitae justo. Aenean rhoncus tincidunt diam, id
          imperdiet purus pellentesque eget. Sed eleifend efficitur justo vel
          lobortis. Proin posuere, massa sed viverra luctus, est ligula ultrices
          dui, vel sollicitudin urna arcu sed elit. In a facilisis massa. Proin
          euismod placerat metus, non viverra felis bibendum nec. Aliquam id
          ante augue. Vestibulum sollicitudin, dui a tincidunt dapibus, ante mi
          malesuada ipsum, finibus facilisis ex ligula sagittis ligula.
          Pellentesque quis sapien nisl. Nullam metus odio, tempus scelerisque
          pulvinar nec, vestibulum in odio. Praesent justo tellus, condimentum
          sed molestie sed, hendrerit a elit. Nulla ac nibh sed odio ultricies
          luctus. Maecenas tempus, eros sit amet blandit viverra, nunc urna
          euismod ligula, non maximus mi magna non nisi. Sed dignissim arcu ac
          tortor aliquam, a fringilla massa maximus. Mauris maximus luctus
          justo, id laoreet ex venenatis vitae.
        </p>
        <p class="glue-body--large demo-hide-in-percy">
          In malesuada blandit lectus quis pretium. Suspendisse semper neque vel
          risus aliquam, eget molestie nisi porttitor. Sed tincidunt tellus at
          erat blandit, in vulputate ante tempor. Nulla dapibus tempus sodales.
          Vestibulum pharetra rutrum magna, quis efficitur quam luctus cursus.
          Nam nec porttitor metus. Fusce eleifend, diam non egestas luctus, erat
          lectus consectetur nunc, et convallis arcu nisl a nibh. Sed malesuada
          justo vel velit mattis, non tempus arcu tincidunt. Vivamus aliquet a
          dui eu efficitur.
        </p>
        <p class="glue-body--large demo-hide-in-percy">
          Donec porta, nulla nec luctus condimentum, odio dui tempor arcu, non
          tincidunt eros ligula vitae justo. Aenean rhoncus tincidunt diam, id
          imperdiet purus pellentesque eget. Sed eleifend efficitur justo vel
          lobortis. Proin posuere, massa sed viverra luctus, est ligula ultrices
          dui, vel sollicitudin urna arcu sed elit. In a facilisis massa. Proin
          euismod placerat metus, non viverra felis bibendum nec. Aliquam id
          ante augue. Vestibulum sollicitudin, dui a tincidunt dapibus, ante mi
          malesuada ipsum, finibus facilisis ex ligula sagittis ligula.
          Pellentesque quis sapien nisl. Nullam metus odio, tempus scelerisque
          pulvinar nec, vestibulum in odio. Praesent justo tellus, condimentum
          sed molestie sed, hendrerit a elit. Nulla ac nibh sed odio ultricies
          luctus. Maecenas tempus, eros sit amet blandit viverra, nunc urna
          euismod ligula, non maximus mi magna non nisi. Sed dignissim arcu ac
          tortor aliquam, a fringilla massa maximus. Mauris maximus luctus
          justo, id laoreet ex venenatis vitae.
        </p>
        <p class="glue-body--large demo-hide-in-percy">
          In malesuada blandit lectus quis pretium. Suspendisse semper neque vel
          risus aliquam, eget molestie nisi porttitor. Sed tincidunt tellus at
          erat blandit, in vulputate ante tempor. Nulla dapibus tempus sodales.
          Vestibulum pharetra rutrum magna, quis efficitur quam luctus cursus.
          Nam nec porttitor metus. Fusce eleifend, diam non egestas luctus, erat
          lectus consectetur nunc, et convallis arcu nisl a nibh. Sed malesuada
          justo vel velit mattis, non tempus arcu tincidunt. Vivamus aliquet a
          dui eu efficitur.
        </p>
        <button
          id="button-homepage"
          class="glue-button glue-button--medium-emphasis"
        >
          Demo Link
        </button>
      </div>
    </section>
  );
}
