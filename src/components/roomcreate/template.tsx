import * as React from 'react';

import { Props } from './index';

import { RoomCreateForm } from './stage1';
import { ImageSelector } from './stage2';

export const RoomCreateComponent = ({
  handleSubmit,
  state,
  setName,
  currentDrawing,
  setPassword,
  setIsPrivate,
  goToNextStage,
  handleDrawingCreate,
  handleDrawingSelect,
}: Props) => {
  switch (state.formStage) {
    case 1:
      return (
        <RoomCreateForm
          state={state}
          goToNextStage={goToNextStage}
          setName={setName}
          setPassword={setPassword}
          setIsPrivate={setIsPrivate}
        />
      );
    case 2:
      return (
        <ImageSelector
          currentDrawing={currentDrawing}
          handleDrawingCreate={handleDrawingCreate}
          handleSubmit={handleSubmit}
          handleDrawingSelect={handleDrawingSelect}
        />
      );
    default:
      return <p>loading...</p>;
  }
};
