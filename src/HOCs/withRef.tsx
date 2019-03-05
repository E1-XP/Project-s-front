import React, { ComponentType, forwardRef, Ref } from 'react';

interface RefObj {
  [key: string]: (ref: Ref<any>) => void;
}

export const withRef = (...refKeys: string[]) => (Component: ComponentType) =>
  forwardRef((props: any, ref: any) => {
    const refProps: RefObj = {};
    refKeys.forEach(key => (refProps[key] = props[key]));

    return <Component {...props} {...refProps} />;
  });
