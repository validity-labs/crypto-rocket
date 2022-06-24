import { StaticImageData } from '@/types/app';

const contentWithHtml = (field: string = 'Unknown') =>
  `<p>${field} cupidatat deserunt eiusmod qui <strong>dolore</strong> dolor <a href="https://example.com">cillum</a> dolore id eiusmod ex culpa. Fugiat nostrud labore deserunt ea aliquip incididunt proident nulla elit excepteur laborum non aliqua. Exercitation ad sint aliqua proident ut in magna. In nostrud officia consequat dolore adipisicing amet. Consectetur aliqua Lorem anim voluptate. Ut qui enim aute dolor adipisicing veniam ut occaecat laborum commodo consectetur eiusmod esse.</p><p>Cupidatat deserunt eiusmod qui dolore dolor cillum dolore id eiusmod ex culpa. Fugiat nostrud labore deserunt ea aliquip incididunt proident nulla elit excepteur laborum non aliqua. Exercitation ad sint aliqua proident ut in magna. In nostrud officia consequat dolore adipisicing amet. Consectetur aliqua Lorem anim voluptate.&nbsp;</p><ul><li>Ut qui enim aute dolor adipisicing veniam.</li><li>Ut occaecat laborum commodo consectetur eiusmod esse.</li></ul>`;

export default contentWithHtml;

export const staticImageData: StaticImageData = {
  src: '/images/static.jpg',
  width: 100,
  height: 100,
};
