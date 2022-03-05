// import express from 'express'
// import next from 'next'

// import { aboutStats as aboutStatsRecord, aboutTeam } from '../../__fixtures__/about'
// import blogArticleRecords from '../../__fixtures__/blog'
// import contentWithHtml, { featureRecords, partnerRecords, /* sliderRecord, */ techRecords } from '../../__fixtures__/common'
// import careerJobRecords, { careerPerks } from '../../__fixtures__/jobs'
// import trainingCourseCategoryRecords from '../../__fixtures__/training-categories'
// import trainingCourseRecords, { courseReviews as trainingCourseReviews } from '../../__fixtures__/trainings';
// import { PageKey, pageToQueryMap, QueryKey } from '../../src/libs/api'

// // import nextConf from '../../next.config'
// // This triggers issue with getConfig as next app should be initialized first
// // import { ITEMS_PER_PAGE } from '../../src/libs/constants'
// const ITEMS_PER_PAGE = 2;

// const port = parseInt(process.env.PORT + '', 10) || 3000
// // const dev = process.env.NODE_ENV !== 'production'
// const app = next({
//   /* dev */
//   // @ts-ignore
//   // conf: nextConf,
// })
// const handle = app.getRequestHandler()

// // eslint-disable-next-line no-unused-vars
// const queryToDataMap: Record<QueryKey, (variables: any) => any> = {
//   'setting': () => ({
//     contactHref: 'https://example.com/contact',
//     // expertHref: 'https://example.com/contact',
//     defaultOGImage: { url: 'https://example.com/example.jpg' },
//   }),
//   'tech': () => techRecords,
//   'about-stats': () => aboutStatsRecord,
//   'team-gallery': () => ({
//     image_large_1: {
//       "alt": "",
//       "caption": "",
//       "url": "example.jpg",
//     },
//     image_large_2: {
//       "alt": "",
//       "caption": "",
//       "url": "example.jpg",
//     },
//     image_small_1: {
//       "alt": "",
//       "caption": "",
//       "url": "example.jpg",
//     },
//     image_small_2: {
//       "alt": "",
//       "caption": "",
//       "url": "example.jpg",
//     },
//   }),
//   'about-mentions': () => ({ items: partnerRecords }),
//   'team': () => ({ items: aboutTeam }),
//   'partners': () => ({
//     items: partnerRecords.map(({ logo, ...m }) => ({
//       ...m,
//       image: logo,
//     })),
//   }),
//   'product-info': () => {
//     return [{
//       sections: featureRecords.map((feature) => ({
//         id: feature.id,
//         heading: feature.title,
//         description: feature.description,
//         url: feature.url,
//         poster: {
//           url: feature.poster,
//         },
//         tab_heading_1: feature.tabs[0].title,
//         tab_heading_2: feature.tabs[1].title,
//         tab_heading_3: feature.tabs[2].title,
//         tab_content_1: feature.tabs[0].content,
//         tab_content_2: feature.tabs[1].content,
//         tab_content_3: feature.tabs[2].content,
//       })),
//       hero_button: {
//         text: '',
//         url: '',
//         icon: '',
//       },
//     }];
//   },
//   'career-perks': () => ({ items: careerPerks }),
//   'career-jobs': () => {
//     return careerJobRecords;
//   },
//   'course-info': () => ({ url: 'https://example.com/course-info-url' }),
//   'course-info-full': () => ({
//     url: 'https://example.com/course-info-url',
//     content: contentWithHtml('Course/InfoFull'),
//   }),
//   'course-categories': () => trainingCourseCategoryRecords,
//   'course-reviews': () => ({ reviews: trainingCourseReviews }),
//   'course-details': ({ slug }) => {
//     const record = trainingCourseRecords.filter((f) => f.slug === slug)
//     return record.length === 1 ? record : [];
//   },
//   'blog-article': ({ slug }: { slug: string }) => {
//     const record = blogArticleRecords.filter((f) => f.slug === slug);
//     return record.length === 1 ? record : []
//   },
//   'blog-featured': () => ({ list: blogArticleRecords.slice(0, 4).map((m) => ({ blog: m })) }),
// };

// const graphqlReducer = (type: string, variables: Record<string, any>): any => {

//   if (type.indexOf('page/') === 0) {
//     const page = type.split('page/')[1] as PageKey;
//     if (!Object.prototype.hasOwnProperty.call(pageToQueryMap, page)) {
//       throw new Error(`There is no page to query mapping for "${page}". Add to proceed.`);
//     }

//     const { queries } = pageToQueryMap[page];
//     const fullQueries = ['setting' as QueryKey].concat(queries);
//     return fullQueries.reduce<Record<string, any>>((ar, r, rid) => {
//       const key = `r${rid}`;
//       ar[key] = queryToDataMap[r](variables);
//       return ar;
//     }, {})
//   }

//   switch (type) {
//     case 'blog/articles': {
//       let records = blogArticleRecords;
//       if (variables?.limit) {
//         records = records.slice(0, variables?.limit || ITEMS_PER_PAGE)
//       }
//       return { records, total: blogArticleRecords.length };
//     }
//     case 'course/courses': {
//       let records = trainingCourseRecords;
//       if (variables?.limit) {
//         records = records.slice(0, variables?.limit || ITEMS_PER_PAGE)
//       }
//       return { records, total: trainingCourseRecords.length };
//     }
//   }

//   throw new Error(`Oh no, graphql query was not intercepted for ${type}.`);
// }

// app.prepare().then(() => {
//   const server = express()
//   server.use(express.json());

//   // intercept graphql requests
//   server.post('/graphql', (req, res) => {
//     // console.log('POST:GRAPHQL:BODY', req.body);

//     const { variables = {}, type } = req.body;
//     res.json({ data: graphqlReducer(type, variables) });
//   })

//   server.all('*', (req, res) => {
//     return handle(req, res)
//   })

//   server.listen(port, () => {
//     // if (err) throw err
//     console.log(`> Ready on http://localhost:${port}`)
//   })
// });
