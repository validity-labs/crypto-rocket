module.exports = {
  Swiper: ({ children, ...props }) => {
    return `
      Swiper props:
        ${JSON.stringify(props)}
        ${children.map((child, childIndex) => {
      const { children: _child, ...childProps } = child.props?.children?.props || {}
      return `
          SwiperSlide ${childIndex}:
            ${JSON.stringify(childProps)}`;
    })
      }`
  },
  SwiperSlide: () => 'SwiperSlide(Mock)',
};
