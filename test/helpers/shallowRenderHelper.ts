/**
 * Function to get the shallow output for a given component
 * As we are using phantom.js, we also need to include the fn.proto.bind shim!
 *
 * @see http://simonsmith.io/unit-testing-react-components-without-a-dom/
 * @author somonsmith
 */
import React from 'react';
import shallow from 'react-test-renderer/shallow';

/**
 * Get the shallow rendered component
 *
 * @param  {Object} component The component to return the output for
 * @param  {Object} props [optional] The components properties
 * @param  {Mixed} ...children [optional] List of children
 * @return {Object} Shallow rendered output
 */
export default function createComponent(
  component: any,
  props = {},
  ...children: any[]
) {
  const shallowRenderer = shallow.createRenderer();
  shallowRenderer.render(
    React.createElement(
      component,
      props,
      children.length > 1 ? children : children[0]
    )
  );
  return shallowRenderer.getRenderOutput();
}
