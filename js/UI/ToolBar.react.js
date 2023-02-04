
const React = require('react');
const {
  Button, Modal,
  Canvas, RadioPicker,
  Slider,
} = require('bens_ui_components');
const {
  colorToHex, colorToRGBA, rgbaToColor,
} = require('../selectors/colors');
const SettingsModal = require('./SettingsModal.react');
const {config} = require('../config');
const {useEffect, useState, useMemo} = React;


const ToolBar = (props) => {
  const {state, dispatch, getState} = props;

  const toolButtons = [];
  for (const tool of config.tools) {
    toolButtons.push(<Button
      style={{
        margin: '0 auto',
        width: '75%',
      }}
      key={"toolButton_" + tool}
      disabled={state.tool == tool}
      label={tool}
      onClick={() => dispatch({tool})}
    />);
  }

  return (
    <div
      style={{
        width: config.toolBarWidth,
        height: '100%',
        borderRight: '1px solid black',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        paddingTop: 5,
      }}
    >
      <Button
        label="Settings"
        onClick={() => {
          dispatch({type: 'SET_MODAL', modal: <SettingsModal {...props} />});
        }}
      />
      <div>
        <Button
          label="Undo"
          style={{
            width: '50%',
            display: 'inline',
          }}
          onClick={() => {
            dispatch({type: 'UNDO'});
          }}
        />
        <Button
          label="Redo"
          style={{
            width: '50%',
            display: 'inline',
          }}
          onClick={() => {
            dispatch({type: 'REDO'});
          }}
        />
      </div>
      <div
        style={{
          marginTop: 5,
          marginBottom: 5,
        }}
      ><b>Tools</b></div>

      {toolButtons}

      <ToolParameters {...props} />

    </div>
  );
};

const ToolParameters = (props) => {
  const {state, dispatch} = props;

  let content = null;
  if (state.tool == 'PIPETTE') {
    let color = {r: 0, g: 0, b: 0, a: 0};
    if (state.colorPreview) {
      color = rgbaToColor(state.colorPreview);
    }
    content = (
      <div>
        <div
          style={{
            backgroundColor: state.colorPreview,
            width: 50,
            height: 50,
            margin: 'auto',
            marginTop: 5,
          }}
        />
        <div>{colorToHex(color)}</div>
        <div
          style={{
            fontSize: 10,
          }}
        >{colorToRGBA(color)}</div>
      </div>
    );
  } else if(state.tool == 'BUCKET') {
    let color = {r: 0, g: 0, b: 0, a: 0};
    if (state.colorPreview) {
      color = rgbaToColor(state.colorPreview);
    }
    content = (
      <div>
        <div
          style={{
            backgroundColor: state.colorPreview,
            width: 50,
            height: 50,
            margin: 'auto',
            marginTop: 5,
          }}
        />
        <div>{colorToHex(color)}</div>
        <div
          style={{
            fontSize: 10,
          }}
        >{colorToRGBA(color)}</div>
        <div>
          <div>Fuzz Factor</div>
          <Slider
            min={0} max={255}
            value={state.fuzzFactor}
            onChange={(fuzzFactor) => dispatch({fuzzFactor})}
          />
        </div>
      </div>
    );

  } else if (state.tool == 'ERASER' || state.tool == 'PEN') {
    content = (
      <div>
        <div>Stroke Thickness</div>
        <Slider
          min={1} max={20}
          value={state.thickness}
          onChange={(thickness) => dispatch({thickness})}
        />
      </div>
    );
  } else if (state.tool = 'SQUARE') {
    const thickness = (
      <div>
        <div>Border Thickness</div>
        <Slider
          min={1} max={20}
          value={state.thickness}
          onChange={(thickness) => dispatch({thickness})}
        />
      </div>
    );
    content = (
      <div
        style={{
          marginBottom: 10,
        }}
      >
        <RadioPicker
          options={["Filled", "Empty"]}
          selected={state.squareType}
          onChange={(squareType) => dispatch({squareType})}
        />
        {state.squareType == 'Empty' ? thickness : null}
      </div>
    );
  }

  return (
    <div
      style={{
        margin: '5px',
        backgroundColor: 'ghostwhite',
        height: 200,
        border: '4px inset grey',
        paddingTop: 4,
      }}
    >
      {content}
    </div>
  );
};


module.exports = ToolBar;
