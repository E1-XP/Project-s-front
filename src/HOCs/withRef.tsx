import React, { ComponentType, forwardRef, Ref } from 'react';

interface RefObj {
  [key: string]: (ref: Ref<any>) => void;
}

export const withRef = (refKey: string) => (Component: ComponentType) =>
  forwardRef((props: any, ref: any) => {
    const refProp: RefObj = {};
    refProp[refKey] = props[refKey];

    return <Component {...props} {...refProp} />;
  });
