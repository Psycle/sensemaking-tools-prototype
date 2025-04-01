import * as elements from "typed-html";

export default function (content: string): string {
    return <section class="glue-page">{content}</section>;
}
